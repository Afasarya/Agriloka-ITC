"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxWrapper({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: `${speed * 100}px`,
      ease: "none",
    });
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}