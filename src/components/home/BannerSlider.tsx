"use client";

import { useState, useEffect, useRef } from "react";
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
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners?.length]);

  // Fallback if no banners
  if (!banners || banners.length === 0) {
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
                </div>
             </div>
        </section>
    );
  }

  return (
    <section className="relative w-full aspect-[3/2] md:aspect-[21/8] mt-28 mb-8 overflow-hidden group">
      {/* Scrollable Container with Animation */}
      <div className="relative w-full h-full flex items-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 w-full h-full"
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
                        <p className="text-muted-foreground text-xs md:text-base tracking-widest uppercase font-bold">Exclusive Collection</p>
                     </div>
                </div>
              )}
              {/* Visual gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl z-10"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl z-10"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {banners.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-white" : "w-4 bg-white/30"}`}
                    />
                ))}
            </div>
        </>
      )}
    </section>
  );
};

export default BannerSlider;
