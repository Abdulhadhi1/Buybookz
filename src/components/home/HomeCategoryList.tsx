"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface HomeCategoryListProps {
  categories: Category[];
}

export default function HomeCategoryList({ categories }: HomeCategoryListProps) {
  // Use a map to associate names with images if available, or just generic styles
  const categoryIcons: Record<string, string> = {
    "Literature": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&h=100&fit=crop",
    "Novel": "https://images.unsplash.com/photo-1543005128-868514475478?w=100&h=100&fit=crop",
    "History": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=100&h=100&fit=crop",
    "Science": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop",
    "Business": "https://images.unsplash.com/photo-1454165833767-0230d588f0a1?w=100&h=100&fit=crop",
    "Education": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop",
    "Spiritual": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop",
  };

  return (
    <div className="w-full bg-white border-b border-[#F1F5F9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-start justify-between overflow-x-auto no-scrollbar gap-4 sm:gap-8 pb-2">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <Link 
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#F1F5F9] p-1 group-hover:border-red-500 transition-all duration-300 shadow-sm overflow-hidden">
                  <div className="w-full h-full rounded-full bg-[#F8FAFC] overflow-hidden relative">
                    <img 
                      src={categoryIcons[cat.name] || `https://ui-avatars.com/api/?name=${cat.name}&background=random&color=fff`} 
                      alt={cat.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="mt-3 text-[11px] sm:text-[13px] font-bold text-[#1E293B] text-center max-w-[80px] line-clamp-1 group-hover:text-red-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
