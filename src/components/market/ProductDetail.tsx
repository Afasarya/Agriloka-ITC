// src/components/market/ProductDetail.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function ProductDetail({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);

  // Mock product data - replace with API call
  const product = {
    id: productId,
    name: 'Beras Organik Premium',
    price: 150000,
    description: 'Beras organik premium berkualitas tinggi, dipanen langsung dari petani terpercaya.',
    images: ['/products/beras.jpg'],
    rating: 4.8,
    sold: 500,
    stock: 100,
    seller: {
      name: 'Tani Sejahtera',
      rating: 4.9,
    },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                Terjual {product.sold}
              </span>
            </div>

            <div className="text-3xl font-bold">
              Rp {product.price.toLocaleString('id-ID')}
            </div>

            <p className="text-muted-foreground">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border hover:bg-muted"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 rounded-lg border hover:bg-muted"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-muted-foreground">
                Stok: {product.stock}
              </span>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Beli Sekarang
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg border hover:bg-muted"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}