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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-8",
        isScrolled
          ? "bg-[#FDFAF5]/80 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <button 
            className="lg:hidden p-2 hover:bg-[#F4F1EA] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Menu size={20} />
        </button>

        {/* Logo / Brand */}
        <Link 
          href="/" 
          className="text-2xl font-bold tracking-tighter text-primary"
        >
          BuyBookz
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden lg:flex items-center space-x-12">
          <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Shop</Link>
          <Link href="/categories" className="text-xs font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Categories</Link>
          <Link href="/about" className="text-xs font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">About</Link>
          <Link href="/contact" className="text-xs font-black uppercase tracking-[0.2em] hover:text-[#D1B89C] transition-colors">Contact</Link>
        </div>

        {/* Minimal Icons */}
        <div className="flex items-center space-x-6">
           <Link href="/profile" className="hidden sm:block p-2 hover:text-[#D1B89C] transition-colors">
            <User size={18} />
          </Link>
          <Link href="/cart" className="flex items-center space-x-1 p-2 group">
            <ShoppingCart size={18} className="group-hover:text-[#D1B89C] transition-colors" />
            <span className="text-[10px] font-bold">({cartCount})</span>
          </Link>
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
                className="fixed inset-0 bg-black/20 z-40" 
            />
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] bg-[#FDFAF5] z-50 p-8 flex flex-col space-y-12"
            >
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold tracking-tighter">BuyBookz</span>
                    <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="flex flex-col space-y-6">
                    <Link href="/shop" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Shop</Link>
                    <Link href="/categories" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Categories</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-2xl font-bold">About</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-bold">Contact</Link>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
