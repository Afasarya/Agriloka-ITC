// src/components/market/ProductDetail.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Add interfaces
interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  sold: number;
}

// Mock data
const product = {
  id: '1',
  name: 'Beras Organik Premium',
  price: 150000,
  description: 'Beras organik premium berkualitas tinggi, dipanen langsung dari petani terpercaya.',
  images: '/images/beras.jpeg',
  rating: 4.8,
  sold: 500,
  stock: 100,
  seller: {
    name: 'Tani Sejahtera',
    rating: 4.9,
  },
};

const reviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'Budi Santoso',
      avatar: '/images/testimonial1.jpg',
    },
    rating: 5,
    comment: 'Kualitas beras sangat bagus, butiran beras utuh dan pulen saat dimasak.',
    date: '2024-03-15',
    images: ['/images/review1.jpg', '/images/review2.jpg'],
  },
  // Add more reviews...
];

const recommendedProducts: Product[] = [
  {
    id: '2',
    name: 'Pupuk NPK',
    price: 75000,
    image: '/images/pupuk.jpg',
    rating: 4.7,
    sold: 250,
  },
  // Add more products...
];

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleBuyNow = () => {
    router.push('/market/cart');
  };

  return (
    <section className="py-12"> {/* Reduced from py-16 */}
      <div className="container mx-auto px-4">
        {/* Product Image and Basic Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-6"> {/* Reduced gap and margin */}
          <div className="max-w-lg mx-auto w-full"> {/* Changed from max-w-md to max-w-lg */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/beras.jpeg" // Make sure image is in public/images folder
                alt={product.name}
                fill
                className="object-cover"
                priority // Add priority for above-fold images
                onError={(e) => {
                  // Fallback image if main image fails
                  e.currentTarget.src = "/images/placeholder.jpg"
                }}
              />
            </div>
          </div>

          <div className="space-y-4"> {/* Reduced from space-y-6 */}
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

            {/* Quantity and Buy Buttons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border hover:bg-muted"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-12 text-center">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 rounded-lg border hover:bg-muted"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <span className="text-muted-foreground">
                Stok: {product.stock}
              </span>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
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

        {/* Full Width Product Information */}
        <div className="mt-6"> {/* Reduced margin */}
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">Informasi Produk</h2>
            <div className="space-y-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Beras organik premium yang dipanen langsung dari petani terpercaya. Diproses dengan standar kualitas tinggi untuk menjaga nutrisi dan cita rasa terbaik. Cocok untuk konsumsi sehari-hari dengan tekstur nasi yang pulen dan aromanya yang khas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Spesifikasi:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Jenis Beras</span>
                        <span>Padi IR64</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Berat Bersih</span>
                        <span>5 kg</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Masa Panen</span>
                        <span>Februari 2024</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Asal Produk</span>
                        <span>Cianjur, Jawa Barat</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Sertifikasi</span>
                        <span>Organik Indonesia</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Masa Simpan</span>
                        <span>12 bulan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Keunggulan Produk:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>100% Organik tanpa bahan kimia</li>
                    <li>Dipanen dari lahan pertanian bersertifikat</li>
                    <li>Bebas pestisida berbahaya</li>
                    <li>Proses pengolahan modern dan higienis</li>
                    <li>Kemasan vacuum sealed untuk menjaga kualitas</li>
                  </ul>
                </div>
              </div>

              {/* Storage Instructions */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Cara Penyimpanan:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Simpan di tempat sejuk dan kering</li>
                  <li>Jauhkan dari sinar matahari langsung</li>
                  <li>Hindari tempat yang lembab</li>
                  <li>Tutup rapat kemasan setelah dibuka</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t mt-8 pt-8"> {/* Reduced spacing */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Ulasan Pembeli</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({reviews.length} ulasan)</span>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 bg-card rounded-xl border"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={review.user.avatar || '/avatars/default.png'}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{review.user.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex gap-1 my-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.images && (
                        <div className="flex gap-2 mt-4">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-20 h-20 rounded-lg overflow-hidden"
                            >
                              <Image
                                src={image}
                                alt={`Review image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="border-t mt-8 pt-8"> {/* Reduced spacing */}
          <h2 className="text-2xl font-semibold mb-8">Rekomendasi Produk</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendedProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="group relative bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span className="mx-1">•</span>
                    <span>Terjual {product.sold}</span>
                  </div>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-semibold">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}