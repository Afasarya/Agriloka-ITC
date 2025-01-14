// src/components/cart/Cart.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Minus, Plus, Truck, CreditCard, Wallet, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const shippingOptions: ShippingOption[] = [
  { id: '1', name: 'Reguler', price: 10000, duration: '2-3 hari' },
  { id: '2', name: 'Express', price: 20000, duration: '1 hari' },
  { id: '3', name: 'Same Day', price: 30000, duration: 'Hari ini' },
];

const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Bank Transfer', icon: Building2 },
  { id: '2', name: 'E-Wallet', icon: Wallet },
  { id: '3', name: 'Virtual Account', icon: CreditCard },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Beras Organik Premium',
      price: 150000,
      image: '/images/beras.jpeg',
      quantity: 1,
    },
  ]);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const router = useRouter();

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + selectedShipping.price;

  const handlePayment = () => {
    router.push('/market/payment');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items & Shipping */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart Items */}
            <div className="bg-card rounded-xl border p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Produk</h2>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-4 p-4 bg-background rounded-lg"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-lg font-semibold mt-1">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-md hover:bg-muted"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-muted"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Shipping Options */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Pengiriman</h2>
              <div className="space-y-4">
                {shippingOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedShipping(option)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedShipping.id === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Estimasi {option.duration}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        Rp {option.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            {/* Payment Methods */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Pembayaran</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPayment(method)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedPayment.id === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="w-5 h-5 text-primary" />
                      <p className="font-medium">{method.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <h2 className="text-xl font-semibold">Ringkasan</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span>Rp {selectedShipping.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handlePayment}
                className="w-full py-3 mt-4 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Bayar Sekarang
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}