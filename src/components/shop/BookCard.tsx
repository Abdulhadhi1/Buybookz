"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import PriceDisplay from "@/components/ui/PriceDisplay";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  category?: string;
}

const BookCard = ({ id, title, author, price, image, category }: BookCardProps) => {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const { refreshCartCount } = useCart();

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-background rounded-[2.5rem] p-3 md:p-5 border border-border shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <Link href={`/book/${id}`} className="flex-grow flex flex-col ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-[2rem]">
        {/* Category Tag */}
        {category && (
          <span className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20">
            {category}
          </span>
        )}

        {/* Desktop-only Action Row (Hover) */}
        <div className="absolute top-6 right-6 z-10 hidden lg:flex flex-col space-y-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button className="p-3 bg-white dark:bg-zinc-900 border border-border rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
            <Heart size={18} />
          </button>
          <button className="p-3 bg-white dark:bg-zinc-900 border border-border rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
            <Eye size={18} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full bg-secondary rounded-[1.8rem] overflow-hidden mb-5">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center p-8 text-center">
              <div className="space-y-2 transform group-hover:scale-110 transition-transform duration-700">
                  <p className="font-serif italic text-xl text-primary/40 leading-tight">{title}</p>
                  <div className="w-12 h-0.5 bg-accent/30 mx-auto"></div>
              </div>
            </div>
          )}
          
          {/* Desktop-only Quick Add Button (Hover) */}
          <div className="absolute inset-x-4 bottom-4 hidden lg:block translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-2xl hover:bg-primary/90 transition-all active:scale-95"
              >
                  {adding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />}
                  <span className="text-sm">Add to Cart</span>
              </button>
          </div>
        </div>

        {/* Details Footer */}
        <div className="px-2 flex-grow flex flex-col">
            <div className="flex-grow">
               <h3 className="font-serif font-bold text-lg md:text-xl text-primary line-clamp-1 group-hover:text-accent transition-colors mb-1">
                 {title}
               </h3>
               <p className="text-muted-foreground text-xs md:text-sm font-medium mb-3 italic">{author}</p>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
               <PriceDisplay price={price} amountClassName="text-lg md:text-xl" />
               
               {/* Mobile/Tablet Add to Cart (Circular Plus Button) */}
               <button 
                 onClick={handleAddToCart}
                 disabled={adding}
                 className="p-3 bg-accent text-white rounded-full shadow-lg lg:hidden hover:bg-accent/90 transition-all active:scale-90 flex items-center justify-center"
               >
                  {adding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
               </button>

               {/* Desktop Rating Indicator */}
               <div className="hidden lg:flex items-center space-x-1">
                  {[1, 2, 3].map((s) => (
                     <div key={s} className="w-1.5 h-1.5 bg-accent rounded-full opacity-40"></div>
                  ))}
               </div>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
