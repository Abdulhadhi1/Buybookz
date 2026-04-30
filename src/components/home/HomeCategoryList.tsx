"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Book {
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  books?: Book[];
}

interface HomeCategoryListProps {
  categories: Category[];
}

export default function HomeCategoryList({ categories }: HomeCategoryListProps) {
  return (
    <div className="w-full bg-white border-b border-[#F1F5F9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-start justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-4 pb-2">
          {categories.map((cat, index) => {
            const latestBookImage = cat.books?.[0]?.image;
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0"
              >
                <Link 
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center group w-16 sm:w-24"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#F1F5F9] p-0.5 group-hover:border-red-500 transition-all duration-300 shadow-sm overflow-hidden">
                    <div className="w-full h-full rounded-full bg-[#F8FAFC] overflow-hidden relative">
                      {latestBookImage ? (
                        <img 
                          src={latestBookImage} 
                          alt={cat.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent font-bold text-xs sm:text-base">
                          {cat.name[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] sm:text-[12px] font-bold text-[#1E293B] text-center w-full leading-tight break-words px-1 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
