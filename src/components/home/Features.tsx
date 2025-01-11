"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LucideIcon, Sprout, Users, Brain, ShoppingCart, Cloud, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

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
  useGSAP(() => {
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <section className="py-24 bg-secondary/30 features-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fitur Unggulan Agriloka
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Solusi lengkap untuk membantu petani Indonesia mengelola dan mengembangkan usaha taninya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="feature-card p-6 rounded-lg bg-background border hover:border-primary transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}