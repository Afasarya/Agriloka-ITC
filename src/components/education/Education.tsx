// src/components/education/Education.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
}

const categories = [
  'Semua',
  'Pertanian Modern',
  'Organik',
  'Hidroponik',
  'Peternakan',
  'Agribisnis',
  'Tips & Trik',
];

const articles: Article[] = [
  {
    id: '1',
    title: 'Cara Memulai Pertanian Hidroponik di Rumah',
    description: 'Pelajari teknik dasar untuk memulai berkebun hidroponik dari rumah Anda sendiri.',
    category: 'Hidroponik',
    image: '/images/education1.jpg',
    author: 'Dr. Budi Santoso',
    readTime: '5 menit',
    date: '2024-03-15',
  },
  // Add more articles...
];

export default function Education() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Sparkles className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Edukasi Pertanian
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Tingkatkan pengetahuan dan keterampilan bertani Anda melalui artikel dan tutorial berkualitas
            </p>

            {/* Floating Search Bar */}
            <motion.div
              className={`max-w-2xl mx-auto transform transition-all duration-200 ${
                searchFocused ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-background/80 backdrop-blur-sm hover:bg-background/90 focus:bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 -mt-8">
        <motion.div
          className="bg-background/80 backdrop-blur-sm rounded-2xl border p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href="/education/detail">
                <motion.article
                  className="group bg-background rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <motion.span
                        className="px-4 py-2 bg-primary/90 text-primary-foreground text-sm rounded-full backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        {article.category}
                      </motion.span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-primary"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}