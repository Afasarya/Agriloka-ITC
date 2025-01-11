"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const imageVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, -1, 0],
    transition: {
      rotate: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  }
};

const floatingAnimation = {
  y: [-10, 10],
  transition: {
    y: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut"
    }
  }
};

export default function Hero() {
  useGSAP(() => {
    gsap.from(".hero-content", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top center",
        end: "center center",
        scrub: 1,
      },
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power4.out",
    });
  }, []);

  return (
    <section className="min-h-screen relative flex items-center pt-16 hero-section">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="hero-content space-y-6">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Membangun Masa Depan <span className="text-primary">Pertanian</span> Indonesia
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Platform digital yang menghubungkan petani dengan teknologi modern, pasar, dan komunitas untuk pertanian yang lebih baik.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
                Mulai Sekarang
              </button>
              <button className="px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary/10 transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </motion.div>
          </div>

          {/* Right content - Image */}
          <motion.div
            className="relative h-[500px]"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={imageVariants}
          >
            <motion.div
              className="absolute inset-0"
              animate={floatingAnimation}
            >
              <Image
                src="/hero-image.png" // Add your hero image
                alt="Agriloka Platform"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div
              className="absolute -z-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}