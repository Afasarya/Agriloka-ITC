import Groq from 'groq-sdk';
import axios from 'axios';
import { AIMessage, SearchResult, AIResponse, VisionResponse } from '@/types/ai';

interface SearchApiResult {
  title: string;
  link: string;
  snippet: string;
}

const API_MESSAGE = `
⚠️ Catatan untuk Penilai/Evaluator:
Aplikasi ini membutuhkan konfigurasi API key untuk fungsi AI.
Silakan hubungi tim pengembang untuk mendapatkan API key yang valid.

Untuk testing, dapat menggunakan API key demo:
NEXT_PUBLIC_GROQ_API_KEY=gsk_xxxxx
SERPAPI_KEY=xxxxx

API KEY sudah di berikan kepada salah satu panitia lomba nya silahkan bisa koordinasikan dengan panitia lomba nya.
fitur search dan chatbot nya sudah bisa di coba. Jika sudah memasukan API KEY nya.
File .env.local perlu dibuat dengan API key yang sesuai.
`;

let groqClient: Groq | null = null;

try {
  if (process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    groqClient = new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }
} catch (error) {
  console.warn('Failed to initialize Groq client:', error);
}

export class AIService {
  private static readonly SYSTEM_PROMPT = `Anda adalah AI Agriloka, asisten pertanian pintar yang dirancang khusus untuk petani Indonesia.
Latar belakang: Agriloka adalah platform digital inovatif yang membantu petani Indonesia dengan teknologi modern untuk:
- Pengelolaan lahan dan analisis tanah
- Prediksi cuaca dan perencanaan pertanian
- Identifikasi hama dan penyakit tanaman
- Akses pasar dan informasi pertanian terkini

Panduan menjawab:
1. Berikan jawaban praktis dan mudah diterapkan
2. Fokus pada konteks pertanian Indonesia, terutama kondisi lokal
3. Utamakan solusi yang berkelanjutan dan ramah lingkungan
4. Gunakan bahasa yang sederhana dan mudah dipahami petani
5. Sertakan tips implementasi dan praktik terbaik
6. Dukung SDGs terutama untuk kesejahteraan petani
`;

  // Chat completion with Groq
  static async getChatCompletion(messages: AIMessage[]): Promise<string> {
    if (!groqClient) {
      return API_MESSAGE;
    }

    try {
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          ...messages
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7, // Reduced for more consistent responses
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });
      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // Vision analysis
  static async analyzeImage(imageBase64: string): Promise<VisionResponse> {
    if (!groqClient) {
      return {
        description: API_MESSAGE,
        tags: []
      };
    }

    try {
      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analisis gambar ini dan identifikasi:
1. Jenis tanaman atau kondisi yang terlihat
2. Masalah atau potensi yang terdeteksi
3. Rekomendasi perawatan spesifik

Berikan saran praktis untuk:
1. Waktu tanam optimal di Jawa Tengah
2. Kebutuhan tanah dan iklim
3. Teknik perawatan yang tepat
4. Tips khusus untuk wilayah tersebut

Format jawaban dengan rapi menggunakan poin-poin.`
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

      // Format the response to remove any system prompts
      const response = completion.choices[0].message.content || '';
      const formattedResponse = response.replace(/^(Analisis gambar|Berikan saran praktis|Format jawaban).*$/gm, '').trim();

      return {
        description: formattedResponse,
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

      return response.data.organic_results.map((result: SearchApiResult) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet
      }));
    } catch (error) {
      console.error('Search API Error:', error);
      throw new Error('Failed to get search results');
    }
  }

  // Search-enhanced completion with better prompting
  static async getSearchEnhancedResponse(query: string): Promise<AIResponse> {
    try {
      const searchResults = await this.getSearchResults(query);
      
      // If no results, return early
      if (!searchResults || searchResults.length === 0) {
        return {
          message: "Maaf, tidak dapat menemukan hasil pencarian yang relevan.",
          sources: []
        };
      }

      const context = searchResults
        .slice(0, 5)
        .map(result => `${result.title}\n${result.snippet}`)
        .join('\n\n');
      
      const aiPrompt = `Berdasarkan hasil pencarian berikut:
      ${context}
      Pertanyaan: ${query}
      ...`;

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
}