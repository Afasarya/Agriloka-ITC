"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { LucideIcon, Sprout, Users, Brain, ShoppingCart, Cloud, BookOpen } from "lucide-react";
import ParallaxWrapper from "@/components/common/ParallaxWrapper";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
}

const features: Feature[] = [
  {
    title: "Marketplace Terpadu",
    description: "Platform jual beli untuk kebutuhan dan hasil pertanian",
    icon: ShoppingCart,
    details: [
      "Jual hasil panen langsung ke pembeli",
      "Beli kebutuhan pertanian dengan harga terbaik",
      "Sistem pembayaran yang aman",
      "Pengiriman terjamin"
    ]
  },
  {
    title: "Komunitas Petani",
    description: "Ruang diskusi dan berbagi pengalaman sesama petani",
    icon: Users,
    details: [
      "Forum diskusi real-time",
      "Berbagi tips dan pengalaman",
      "Konsultasi dengan ahli pertanian",
      "Komunitas berdasarkan wilayah"
    ]
  },
  {
    title: "AI Assistant",
    description: "Asisten pintar untuk menjawab pertanyaan seputar pertanian",
    icon: Brain,
    details: [
      "Jawaban cepat 24/7",
      "Solusi masalah tanaman",
      "Tips perawatan optimal",
      "Rekomendasi personalized"
    ]
  },
  {
    title: "Edukasi & Blog",
    description: "Pusat pembelajaran untuk meningkatkan keterampilan bertani",
    icon: BookOpen,
    details: [
      "Artikel informatif",
      "Video tutorial praktis",
      "Webinar dengan pakar",
      "Materi pembelajaran terstruktur"
    ]
  },
  {
    title: "Smart Farming",
    description: "Teknologi pintar untuk optimasi hasil pertanian",
    icon: Cloud,
    details: [
      "Prediksi cuaca akurat",
      "Analisis kualitas tanah",
      "Monitoring kelembaban",
      "Rekomendasi waktu tanam"
    ]
  },
  {
    title: "Pemberdayaan Petani",
    description: "Program pengembangan kapasitas petani",
    icon: Sprout,
    details: [
      "Pelatihan bertani modern",
      "Akses ke pembiayaan",
      "Pendampingan usaha tani",
      "Sertifikasi keahlian"
    ]
  }
];

export default function Features() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { 
            opacity: 0,
            y: 50 
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              end: "bottom center",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30 features-section overflow-hidden">
      <ParallaxWrapper speed={0.15}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Unggulan Agriloka
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk membantu petani Indonesia mengelola dan mengembangkan usaha taninya
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ParallaxWrapper key={feature.title} speed={0.1 * (index % 3 + 1)}>
                <motion.div
                  ref={el => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="feature-card p-6 rounded-lg bg-background border hover:border-primary transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </ParallaxWrapper>
            ))}
          </div>
        </div>
      </ParallaxWrapper>
    </section>
  );
}