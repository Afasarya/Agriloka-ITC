// src/components/education/Detail.tsx
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft, Share2, Bookmark } from 'lucide-react';

interface ArticleDetail {
  title: string;
  category: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      image?: string;
    }[];
  };
}

const article: ArticleDetail = {
  title: 'Cara Memulai Pertanian Hidroponik di Rumah',
  category: 'Hidroponik',
  image: '/images/education1.jpg',
  author: {
    name: 'Dr. Budi Santoso',
    role: 'Ahli Pertanian Hidroponik',
    avatar: '/images/testimonial1.jpg',
  },
  date: '15 Maret 2024',
  readTime: '5 menit',
  content: {
    introduction: 'Pertanian hidroponik adalah metode bercocok tanam tanpa menggunakan tanah sebagai media tanam. Artikel ini akan membahas langkah-langkah dasar untuk memulai sistem hidroponik di rumah Anda.',
    sections: [
      {
        title: 'Apa itu Hidroponik?',
        content: `Hidroponik adalah teknik menanam tanaman dengan menggunakan air dan larutan nutrisi, tanpa menggunakan media tanah. Teknik ini juga dikenal sebagai soilless culture. 
Dalam hidroponik, tanaman menyerap nutrisi langsung melalui akarnya. Larutan nutrisi yang digunakan dibuat dengan melarutkan garam pupuk dalam air. 
Beberapa unsur penting dalam hidroponik adalah: 
Larutan nutrisi yang mengandung mineral yang dibutuhkan tanaman,
Air berkualitas baik dengan kandungan logam berat yang sedikit,
Oksigen yang diberikan ke dalam larutan nutrisi,
Media tanam yang dapat berupa batu bata, pasir, kerikil, arang sekam, spons, dan batu apung.`,
        image: '/images/educational2.webp',
      },
      // Add more sections...
    ],
  },
};

export default function ArticleDetail() {
  return (
    <article className="py-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/education">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-muted-foreground mb-8 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </motion.button>
        </Link>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} membaca</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden"
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-muted/30">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-medium">{article.author.name}</h3>
              <p className="text-sm text-muted-foreground">{article.author.role}</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-gray max-w-none mb-12">
            <p className="text-lg leading-relaxed">
              {article.content.introduction}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {article.content.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
                {section.image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Share and Save */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-muted"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-muted"
              >
                <Bookmark className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}