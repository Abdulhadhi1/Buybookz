"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, Moon, Sun, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-6",
        isScrolled
          ? "bg-[#FDFAF5]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md py-4 shadow-sm border-b border-border/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="relative h-12 w-48 flex items-center"
        >
          {/* Light Theme Logo */}
          <div className="relative w-full h-full dark:hidden">
              <Image 
                src="/dark-theme-logo.png" 
                alt="BuyBookz" 
                fill 
                className="object-contain object-left"
                priority
              />
          </div>
          {/* Dark Theme Logo */}
          <div className="relative w-full h-full hidden dark:block">
              <Image 
                src="/White-theme0logo.png" 
                alt="BuyBookz" 
                fill 
                className="object-contain object-left"
                priority
              />
          </div>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden lg:flex items-center space-x-12">
          <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Shop</Link>
          <Link href="/categories" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Categories</Link>
          <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">About</Link>
          <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Contact</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
           {/* Dark Mode Toggle */}
           <button 
                onClick={toggleDarkMode}
                className="p-2 hover:bg-[#F4F1EA] dark:hover:bg-zinc-800 rounded-full transition-colors group"
            >
                {isDarkMode ? <Sun size={18} className="group-hover:text-yellow-400" /> : <Moon size={18} className="group-hover:text-indigo-600" />}
           </button>

           <Link href="/profile" className="hidden sm:block p-2 hover:text-[#D1B89C] transition-colors">
            <User size={18} />
          </Link>
          
          <Link href="/cart" className="flex items-center space-x-2 p-2 px-4 bg-primary text-primary-foreground rounded-full group scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg">
            <ShoppingCart size={16} />
            <span className="text-[10px] font-bold">{cartCount}</span>
          </Link>
          
          <button 
            className="lg:hidden p-2 hover:bg-[#F4F1EA] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
            />
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] bg-[#FDFAF5] dark:bg-[#0a0a0a] z-50 p-8 flex flex-col space-y-12 shadow-2xl"
            >
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold tracking-tighter">BuyBookz</span>
                    <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="flex flex-col space-y-6">
                    <Link href="/shop" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Shop List Content</Link>
                    <Link href="/categories" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Categories View</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Our Story</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Inquiries</Link>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
