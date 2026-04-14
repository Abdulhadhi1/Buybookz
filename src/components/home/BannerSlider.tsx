"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSliderProps {
  banners: any[];
}

const BannerSlider = ({ banners }: BannerSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Fallback if no banners
  if (!banners || banners.length === 0) {
    const fallbackBanners = [
        { id: '1', title: 'Curated Masterpieces', subtitle: 'Discover literature that transcends time' },
        { id: '2', title: 'New Releases', subtitle: 'Explore the latest from our publications' }
    ];

    return (
        <section className="relative w-full aspect-[3/2] md:aspect-[21/8] mt-28 mb-8 overflow-hidden bg-secondary">
             <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/5 to-accent/10"></div>
             <div className="relative h-full flex items-center justify-center p-8 text-center">
                <div className="space-y-4 max-w-4xl">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-accent text-xs font-black uppercase tracking-[0.4em]"
                    >
                        Luxury Bookstore
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-serif font-medium leading-tight"
                    >
                        The Art of Storytelling.
                    </motion.h1>
                    <motion.p 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         className="text-foreground/40 text-sm md:text-xl font-medium tracking-tight"
                    >
                        Explore meticulously curated archives of rare editions.
                    </motion.p>
                </div>
             </div>
        </section>
    );
  }

  return (
    <section className="relative w-full aspect-[3/2] md:aspect-[21/8] mt-28 mb-8 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="relative w-full h-full"
        >
          {banners[currentIndex].image ? (
            <Image
              src={banners[currentIndex].image}
              alt={banners[currentIndex].title || "Promotion"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-secondary flex items-center justify-center p-12 text-center">
                 <div className="space-y-4">
                    <h1 className="text-3xl md:text-6xl font-serif font-bold text-primary">{banners[currentIndex].title}</h1>
                    <p className="text-muted-foreground text-xs md:text-base tracking-widest uppercase font-bold">{banners[currentIndex].subtitle || "Exclusive Collection"}</p>
                 </div>
            </div>
          )}
          
          {/* Visual gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {banners.length > 1 && (
        <>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {banners.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-white" : "w-4 bg-white/30"}`}
                    />
                ))}
            </div>
        </>
      )}
    </section>
  );
};

export default BannerSlider;
