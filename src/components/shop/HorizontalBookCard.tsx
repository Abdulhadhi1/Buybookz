"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
      whileHover={{ scale: 1.02 }}
      className="bg-[#F4F1EA] rounded-sm p-4 w-[320px] md:w-[380px] flex-shrink-0 snap-start shadow-sm border border-border"
    >
      <Link href={`/book/${id}`} className="flex space-x-4 h-32">
        {/* Left: Small Image */}
        <div className="relative w-24 h-full bg-white shadow-md overflow-hidden flex-shrink-0">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif italic text-primary/20">{title[0]}</div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between py-1 overflow-hidden">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 block">{categoryName || "Fiction"}</span>
            <h3 className="text-sm font-bold text-primary line-clamp-2 leading-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground italic mt-0.5">by {author}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" stroke="none" className="text-black" />)}
            </div>
            <span className="text-sm font-bold">${price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HorizontalBookCard;
