"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  category?: { name?: string | null } | string | null;
  stock?: number;
}

const BookCard = ({ id, title, author, price, image, category, stock = 10 }: BookCardProps) => {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  const originalPrice = price * 1.3;
  const discount = 30;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart({ id, title, author, price, image }, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full bg-transparent"
    >
      <Link href={`/book/${id}`} className="flex flex-col h-full">
        {/* Vertical Image Container */}
        <div className="relative aspect-[3/4.5] w-full bg-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 border border-border/20">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white text-3xl font-serif text-[#CBD5E1]">
              {title[0]}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="mt-4 flex flex-col flex-grow">
          <h3 className="text-[14px] font-bold text-[#1E293B] line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1 italic">{author}</p>
          
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base font-black text-[#1E293B]">₹{price.toFixed(0)}</span>
          </div>
        </div>
      </Link>
      
      <button
        onClick={handleAddToCart}
        disabled={adding || stock === 0}
        className="mt-4 w-full py-2.5 bg-primary/5 text-primary border border-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center space-x-2"
      >
        {adding ? <Loader2 size={14} className="animate-spin" /> : <span>Add to Cart</span>}
      </button>
    </motion.div>
  );
};

export default BookCard;
