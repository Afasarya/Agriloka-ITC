"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    question: "Bagaimana cara memulai jual beli di Agriloka?",
    answer: "Daftar akun, lengkapi profil, dan mulai jual beli. Tim kami akan membantu verifikasi akun Anda untuk keamanan transaksi.",
    category: "Marketplace"
  },
  {
    question: "Bagaimana sistem pembayaran di Agriloka?",
    answer: "Kami menggunakan sistem escrow yang aman. Dana ditahan sampai pembeli mengkonfirmasi penerimaan barang.",
    category: "Marketplace"
  },
  {
    question: "Apakah ada biaya untuk bergabung dengan komunitas?",
    answer: "Tidak ada biaya untuk bergabung komunitas. Semua fitur komunitas dapat diakses gratis.",
    category: "Komunitas"
  },
  {
    question: "Bagaimana cara menggunakan AI Assistant?",
    answer: "Klik ikon chat di pojok kanan bawah, ketik pertanyaan Anda, dan AI akan memberikan jawaban segera.",
    category: "AI Assistant"
  },
  {
    question: "Apakah prediksi cuaca tersedia untuk semua wilayah?",
    answer: "Ya, kami menggunakan data dari BMKG dan layanan cuaca internasional untuk seluruh wilayah Indonesia.",
    category: "Smart Farming"
  }
];

const categories = ["Semua", "Marketplace", "Komunitas", "AI Assistant", "Smart Farming"];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(() => {
    gsap.from(".faq-header", {
      scrollTrigger: {
        trigger: ".faq-section",
        start: "top center+=100",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".faq-tabs", {
      scrollTrigger: {
        trigger: ".faq-section",
        start: "top center+=50",
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
    });

    gsap.from(".faq-item", {
      scrollTrigger: {
        trigger: ".faq-content",
        start: "top center+=100",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
    });
  }, []);

  const filteredFaqs = faqData.filter(
    faq => activeCategory === "Semua" || faq.category === activeCategory
  );

  return (
    <section className="py-24 bg-background faq-section">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 faq-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan Agriloka
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <motion.div 
            className="flex space-x-4 min-w-max px-4 faq-tabs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeCategory === category
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4 faq-content">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent text-left"
                whileHover={{ scale: 1.01 }}
              >
                <span className="font-medium">{faq.question}</span>
                {activeIndex === index ? (
                  <Minus className="w-5 h-5 text-primary" />
                ) : (
                  <Plus className="w-5 h-5 text-primary" />
                )}
              </motion.button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-2 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}