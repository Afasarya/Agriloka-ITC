import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.SERPAPI_KEY;

  console.log('Search API Debug:');
  console.log('- Query:', query);
  console.log('- API Key exists:', !!apiKey);
  console.log('- API Key length:', apiKey?.length);

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const searchUrl = new URL('https://serpapi.com/search.json');
    searchUrl.searchParams.append('engine', 'google');
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('api_key', apiKey);
    searchUrl.searchParams.append('num', '5');

    console.log('Fetching URL:', searchUrl.toString());

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    console.log('SERP Response status:', response.status);
    console.log('SERP Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`SERP API error: ${data.error || response.statusText}`);
    }

    if (!data.organic_results) {
      throw new Error('No organic results in SERP response');
    }

    return NextResponse.json({
      organic_results: data.organic_results
    });
  } catch (error) {
    console.error('SERP API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch search results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}