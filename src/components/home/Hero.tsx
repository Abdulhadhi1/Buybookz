"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-accent font-bold tracking-widest text-xs uppercase"
            >
              New Arrival • 2024
            </motion.span>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary leading-tight">
              Discover Your Next <br />
              <span className="text-accent italic font-medium">Favorite Story</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              Explore our curated collection of premium literature, worldwide bestsellers, and timeless classics. Handpicked for readers like you.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/shop"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              <ShoppingBag size={18} />
              <span>Explore Collection</span>
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 bg-background text-primary border border-border rounded-full font-bold flex items-center space-x-2 hover:bg-secondary transition-all"
            >
              <span>Our Story</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="pt-8 flex items-center space-x-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold">12k+</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Books</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold">50k+</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Readers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold">4.9/5</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Rating</span>
            </div>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-[3/4] max-w-md mx-auto lg:ml-auto"
        >
          <div className="absolute inset-0 bg-accent/10 rounded-[3rem] -rotate-6 scale-95 blur-2xl"></div>
          <div className="relative z-10 w-full h-full bg-background rounded-[2.5rem] shadow-2xl p-4 overflow-hidden group">
             <div className="w-full h-full bg-secondary rounded-[1.5rem] relative overflow-hidden">
                {/* Book placeholder using CSS for now, will add real image late */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-primary/20 to-accent/60 flex items-center justify-center">
                    <div className="text-center p-8 space-y-4">
                        <div className="w-24 h-32 bg-white/20 backdrop-blur-md mx-auto rounded-md shadow-lg border border-white/30 flex items-center justify-center">
                            <span className="text-white font-serif italic text-4xl">B</span>
                        </div>
                        <p className="text-white/80 font-serif text-2xl italic">The Art of Storytelling</p>
                        <p className="text-white/60 text-sm tracking-widest uppercase font-bold">Evelyn Harper</p>
                    </div>
                </div>
                {/* Decorative particles */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent rounded-full animate-ping"></div>
             </div>
          </div>
          
          {/* Featured Tag */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute -right-8 top-1/4 bg-white dark:bg-zinc-900 shadow-2xl p-4 rounded-2xl flex items-center space-x-4 border border-border"
          >
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                NEW
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Released Today</p>
                <p className="font-bold text-sm">Beyond the Horizon</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
