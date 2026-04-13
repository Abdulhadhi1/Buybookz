"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
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
  
  // Simulated discount for UI matching
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full cursor-pointer"
    >
      <Link href={`/book/${id}`} className="flex-grow flex flex-col space-y-4">
        {/* Image Area */}
        <div className="relative aspect-[3/4] w-full bg-[#F4F1EA] flex items-center justify-center p-8 overflow-hidden">
            {/* Badges */}
            {stock === 0 ? (
                <div className="absolute top-4 left-0 z-10 bg-[#2D1B14] text-white px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest">
                    Out of stock
                </div>
            ) : hasDiscount ? (
                <div className="absolute top-4 left-4 z-10 bg-[#694432] text-white px-3 py-1 text-[10px] font-bold">
                    10%
                </div>
            ) : null}

            <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105 shadow-[15px_15px_30px_rgba(0,0,0,0.1)]">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center border border-border">
                        <span className="text-4xl font-serif italic text-primary/10">{title[0]}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Info Area */}
        <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#999999]">
                {categoryName || "General"}
            </span>
            <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                {title}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center space-x-0.5 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="currentColor" stroke="none" className="text-black" />
                ))}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-2">
                {originalPrice && (
                    <span className="text-[#BBBBBB] line-through text-sm">${originalPrice.toFixed(2)}</span>
                )}
                <span className="text-base font-medium text-primary">${price.toFixed(2)}</span>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
