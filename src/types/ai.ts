export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export interface AIResponse {
  message: string;
  sources?: SearchResult[];
}

export interface VisionResponse {
  description: string;
  tags: string[];
}

export interface AudioResponse {
  transcript: string;
}

export type AIMode = 'chat' | 'search' | 'vision' | 'audio';

export interface LocationData {
  id: string;
  name: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface RecommendedCrop {
  name: string;
  yield: string;
  duration: string;
  suitability: number;
  economicValue: string;
}

export interface CropAnalysis {
  suitableCrops: string[];
  recommendedCrops: RecommendedCrop[];
  successRate: number;
  tips: string[];
  weatherConditions: WeatherData;
  sources: SearchResult[];
  conclusion: {
    potentialSuccess: string;
    economicAnalysis: string;
    mainRecommendations: string;
    actionPlan: string;
    sustainability: string;
  };
}