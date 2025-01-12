"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ToggleMode";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/market", label: "Pasar" },
  { href: "/community", label: "Komunitas" },
  { href: "/education", label: "Edukasi" },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const menuVariants = {
  closed: {
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  open: {
    x: "0%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mobile-menu') && !target.closest('#menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full top-0 z-50 border-b ${
        isOpen 
          ? 'bg-background' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Agriloka Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              Masuk
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <motion.div
              className="w-6 h-5 flex flex-col justify-between"
              animate={isOpen ? "open" : "closed"}
            >
              <motion.span
                className="w-full h-0.5 bg-foreground rounded-full origin-left"
                variants={{
                  closed: { rotate: 0 },
                  open: { rotate: 45, y: -2 }
                }}
              />
              <motion.span
                className="w-full h-0.5 bg-foreground rounded-full"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
              />
              <motion.span
                className="w-full h-0.5 bg-foreground rounded-full origin-left"
                variants={{
                  closed: { rotate: 0 },
                  open: { rotate: -45, y: 2 }
                }}
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-16 right-0 bottom-0 w-[280px] bg-background border-l shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 h-full">
              {/* Navigation Links */}
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href={link.href}
                      className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 border-t" />

              {/* Bottom Actions */}
              <div className="space-y-4 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ganti Tema</span>
                  <ThemeToggle />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}