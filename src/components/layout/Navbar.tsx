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
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 lg:px-12 py-8",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl py-5 border-b border-border/40 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="relative h-10 w-40 flex items-center"
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
          {["Shop", "Categories", "About", "Contact"].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`} 
              className="group relative text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
            >
              <span>{item}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
           <button 
                onClick={toggleDarkMode}
                className="p-2 text-foreground/60 hover:text-foreground transition-colors"
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>

           <Link href="/profile" className="hidden sm:block text-foreground/60 hover:text-foreground transition-colors">
            <User size={18} />
          </Link>
          
          <Link href="/cart" className="relative group p-2 text-foreground/60 hover:text-foreground transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button 
            className="lg:hidden p-2 text-foreground"
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
                className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-md" 
            />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[400px] bg-background z-[80] p-12 flex flex-col shadow-2xl"
            >
                <div className="flex justify-between items-center mb-16">
                    <span className="text-2xl font-serif italic tracking-tight">BuyBookz</span>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="flex flex-col space-y-8">
                    {["Shop", "Categories", "About", "Contact"].map((item) => (
                      <Link 
                        key={item}
                        href={`/${item.toLowerCase()}`} 
                        onClick={() => setIsOpen(false)} 
                        className="text-4xl font-serif font-medium hover:text-accent transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                </div>
                
                <div className="mt-auto space-y-8 pt-12 border-t border-border">
                  <Link href="/profile" className="flex items-center space-x-4 text-sm font-bold uppercase tracking-widest">
                    <User size={18} />
                    <span>My Account</span>
                  </Link>
                  <p className="text-xs text-foreground/40 font-medium">© 2024 BuyBookz. Luxury Literature.</p>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

