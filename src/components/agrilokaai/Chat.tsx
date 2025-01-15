// src/components/chat/Chat.tsx
"use client";

import { useState } from 'react'; // Remove useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';

// ... interfaces and recommendations stay the same

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Ini adalah simulasi respons AI. Implementasikan API AI Anda di sini.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

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

        {/* Chat Interface */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          {/* Floating gradient circles */}
          <div className="absolute -z-10 top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -z-10 bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          
          <div className="bg-card/80 backdrop-blur-md rounded-2xl border shadow-xl relative overflow-hidden">
            {/* Chat container with custom scrollbar */}
            <div 
              className="chat-container h-[500px] overflow-y-auto p-4 space-y-4 scroll-smooth
              scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30"
            >
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
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${message.type === 'user' 
                        ? 'bg-gradient-to-br from-primary to-primary/80' 
                        : 'bg-gradient-to-br from-secondary to-secondary/80'
                      }`}
                    >
                      {message.type === 'user' ? '👤' : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message bubble */}
                    <motion.div 
                      className={`max-w-[70%] rounded-2xl p-3.5 
                        ${message.type === 'user' 
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto' 
                          : 'bg-gradient-to-br from-muted to-muted/90'
                        }
                        hover:shadow-lg transition-shadow duration-200`
                      }
                      whileHover={{ scale: 1.01 }}
                    >
                      {message.type === 'bot' ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="typing-content"
                        >
                          {isTyping ? (
                            <div className="flex space-x-2">
                              {[0, 1, 2].map((dot) => (
                                <motion.div
                                  key={dot}
                                  className="w-2 h-2 rounded-full bg-primary/60"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 1, 0.3],
                                  }}
                                  transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: dot * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {message.content}
                            </motion.span>
                          )}
                        </motion.div>
                      ) : (
                        message.content
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Floating input area */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanyakan sesuatu..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-background/50 border hover:bg-background/80 
                    focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
                    hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-200"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
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
    </section>
  );
}