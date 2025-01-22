import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  const baseUrl = 'https://emsifa.github.io/api-wilayah-indonesia/api';
  
  try {
    let url = `${baseUrl}/provinces.json`;
    
    if (type === 'regencies' && id) {
      url = `${baseUrl}/regencies/${id}.json`;
    } else if (type === 'districts' && id) {
      url = `${baseUrl}/districts/${id}.json`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Location API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch location data' }, { status: 500 });
  }
}