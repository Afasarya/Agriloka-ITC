"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import ParallaxWrapper from "@/components/common/ParallaxWrapper";

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
    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power4.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-[calc(100vh-4rem)] relative flex items-start pt-28 hero-section overflow-hidden"> {/* Changed items-center to items-start and increased pt-28 */}
      <ParallaxWrapper speed={0.2} className="absolute inset-0">
        <div className="bg-grid-pattern opacity-5 dark:opacity-10 w-full h-full" />
      </ParallaxWrapper>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative"> {/* Increased padding */}
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"> {/* Increased gap from 16 to 20 */}
          <ParallaxWrapper speed={-0.2}>
            <div className="hero-content space-y-8 pl-6"> {/* Increased space-y and left padding */}
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
          </ParallaxWrapper>

          <ParallaxWrapper speed={0.3}>
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
                <div className="relative w-full h-full p-4"> {/* Added padding */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-primary/20"> {/* Added styling wrapper */}
                    <Image
                      src="/images/herosection.jpg"
                      alt="Agriloka Platform"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
                  </div>
                </div>
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
          </ParallaxWrapper>
        </div>
      </div>
    </section>
  );
}