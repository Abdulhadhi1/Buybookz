"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Loader2, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  category?: any;
  stock?: number;
}

const BookCard = ({ id, title, author, price, image, category, stock = 10 }: BookCardProps) => {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const { refreshCartCount } = useCart();

  const categoryName = typeof category === "object" ? category?.name : category;
  
  const hasDiscount = title.length % 2 === 0;
  const originalPrice = hasDiscount ? price * 1.2 : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ bookId: id, quantity: 1 }),
      });
      
      if (res.status === 401) {
        router.push("/login");
      } else if (res.ok) {
        await refreshCartCount();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full cursor-pointer bg-white/50 dark:bg-white/5 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-border/20"
    >
      <Link href={`/book/${id}`} className="flex-grow flex flex-col space-y-5">
        {/* Image Area */}
        <div className="relative aspect-[3/4] w-full bg-secondary rounded-xl overflow-hidden flex items-center justify-center p-6">
            {/* Badges */}
            {stock === 0 ? (
                <div className="absolute top-4 left-4 z-10 bg-primary/90 backdrop-blur-md text-white px-3 py-1 text-[8px] uppercase font-black tracking-widest rounded-full">
                    Out of Archive
                </div>
            ) : hasDiscount ? (
                <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    Collector's Pick
                </div>
            ) : null}

            <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-105 shadow-2xl">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover rounded-sm"
                    />
                ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center">
                        <span className="text-4xl font-serif italic text-primary/5">{title[0]}</span>
                    </div>
                )}
            </div>
            
            {/* Hover Action */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <button 
                onClick={handleAddToCart}
                disabled={adding || stock === 0}
                className="pointer-events-auto h-12 w-12 bg-white text-primary rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-white"
              >
                {adding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={24} />}
              </button>
            </div>
        </div>

        {/* Info Area */}
        <div className="space-y-2 px-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  {categoryName || "Literature"}
              </span>
              <div className="flex items-center space-x-1">
                <Star size={10} fill="currentColor" stroke="none" className="text-accent" />
                <span className="text-[10px] font-bold opacity-40">4.9</span>
              </div>
            </div>
            
            <h3 className="text-sm md:text-md font-serif font-medium text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-1">
                {title}
            </h3>
            
            <p className="text-[11px] font-medium text-foreground/40 italic">by {author}</p>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-foreground">₹{price.toFixed(2)}</span>
                        {originalPrice && (
                            <span className="text-[10px] text-foreground/20 line-through">₹{originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <ShoppingBag size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;

