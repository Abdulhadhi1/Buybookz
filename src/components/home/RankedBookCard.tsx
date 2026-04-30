"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface RankedBookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  rank?: number;
}

export default function RankedBookCard({ id, title, author, price, image, rank }: RankedBookCardProps) {
  const originalPrice = price * 1.3; // Simulated discount
  const discount = 30;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full bg-white rounded-2xl p-2 transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] border border-transparent hover:border-[#F1F5F9]"
    >
      <Link href={`/book/${id}`} prefetch={true} className="flex flex-col h-full">
        {/* Image Container with Rank */}
        <div className="relative aspect-[3/4.5] w-full rounded-xl bg-[#F8FAFC] overflow-hidden shadow-sm">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-[#CBD5E1]">
              {title[0]}
            </div>
          )}
          
          {/* Rank Number Overlay */}
          {rank !== undefined && (
            <div className="absolute bottom-0 left-0 p-0 select-none">
              <span className="text-[120px] font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] leading-[0.8] tracking-tighter opacity-90">
                {rank}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4 px-1 flex flex-col flex-grow">
          <h3 className="text-[13px] font-bold text-[#1E293B] line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-black text-[#1E293B]">₹{price.toFixed(0)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
