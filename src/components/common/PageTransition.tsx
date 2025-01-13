"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { pageTransition } from "@/lib/animation";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const secondaryOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isMounted) return;

    const overlay = overlayRef.current;
    const secondaryOverlay = secondaryOverlayRef.current;
    const logo = logoRef.current;

    if (overlay && secondaryOverlay && logo) {
      const tl = pageTransition(overlay, secondaryOverlay, logo);
      return () => {
        tl.kill();
      };
    }
  }, [pathname, isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black"
        style={{ left: '-100%', zIndex: 999 }}
      />
      
      <div 
        ref={secondaryOverlayRef}
        className="fixed inset-0 bg-gradient-to-r from-black/50 via-[hsl(142.1,76.2%,36.3%)] to-[hsl(142.1,76.2%,36.3%)] flex items-center justify-center"
        style={{ left: '-100%', zIndex: 1000, opacity: 0 }}
      >
        <div 
          ref={logoRef}
          className="fixed w-48 h-48"
          style={{ zIndex: 1001, opacity: 0 }}
        >
          <Image
            src="/images/logoputih.png"
            alt="Agriloka"
            fill
            className="object-contain drop-shadow-2xl brightness-150"
            priority
          />
        </div>
      </div>
    </>
  );
}