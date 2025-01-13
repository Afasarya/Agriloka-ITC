"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import ParallaxWrapper from "@/components/common/ParallaxWrapper";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Pak Sudirman",
    role: "Petani Padi",
    image: "/images/testimonial1.jpg",
    content: "Agriloka membantu saya menemukan pembeli tetap untuk hasil panen. Penghasilan saya meningkat signifikan.",
    rating: 5,
    location: "Cianjur, Jawa Barat"
  },
  {
    id: 2,
    name: "Ibu Sumiati",
    role: "Petani Sayur",
    image: "/images/testimonial2.jpg",
    content: "AI Assistant sangat membantu saat tanaman saya bermasalah. Responnya cepat dan solusinya tepat.",
    rating: 5,
    location: "Malang, Jawa Timur"
  },
  {
    id: 3,
    name: "Pak Rahman",
    role: "Petani Buah",
    image: "/images/testimonial3.jpg",
    content: "Komunitas di Agriloka sangat supportif. Saya belajar banyak teknik bertani modern dari sesama petani.",
    rating: 5,
    location: "Batu, Jawa Timur"
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Scroll based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(".testimonial-card", { 
      opacity: 0, 
      y: 50 
    });

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".testimonial-header", {
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Cards animation with stagger
      gsap.to(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonials-content",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative testimonials-section overflow-hidden"
    >
      {/* Background patterns */}
      <div className="bg-pattern absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <ParallaxWrapper speed={0.1}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="testimonial-header text-center mb-16"
            style={{ y, opacity }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cerita Sukses Petani
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Testimoni dari para petani yang telah menggunakan platform Agriloka
            </p>
          </motion.div>

          <div className="testimonials-content relative max-w-5xl mx-auto">
            <ParallaxWrapper speed={0.2}>
              <div className="overflow-hidden">
                <motion.div 
                  className="flex"
                  animate={{ x: `${-currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      ref={el => {
                        if (el) cardsRef.current[index] = el;
                      }}
                      className="testimonial-card w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-background p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        
                        {/* Content container */}
                        <div className="relative">
                          {/* Quote icon */}
                          <div className="absolute -top-2 -left-2 text-primary/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-12 h-12"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                          </div>

                          {/* Rating */}
                          <div className="flex justify-end mb-6">
                            <div className="flex gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className="w-5 h-5 text-yellow-400 fill-current"
                                  strokeWidth={1}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Testimonial content */}
                          <p className="text-muted-foreground text-lg italic mb-8 leading-relaxed">
                            &ldquo;{testimonial.content}&rdquo;
                          </p>

                          {/* Profile section */}
                          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                            <div className="relative w-16 h-16">
                              <div className="absolute inset-0 bg-primary/10 rounded-full" />
                              <div className="absolute inset-1">
                                <Image
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-foreground">
                                {testimonial.name}
                              </h3>
                              <p className="text-primary font-medium text-sm">
                                {testimonial.role}
                              </p>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{testimonial.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </ParallaxWrapper>

            {/* Navigation buttons with parallax */}
            <ParallaxWrapper speed={-0.1}>
              <button
                onClick={() => setCurrentSlide(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </ParallaxWrapper>

            {/* Indicators with parallax */}
            <ParallaxWrapper speed={0.3}>
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? "bg-primary" : "bg-primary/20"
                    }`}
                  />
                ))}
              </div>
            </ParallaxWrapper>
          </div>
        </div>
      </ParallaxWrapper>
    </section>
  );
}
