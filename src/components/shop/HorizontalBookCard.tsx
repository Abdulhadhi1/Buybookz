"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

interface HorizontalBookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  category?: any;
}

const HorizontalBookCard = ({ id, title, author, price, image, category }: HorizontalBookCardProps) => {
  const categoryName = typeof category === "object" ? category?.name : category;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-white/5 rounded-2xl p-6 w-[320px] md:w-[480px] flex-shrink-0 snap-start border border-border/10 transition-all duration-500 hover:shadow-2xl"
    >
      <Link href={`/book/${id}`} className="flex space-x-6 h-40">
        {/* Left: Beautiful Book Preview */}
        <div className="relative w-28 md:w-32 h-full bg-secondary rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif italic text-primary/10">{title[0]}</div>
          )}
        </div>

        {/* Right: Detailed Info */}
        <div className="flex flex-col justify-between py-1 flex-grow overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-accent px-2 py-0.5 rounded-full bg-accent/10 mb-2">
              {categoryName || "Archive"}
            </span>
            <h3 className="text-md md:text-xl font-serif font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-foreground/40 font-medium italic mt-1">by {author}</p>
          </div>
          
          <div className="flex items-center justify-between border-t border-border/20 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Price</span>
              <span className="text-md font-bold text-foreground">${price.toFixed(2)}</span>
            </div>
            
            <div className="h-10 w-10 bg-secondary group-hover:bg-primary group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HorizontalBookCard;

