import Groq from "groq-sdk";
import axios from "axios";
import { AIMessage, SearchResult, AIResponse, VisionResponse, AudioResponse } from '@/types/ai';

const groqClient = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export class AIService {
  // Chat completion with Groq
  static async getChatCompletion(messages: AIMessage[]): Promise<string> {
    try {
      const completion = await groqClient.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // Vision analysis
  static async analyzeImage(imageBase64: string): Promise<VisionResponse> {
    try {
      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Kamu adalah seorang ahli pertanian dan perkebunan Indonesia dengan pengalaman lebih dari 20 tahun.
                Tolong analisis gambar ini dan berikan saran praktis tentang:
                - Waktu terbaik untuk menanam di Jawa Tengah
                - Kondisi tanah dan iklim yang dibutuhkan
                - Teknik perawatan yang tepat
                - Musim tanam ideal di Indonesia
                - Tips khusus untuk wilayah Jawa Tengah
                
                Berikan jawaban dalam Bahasa Indonesia yang mudah dipahami seperti seorang petani berpengalaman.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        model: "llama-3.2-11b-vision-preview",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });

      return {
        description: completion.choices[0].message.content,
        tags: []
      };
    } catch (error) {
      console.error('Vision Error:', error);
      throw new Error('Gagal menganalisis gambar');
    }
  }

  // Search with SERP API
  private static async getSearchResults(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get('/api/search', {
        params: { q: query }
      });

      return response.data.organic_results.map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet
      }));
    } catch (error) {
      console.error('Search API Error:', error);
      throw new Error('Failed to get search results');
    }
  }

  // Search-enhanced completion
  static async getSearchEnhancedResponse(query: string): Promise<AIResponse> {
    try {
      const searchResults = await this.getSearchResults(query);
      const context = searchResults
        .slice(0, 5)
        .map(result => `${result.title}\n${result.snippet}`)
        .join('\n\n');
      
      const aiPrompt = `Based on these search results:\n\n${context}\n\nQuery: ${query}\n\nResponse:`;
      const aiResponse = await this.getChatCompletion([
        { role: 'user', content: aiPrompt }
      ]);

      return {
        message: aiResponse,
        sources: searchResults.slice(0, 5)
      };
    } catch (error) {
      console.error('Search Enhanced Response Error:', error);
      throw new Error('Failed to get search-enhanced response');
    }
  }

  // Audio transcription
  static async transcribeAudio(audioBlob: Blob): Promise<AudioResponse> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);

      const transcription = await groqClient.audio.transcriptions.create({
        file: audioBlob,
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json"
      });

      return {
        transcript: transcription.text
      };
    } catch (error) {
      console.error('Audio Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }
}