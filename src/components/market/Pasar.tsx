// src/components/market/Pasar.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ParallaxWrapper from '@/components/common/ParallaxWrapper';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Beras Organik Premium',
    price: 150000,
    image: '/products/beras.jpg',
    category: 'Hasil Panen',
    rating: 4.8,
    sold: 500,
  },
  // Add more products...
];

const categories = [
  'Semua',
  'Hasil Panen',
  'Alat Tani',
  'Bibit',
  'Pupuk',
  'Pestisida',
];

export default function Pasar() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <ParallaxWrapper>
          <div className="text-center mb-16 relative">
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pasar Tani Digital
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Temukan hasil panen terbaik dan kebutuhan pertanian lengkap di sini
            </p>
          </div>
        </ParallaxWrapper>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Produk Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/market/${product.id}`} key={product.id}>
                <motion.div
                  className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="mx-1">•</span>
                      <span>Terjual {product.sold}</span>
                    </div>
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-semibold">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Semua Produk</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Same product card component as above */}
          </div>
        </div>
      </div>
    </section>
  );
}