// src/components/auth/Login.tsx
"use client";

import { useState } from 'react';
import { motion} from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Decorative Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/logo.png"
                alt="Agriloka"
                width={200}
                height={60}
                className="mx-auto mb-8"
              />
              <h2 className="text-3xl font-bold mb-4">Selamat Datang di Agriloka</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Platform digital yang menghubungkan petani dengan teknologi modern
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <Image
                src="/images/logoagriloka.png"
                alt="Agriloka"
                width={120}
                height={40}
                className="mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">Masuk ke Akun Anda</h1>
            <p className="text-muted-foreground">
              Masuk untuk melanjutkan ke Agriloka
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <div className="relative">
                  <motion.label
                    className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                      focusedInput === 'email' || email
                        ? 'text-xs -top-2 text-primary'
                        : 'text-muted-foreground top-1/2 -translate-y-1/2'
                    }`}
                  >
                    Email
                  </motion.label>
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <motion.label
                    className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                      focusedInput === 'password' || password
                        ? 'text-xs -top-2 text-primary'
                        : 'text-muted-foreground top-1/2 -translate-y-1/2'
                    }`}
                  >
                    Password
                  </motion.label>
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  "Masuk"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}