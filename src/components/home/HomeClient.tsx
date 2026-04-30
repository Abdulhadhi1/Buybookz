"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeCategoryList from "@/components/home/HomeCategoryList";
import RankedBookCard from "@/components/home/RankedBookCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BookSummary {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
}

interface CategoryWithBooks {
  id: string;
  name: string;
  books: BookSummary[];
}

interface HomeClientProps {
  categories: CategoryWithBooks[];
  recentBooks: BookSummary[];
  uncategorizedBooks: BookSummary[];
}

export default function HomeClient({ categories, recentBooks, uncategorizedBooks }: HomeClientProps) {
  const displayCategories = categories.filter((cat) => cat.books.length > 0);

  return (
    <main className="min-h-screen bg-white text-[#1E293B]">
      <Navbar />

      {/* Hero Margin */}
      <div className="pt-[110px] lg:pt-[140px]"></div>

      {/* Circular Categories */}
      <HomeCategoryList categories={categories} />

      {/* Hero Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex flex-col space-y-2 mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-[#1E293B]">BuyBookz: #1 Online Bookstore</h1>
        </div>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-[21/9] sm:aspect-[4/1] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-2xl relative overflow-hidden shadow-xl shadow-blue-100 group"
        >
            <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
                <div className="flex flex-col items-center text-center text-white">
                    <h2 className="text-3xl sm:text-5xl font-black mb-2 tracking-tighter drop-shadow-md">30% OFF</h2>
                    <p className="text-sm sm:text-lg font-bold opacity-90 uppercase tracking-[0.2em]">Collector&apos;s Edition Sale</p>
                    <div className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transform group-hover:scale-105 transition-transform cursor-pointer">
                        Shop Now
                    </div>
                </div>
            </div>
            
            {/* Abstract Shapes for "Banner" feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </motion.div>
      </div>

      {/* Best Selling Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">Best Selling Books</h2>
            <Link 
                href="/shop?sortBy=popular" 
                className="flex items-center text-sm font-bold text-[#64748B] hover:text-red-600 transition-colors group"
            >
                <span>View all</span>
                <div className="ml-2 w-6 h-6 bg-[#F1F5F9] rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                    <ChevronRight size={14} />
                </div>
            </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {recentBooks.slice(0, 6).map((book, index) => (
                <RankedBookCard key={book.id} {...book} rank={index + 1} />
            ))}
        </div>
      </section>

      {/* Featured Category Section (Using first non-empty category) */}
      {displayCategories[0] && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">{displayCategories[0].name} Collections</h2>
                <Link 
                    href={`/shop?category=${displayCategories[0].name}`} 
                    className="flex items-center text-sm font-bold text-[#64748B] hover:text-red-600 transition-colors group"
                >
                    <span>View all</span>
                    <div className="ml-2 w-6 h-6 bg-[#F1F5F9] rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                        <ChevronRight size={14} />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {displayCategories[0].books.slice(0, 6).map((book) => (
                    <RankedBookCard key={book.id} {...book} />
                ))}
            </div>
        </section>
      )}

      {/* Best Deal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 border-t border-[#F1F5F9]">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">Best Deal of the Month</h2>
            <Link 
                href="/shop?discount=true" 
                className="flex items-center text-sm font-bold text-[#64748B] hover:text-red-600 transition-colors group"
            >
                <span>View all</span>
                <div className="ml-2 w-6 h-6 bg-[#F1F5F9] rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                    <ChevronRight size={14} />
                </div>
            </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {uncategorizedBooks.slice(0, 6).map((book) => (
                <RankedBookCard key={book.id} {...book} />
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
