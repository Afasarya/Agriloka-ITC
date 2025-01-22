"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Sprout, 
  ThermometerSun, 
  Link2,
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  CloudRain,
  Leaf // Alternative for Plant icon
} from 'lucide-react';
import Image from 'next/image';
import { AIService } from '@/services/ai';
import { LocationData } from '@/types/ai';

// Add WeatherData interface
interface WeatherData {
  temperature: string;
  humidity: string;
  rainfall: string;
  forecast: string;
}

// Update CropAnalysis interface
interface CropAnalysis {
  suitableCrops: string[];
  tips: string[];
  weather?: WeatherData;
  conclusion: {
    potentialSuccess: string;
    economicAnalysis: string;
    mainRecommendations: string;
    actionPlan: string;
    sustainability: string;
  };
  sources: {
    title: string;
    link: string;
    snippet: string;
  }[];
}

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
  const [activeTab, setActiveTab] = useState('crops');

  // Tabs configuration
  const tabs = [
    { id: 'crops', label: 'Tanaman', icon: Leaf }, // Changed from Plant to Leaf
    { id: 'weather', label: 'Cuaca', icon: CloudRain },
    { id: 'tips', label: 'Tips', icon: Sprout },
    { id: 'conclusion', label: 'Kesimpulan', icon: CheckCircle2 },
  ];

  

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
      
      // Update the analysis section
      const analysisResult = (await AIService.analyzeImageWithLocation(
        base64Image,
        selectedLocation
      )) as CropAnalysis & { weather?: WeatherData };

      setAnalysis({
        ...analysisResult,
        weather: analysisResult.weather || {
          temperature: '',
          humidity: '',
          rainfall: '',
          forecast: ''
        }
      });
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
    <section className="min-h-screen pb-24"> {/* Added bottom padding to section */}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-24">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          {/* Animated Gradient Blobs */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 right-[20%]"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-12 h-12 text-primary/20" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-[15%]"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sprout className="w-16 h-16 text-primary/15" />
          </motion.div>
          <motion.div
            className="absolute top-32 left-[25%]"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudRain className="w-10 h-10 text-primary/20" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm">
                <Sprout className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Analisis Lahan Pertanian
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dapatkan rekomendasi tanaman dan analisis kondisi lahan Anda dengan bantuan AI
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Analisis Cepat</span>
              <span className="mx-2">•</span>
              <ThermometerSun className="w-4 h-4 text-primary" />
              <span>Data Cuaca</span>
              <span className="mx-2">•</span>
              <Leaf className="w-4 h-4 text-primary" />
              <span>Rekomendasi Tanaman</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16"> {/* Added container bottom padding */}
        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border p-8 shadow-lg mb-8" // Added margin bottom
        >
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
              {imagePreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg"
                  >
                    <Camera className="h-5 w-5" />
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer py-8"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                  <p className="text-muted-foreground">
                    Klik untuk upload atau ambil foto lahan
                  </p>
                </motion.div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Location Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provinsi</label>
                <select
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kabupaten/Kota</label>
                <select
                  onChange={(e) => {
                    const location = regencies.find((r) => r.id === e.target.value);
                    if (location) setSelectedLocation(location);
                  }}
                  className="w-full px-3 py-2 rounded-lg border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
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

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={loading || !selectedImage || !selectedLocation}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menganalisis...</span>
                </div>
              ) : (
                "Analisis Lahan"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto mt-4 mb-8" // Added margin bottom
            >
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mt-12 mb-16" // Added margin bottom
            >
              {/* Tabs */}
              <div className="flex overflow-x-auto space-x-2 mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground dark:text-foreground/80'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="bg-card border rounded-2xl p-6 shadow-lg dark:bg-background/50 dark:backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  {activeTab === 'crops' && (
                    <motion.div
                      key="crops"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                        <Leaf className="mr-2 text-primary" />
                        Tanaman yang Cocok
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {analysis.suitableCrops.map((crop, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 text-foreground"
                          >
                            {crop}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'weather' && (
                    <motion.div
                      key="weather"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-background dark:bg-background/50 border">
                          <h4 className="font-medium text-foreground mb-2">Suhu</h4>
                          <p className="text-muted-foreground">{analysis?.weather?.temperature}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background dark:bg-background/50 border">
                          <h4 className="font-medium text-foreground mb-2">Kelembaban</h4>
                          <p className="text-muted-foreground">{analysis?.weather?.humidity}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background dark:bg-background/50 border">
                          <h4 className="font-medium text-foreground mb-2">Curah Hujan</h4>
                          <p className="text-muted-foreground">{analysis?.weather?.rainfall}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background dark:bg-background/50 border">
                          <h4 className="font-medium text-foreground mb-2">Prakiraan</h4>
                          <p className="text-muted-foreground">{analysis?.weather?.forecast}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tips' && (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
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
                    </motion.div>
                  )}

                  {activeTab === 'conclusion' && (
                    <motion.div
                      key="conclusion"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}