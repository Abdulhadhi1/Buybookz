"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="relative h-20 w-72"
        >
          {/* Light Theme Logo (Displayed on White background) */}
          <Image 
            src="/dark-theme-logo.png" 
            alt="BuyBookz" 
            fill 
            className="object-contain dark:hidden"
            priority
          />
          {/* Dark Theme Logo (Displayed on Dark background) */}
          <Image 
            src="/White-theme0logo.png" 
            alt="BuyBookz" 
            fill 
            className="object-contain hidden dark:block"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-sm font-medium hover:text-accent transition-colors">Shop</Link>
          <Link href="/categories" className="text-sm font-medium hover:text-accent transition-colors">Categories</Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-accent transition-colors">Contact</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-5">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors relative group">
            <Search size={20} className="group-hover:text-accent transition-colors" />
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-secondary rounded-full transition-colors group"
          >
            {isDarkMode ? <Sun size={20} className="group-hover:text-yellow-400" /> : <Moon size={20} className="group-hover:text-indigo-600" />}
          </button>
          <Link href="/profile" className="p-2 hover:bg-secondary rounded-full transition-colors group">
            <User size={20} className="group-hover:text-accent transition-colors" />
          </Link>
          <Link href="/cart" className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all relative group shadow-lg scale-100 hover:scale-105 active:scale-95">
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-background">
              0
            </span>
          </Link>
          <button 
            className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 shadow-xl"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/shop" onClick={() => setIsOpen(false)} className="text-lg font-medium">Shop</Link>
              <Link href="/categories" onClick={() => setIsOpen(false)} className="text-lg font-medium">Categories</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium">About</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
