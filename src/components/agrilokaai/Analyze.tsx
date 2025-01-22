'use client';

import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/ai';
import { LocationData, CropAnalysis } from '@/types/ai';
import Image from 'next/image';
import { 
  Camera, 
  Upload, 
  Sprout, // Replace Plant
  ThermometerSun, 
  Link2,
} from 'lucide-react';

export default function Analyze() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [analysis, setAnalysis] = useState<CropAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [regencies, setRegencies] = useState<LocationData[]>([]);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Update fetchProvinces with better error handling
  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/location');
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();
      setProvinces(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load locations';
      setError(message);
    }
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

 // Update handleProvinceChange with better error handling
 const handleProvinceChange = async (provinceId: string) => {
    if (!provinceId) return;
    
    try {
      const response = await fetch(`/api/location?type=regencies&id=${provinceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch regencies');
      }
      const data = await response.json();
      setRegencies(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load regencies';
      setError(message);
    }
  };


   // Update handleAnalyze with better error handling
   const handleAnalyze = async () => {
    if (!selectedImage || !selectedLocation) {
      setError('Pilih gambar dan lokasi terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      
      const readerPromise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });

      reader.readAsDataURL(selectedImage);
      
      const result = await readerPromise;
      const base64Image = (result as string).split(',')[1];
      
      const analysisResult = await AIService.analyzeImageWithLocation(
        base64Image,
        selectedLocation
      );
      
      setAnalysis(analysisResult);
    } catch (err) {
      const message = err instanceof Error ? 
        err.message : 
        'Gagal menganalisis. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Analisis Lahan Pertanian
      </h1>

      {/* Image Upload Section */}
      <div className="mb-8">
        <div className="max-w-xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="relative h-64 w-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg"
                >
                  <Camera className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  Klik untuk upload atau ambil foto lahan
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Location Selection */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-4">
          <select
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              const location = regencies.find((r) => r.id === e.target.value);
              if (location) setSelectedLocation(location);
            }}
            className="p-2 border rounded"
          >
            <option value="">Pilih Kabupaten/Kota</option>
            {regencies.map((regency) => (
              <option key={regency.id} value={regency.id}>
                {regency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analysis Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleAnalyze}
          disabled={loading || !selectedImage || !selectedLocation}
          className="bg-green-600 text-white px-8 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Menganalisis...' : 'Analisis Lahan'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-8">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Suitable Crops */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
    <Sprout className="mr-2" />
    Tanaman yang Cocok
  </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analysis.suitableCrops.map((crop, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    {crop}
                  </div>
                ))}
              </div>
            </div>

            {/* Success Rate */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Tingkat Keberhasilan
              </h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      {analysis.successRate}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{ width: `${analysis.successRate}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ThermometerSun className="mr-2" />
                Kondisi Cuaca
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Suhu</p>
                  <p className="text-lg font-semibold">
                    {analysis.weatherConditions.temperature}°C
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Kelembaban</p>
                  <p className="text-lg font-semibold">
                    {analysis.weatherConditions.humidity}%
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Curah Hujan</p>
                  <p className="text-lg font-semibold">
                    {analysis.weatherConditions.rainfall} mm
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Tips Implementasi</h3>
              <ul className="space-y-2">
                {analysis.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Sources and Conclusion sections after Tips */}
            <div>
              {/* Existing Tips section */}
              
              {/* Conclusion Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Kesimpulan</h3>
                <div className="p-4 bg-green-50 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Potensi Keberhasilan</h4>
                    <p className="text-gray-700">{analysis.conclusion.potentialSuccess}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Analisis Ekonomi</h4>
                    <p className="text-gray-700">{analysis.conclusion.economicAnalysis}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Rekomendasi Utama</h4>
                    <p className="text-gray-700">{analysis.conclusion.mainRecommendations}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Rencana Tindak Lanjut</h4>
                    <p className="text-gray-700">{analysis.conclusion.actionPlan}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Aspek Keberlanjutan</h4>
                    <p className="text-gray-700">{analysis.conclusion.sustainability}</p>
                  </div>
                </div>
              </div>

              {/* Sources Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Link2 className="mr-2" />
                  Sumber Data
                </h3>
                <div className="space-y-3">
                  {analysis.sources.map((source, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <a 
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {source.title}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}