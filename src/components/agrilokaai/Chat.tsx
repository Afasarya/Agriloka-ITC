"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { AIService } from '@/services/ai';
import { SearchResult } from '@/types/ai';
import Image from 'next/image';
import { ImageDialog } from './ImageDialog';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sources?: SearchResult[];
  imageUrl?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Prediksi Cuaca',
    description: 'Dapatkan informasi cuaca untuk perencanaan pertanian yang lebih baik',
    icon: '🌦️',
  },
  {
    id: '2',
    title: 'Analisis Tanah',
    description: 'Tanyakan tentang kondisi tanah dan rekomendasi perawatan',
    icon: '🌱',
  },
  {
    id: '3',
    title: 'Hama & Penyakit',
    description: 'Identifikasi dan solusi masalah hama atau penyakit tanaman',
    icon: '🐛',
  },
];

const formatBotMessage = (text: string) => {
  // Handle numbered lists (1. 2. 3. etc)
  text = text.replace(/^\d+\.\s/gm, '<br>• ');
  
  // Handle bullet points
  text = text.replace(/^[-•]\s/gm, '• ');
  
  // Handle bold text
  text = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  
  // Add spacing between sections
  text = text.replace(/\n\n/g, '<br><br>');
  
  // Split into paragraphs
  const paragraphs = text.split('<br><br>').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => (
    <p 
      key={index} 
      className={`mb-3 ${
        paragraph.startsWith('•') 
          ? 'ml-4 list-item' 
          : paragraph.includes('<strong>') 
            ? 'font-medium' 
            : ''
      }`}
      dangerouslySetInnerHTML={{ __html: paragraph }}
    />
  ));
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [showImageDialog, setShowImageDialog] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setShowImageDialog(true);
    }
  };

  const handleImageAnalysis = async (question: string) => {
    if (!selectedImage || !question.trim()) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'user',
          content: question,
          timestamp: new Date(),
          imageUrl: imagePreviewUrl
        }]);
        setIsTyping(true);

        try {
          const response = await AIService.analyzeImage(base64String);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: response.description,
            timestamp: new Date()
          }]);
        } catch (error) {
          console.error('Image analysis error:', error);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: 'Maaf, terjadi kesalahan saat menganalisis gambar',
            timestamp: new Date()
          }]);
        } finally {
          setIsTyping(false);
          setShowImageDialog(false);
          setSelectedImage(null);
          setImagePreviewUrl('');
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleInitialChat = () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: 'Halo! Saya AI Agriloka. Ada yang bisa saya bantu seputar pertanian?',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  useEffect(() => {
    handleInitialChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (searchEnabled) {
        const response = await AIService.getSearchEnhancedResponse(input);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.message,
          timestamp: new Date(),
          sources: response.sources
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const response = await AIService.getChatCompletion([
          { role: 'user', content: input }
        ]);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const LoadingIndicator = () => (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="animate-pulse">●</div>
      <div className="animate-pulse animation-delay-200">●</div>
      <div className="animate-pulse animation-delay-400">●</div>
    </div>
  );

  // ... existing useEffect and scrollToBottom functions ...

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header - No initial animation */}
        <div className="chat-header text-center mb-12 relative opacity-100">
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
          
          <div className="inline-block">
            <Sparkles className="w-12 h-12 text-primary mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Yuk Tanya dengan AI Agriloka
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dapatkan jawaban cepat dan akurat untuk pertanyaan seputar pertanian Anda
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16 relative">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl border shadow-xl relative overflow-hidden">
            <div ref={chatContainerRef} className="chat-container h-[500px] overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                      message.type === 'user' ? 'bg-primary text-white' : 'bg-muted/50'
                    }`}>
                      {message.imageUrl && (
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                          <Image 
                            src={message.imageUrl}
                            alt="Uploaded"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {message.type === 'bot' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {formatBotMessage(message.content)}
                        </div>
                      ) : (
                        message.content
                      )}
                      
                      {message.sources && (
                        <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                          <p className="text-sm font-medium mb-1">Sumber:</p>
                          <ul className="space-y-1">
                            {message.sources.map((source, idx) => (
                              <li key={idx} className="text-sm">
                                <a 
                                  href={source.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex"
                  >
                    <LoadingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t bg-background/50 backdrop-blur-md">
              {searchEnabled && (
                <div className="mb-2 text-sm text-primary flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Pencarian web diaktifkan. AI akan menyertakan sumber online dalam tanggapan.</span>
                  <button 
                    onClick={() => setSearchEnabled(false)}
                    className="ml-auto hover:text-primary/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanyakan sesuatu..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-background/50 border"
                />

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchEnabled(!searchEnabled)}
                    className={`p-2.5 rounded-xl transition-all ${
                      searchEnabled ? 'bg-primary text-white' : 'bg-muted'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-muted"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations - No initial animation */}
        <div className="recommendations mb-16 opacity-100">
          <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">
            Rekomendasi Pertanyaan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="recommendation-card bg-card rounded-lg border p-6 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <span className="text-2xl">{rec.icon}</span>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{rec.title}</h3>
                <p className="text-muted-foreground text-sm">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add ImageDialog */}
      {showImageDialog && (
        <ImageDialog
          imageUrl={imagePreviewUrl}
          onClose={() => {
            setShowImageDialog(false);
            setSelectedImage(null);
            setImagePreviewUrl('');
          }}
          onSubmit={handleImageAnalysis}
        />
      )}
    </section>
  );
}
