"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  category?: string;
}

const BookCard = ({ id, title, author, price, image, category }: BookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-background rounded-[2rem] p-4 border border-border shadow-sm hover:shadow-xl transition-all"
    >
      {/* Category Tag */}
      {category && (
        <span className="absolute top-8 left-8 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20">
          {category}
        </span>
      )}

      {/* Actions */}
      <div className="absolute top-8 right-8 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <button className="p-3 bg-white dark:bg-zinc-900 border border-border rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
          <Heart size={18} />
        </button>
        <button className="p-3 bg-white dark:bg-zinc-900 border border-border rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
          <Eye size={18} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-secondary rounded-[1.5rem] overflow-hidden mb-6">
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
                <p className="font-serif italic text-xl text-primary/40">{title}</p>
                <div className="w-12 h-0.5 bg-accent/30 mx-auto"></div>
            </div>
          </div>
        )}
        
        {/* Quick Add Button */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center space-x-2 shadow-2xl hover:bg-primary/90 transition-colors">
                <ShoppingCart size={16} />
                <span className="text-sm">Add to Cart</span>
            </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-2 pb-2">
        <Link href={`/book/${id}`} className="block group/link">
          <h3 className="font-serif font-bold text-xl text-primary line-clamp-1 group-hover/link:text-accent transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm font-medium mb-4">{author}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>
          <div className="flex items-center space-x-1">
             {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-1.5 h-1.5 bg-accent rounded-full opacity-40"></div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
