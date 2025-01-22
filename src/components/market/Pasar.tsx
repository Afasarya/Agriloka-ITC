// src/components/market/Pasar.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Star, ShoppingCart, Package, Truck, Tag, Sprout } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = {
  'Semua': ['Semua Produk'],
  'Hasil Panen': ['Beras', 'Sayuran', 'Buah-buahan', 'Rempah'],
  'Alat Tani': ['Cangkul', 'Traktor', 'Alat Penyiram', 'Pemotong'],
  'Bibit': ['Padi', 'Sayuran', 'Buah', 'Rempah'],
  'Pupuk': ['Organik', 'NPK', 'Urea', 'KCL'],
  'Pestisida': ['Organik', 'Kimia', 'Pengendali Hama']
};

const ITEMS_PER_PAGE = 8;

export default function Pasar() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Semua Produk');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  interface Product {
    id: string;
    name: string;
    category: string;
    image: string;
    stock: number;
    rating: number;
    sold: number;
    description: string;
    price: number;
  }

  // Add more product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Beras Premium',
      category: 'Hasil Panen',
      image: '/images/beras.jpeg',
      stock: 20,
      rating: 4.5,
      sold: 100,
      description: 'Beras kualitas terbaik dari petani lokal',
      price: 150000,
    },
    // Add more products...
    {
      id: '2',
      name: 'Pupuk NPK',
      category: 'Pupuk',
      image: '/images/pupuk.jpg',
      stock: 50,
      rating: 4.8,
      sold: 250,
      description: 'Pupuk NPK untuk hasil panen maksimal',
      price: 75000,
    },
    // Add at least 20 more products with different categories...
  ];

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{product.rating}</span>
          <span className="mx-1">•</span>
          <span>Terjual {product.sold}</span>
        </div>
        
        <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-base font-semibold">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-24">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
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
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="w-12 h-12 text-primary/20" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-[15%]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sprout className="w-16 h-16 text-primary/15" />
          </motion.div>
          <motion.div
            className="absolute top-32 left-[25%]"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Tag className="w-10 h-10 text-primary/20" />
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
                <ShoppingCart className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Pasar Tani Digital
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Temukan hasil panen terbaik dan kebutuhan pertanian lengkap di sini
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span>Belanja Mudah</span>
              <span className="mx-2">•</span>
              <Truck className="w-4 h-4 text-primary" />
              <span>Pengiriman Cepat</span>
              <span className="mx-2">•</span>
              <Tag className="w-4 h-4 text-primary" />
              <span>Harga Terbaik</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Rest of existing content */}
      <div className="container mx-auto px-4">
        {/* Hero Section */}


        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full md:w-64 px-4 py-2.5 rounded-lg border bg-background flex items-center justify-between"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-2 p-2 rounded-lg border bg-background shadow-lg">
                  {Object.entries(categories).map(([category, subCategories]) => (
                    <div key={category} className="mb-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedSubCategory(subCategories[0]);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {category}
                      </button>
                      {selectedCategory === category && (
                        <div className="ml-4 mt-1 space-y-1">
                          {subCategories.map(sub => (
                            <button
                              key={sub}
                              onClick={() => {
                                setSelectedSubCategory(sub);
                                setShowCategoryDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                                selectedSubCategory === sub
                                  ? 'text-primary'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="mb-12 relative rounded-2xl overflow-hidden h-[300px]">
          <Image
            src="/images/banner1love.png"
            alt="Marketplace Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="text-white p-8 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Promo Minggu Ini</h2>
              <p className="text-lg mb-6">Dapatkan diskon spesial untuk pembelian alat pertanian modern</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
              >
                Lihat Promo
              </motion.button>
            </div>
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Rekomendasi Produk</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Link href={`/market/detail`} key={product.id}>
                <motion.div
                  className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="mx-1">•</span>
                      <span>Terjual {product.sold}</span>
                    </div>
                    
                    <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-base font-semibold">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t mb-12" />

        {/* All Products Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Semua Produk</h2>
          </div>
          <div className="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Link href="/market/detail" key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}