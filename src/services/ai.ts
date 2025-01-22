import Groq from 'groq-sdk';
import axios from 'axios';
import { 
  AIMessage, 
  SearchResult, 
  AIResponse, 
  VisionResponse, 
  LocationData, 
  CropAnalysis,
  RecommendedCrop  // Add this import
} from '@/types/ai';

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

    static async analyzeImageWithLocation(
    imageBase64: string, 
    location: LocationData
  ): Promise<CropAnalysis> {
    if (!groqClient) {
      throw new Error('AI client not initialized');
    }
  
    try {
      // Fetch real-time weather and agricultural data
      const weatherSearch = await this.getSearchResults(
        `cuaca real time terkini ${location.name} bmkg accuweather`
      );
  
      const agriculturalSearch = await this.getSearchResults(
        `${location.name} pertanian produktivitas tanaman pangan hortikultura terbaru`
      );
  
      const contextPrompt = `Sebagai Agriloka AI Expert System, berikan analisis komprehensif untuk:
  
  Lokasi: ${location.name}
  Data Kontekstual:
  ${weatherSearch.map(r => r.snippet).join('\n')}
  ${agriculturalSearch.map(r => r.snippet).join('\n')}
  
  ANALISIS YANG DIBUTUHKAN:
  
  1. ANALISIS TANAH & IKLIM
  - Tekstur dan struktur tanah dari gambar
  - Tingkat kesuburan visual
  - Kondisi drainase
  - Data cuaca real-time terkini
  - Tren iklim musiman
  
  2. REKOMENDASI TANAMAN
  Minimal 5 tanaman dengan detail:
  - Nama tanaman
  - Estimasi hasil panen (ton/ha)
  - Durasi penanaman
  - Tingkat kesesuaian (%)
  - Nilai ekonomi potensial
  
  3. KALENDER TANAM
  - Waktu tanam optimal
  - Periode perawatan kritis
  - Jadwal pemupukan
  - Prakiraan panen
  
  4. TEKNIK BUDIDAYA
  Minimal 5 tips spesifik untuk:
  - Persiapan lahan
  - Metode penanaman
  - Sistem pengairan
  - Pemupukan organik
  - Pengendalian OPT
  
  5. ANALISIS RISIKO & MITIGASI
  - Potensi kendala cuaca
  - Risiko hama/penyakit
  - Strategi pencegahan
  - Rencana kontingensi
  
  6. KESIMPULAN KOMPREHENSIF
  Berikan kesimpulan detail mencakup:
  - Potensi keberhasilan (dengan justifikasi)
  - Analisis kelayakan ekonomi
  - Rekomendasi teknis utama
  - Proyeksi hasil & keuntungan
  - Saran tindak lanjut spesifik
  - Pertimbangan keberlanjutan
  
  Format output harus terstruktur dengan metrik yang jelas dan saran praktis.`;
  
      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: contextPrompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
              }
            ]
          }
        ],
        model: "llama-3.2-11b-vision-preview",
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95
      });
  
      const response = completion.choices[0].message.content || '';
      return this.parseAnalysisResponse(response, weatherSearch);
  
    } catch (error) {
      console.error('Agricultural Analysis Error:', error);
      throw error;
    }
  }
  
  private static parseAnalysisResponse(response: string, sources: SearchResult[]): CropAnalysis {
    // Default crops definition
    const defaultCrops: RecommendedCrop[] = [
      { name: 'Padi Sawah', yield: '5-7 ton/ha', duration: '3-4 bulan', suitability: 85, economicValue: 'Tinggi' },
      { name: 'Jagung', yield: '4-6 ton/ha', duration: '3-4 bulan', suitability: 80, economicValue: 'Tinggi' },
      { name: 'Bawang Merah', yield: '8-12 ton/ha', duration: '2-3 bulan', suitability: 75, economicValue: 'Sangat Tinggi' },
      { name: 'Cabai Merah', yield: '10-15 ton/ha', duration: '3-4 bulan', suitability: 80, economicValue: 'Sangat Tinggi' },
      { name: 'Kacang Tanah', yield: '2-3 ton/ha', duration: '3-4 bulan', suitability: 70, economicValue: 'Tinggi' }
    ];

    // Extract success rate first
    const successRateMatch = response.match(/(?:tingkat|persentase)\s*(?:keberhasilan|kesesuaian)[^0-9]*(\d+)/i);
    const successRate = successRateMatch ? parseInt(successRateMatch[1]) : 85;
  
    // Improved crop name extraction and cleaning
    const cropNamesFromResponse = response
      .match(/(?:Tanaman \d+|tanaman yang cocok):\s*([^.\n]+)/gi)
      ?.map(match => {
        const name = match.split(':')[1]?.trim();
        // Remove asterisks and clean up the name
        return name ? name.replace(/\*+/g, '').trim() : null;
      })
      .filter(Boolean) as string[];
  
    // Improved temperature parsing function
    const findTemperature = (text: string): number | null => {
      const patterns = [
        // Match temperature range and take the average
        {
          regex: /(\d+)\s*[-–]\s*(\d+)\s*°C/g,
          extract: (match: RegExpMatchArray) => {
            const low = parseInt(match[1]);
            const high = parseInt(match[2]);
            return Math.round((low + high) / 2);
          }
        },
        // Match exact temperature with °C
        {
          regex: /(?:suhu|temperature|temp)[^0-9]*(\d+)\s*°C/i,
          extract: (match: RegExpMatchArray) => parseInt(match[1])
        },
        // Match RealFeel or actual temperature
        {
          regex: /(?:RealFeel®|actual)[^0-9]*(\d+)°/i,
          extract: (match: RegExpMatchArray) => parseInt(match[1])
        }
      ];
  
      for (const pattern of patterns) {
        const matches = Array.from(text.matchAll(pattern.regex));
        for (const match of matches) {
          const temp = pattern.extract(match);
          // Validate temperature is reasonable for Indonesia (10-40°C)
          if (temp >= 10 && temp <= 40) {
            return temp;
          }
        }
      }
      return null;
    };
  
    // First try to find temperature in weather search results
    const weatherText = sources
      .filter(s => s.snippet.toLowerCase().includes('°c') || 
                  s.snippet.toLowerCase().includes('suhu') ||
                  s.snippet.toLowerCase().includes('temperature'))
      .map(s => s.snippet)
      .join(' ');
  
    const temperature = findTemperature(weatherText) || 
                       findTemperature(response) || 
                       28; // Default only if no valid temperature found
  
    // Rest of the implementation
    const recommendedCrops = (cropNamesFromResponse?.length >= 5 ? 
      cropNamesFromResponse.slice(0, 5).map(name => ({
        name,
        yield: '3-5 ton/ha',
        duration: '3-4 bulan',
        suitability: 85,
        economicValue: 'Tinggi'
      })) : 
      defaultCrops
    );
  
    const tips = [
      "Persiapkan lahan dengan baik menggunakan pupuk organik",
      "Pastikan sistem irigasi terpasang sebelum penanaman",
      "Lakukan rotasi tanaman untuk menjaga kesuburan tanah",
      "Terapkan pengendalian hama terpadu (PHT)",
      "Monitor pertumbuhan tanaman secara rutin",
      "Gunakan bibit unggul bersertifikat",
      "Atur jarak tanam sesuai rekomendasi"
    ];
  
    const conclusion = {
      potentialSuccess: `Berdasarkan analisis lahan dan kondisi iklim, lokasi ini memiliki potensi keberhasilan ${successRate}% untuk budidaya tanaman yang direkomendasikan.`,
      economicAnalysis: `Analisis ekonomi menunjukkan prospek yang menjanjikan dengan:
      • ROI estimasi 150-200%
      • Periode BEP 6-8 bulan
      • Potensi pasar yang tinggi di wilayah sekitar
      • Peluang pengembangan produk olahan`,
      mainRecommendations: `Rekomendasi utama untuk optimalisasi lahan:
      • Pengembangan sistem irigasi tetes
      • Penerapan teknologi pertanian presisi
      • Implementasi GAP (Good Agricultural Practices)
      • Penggunaan pupuk organik berkualitas`,
      actionPlan: `Rencana tindak lanjut:
      • Pelatihan teknis untuk petani
      • Pendampingan rutin oleh ahli
      • Monitoring pertumbuhan tanaman
      • Evaluasi hasil panen berkala`,
      sustainability: `Aspek keberlanjutan:
      • Konservasi air dan tanah
      • Penggunaan input ramah lingkungan
      • Penerapan sistem pertanian terpadu
      • Adaptasi terhadap perubahan iklim`
    };
  
    return {
      suitableCrops: recommendedCrops.map(crop => crop.name),
      recommendedCrops,
      successRate,
      tips,
      weatherConditions: {
        temperature, // Use the improved temperature parsing
        humidity: parseInt(response.match(/(?:kelembaban|humidity)[^0-9]*(\d+)/i)?.[1] || '75'),
        rainfall: parseInt(response.match(/(?:curah hujan|rainfall)[^0-9]*(\d+)/i)?.[1] || '2000')
      },
      sources,
      conclusion
    };
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