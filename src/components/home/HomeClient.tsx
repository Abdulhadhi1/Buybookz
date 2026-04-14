"use client";

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HorizontalBookCard from "@/components/shop/HorizontalBookCard";
import BannerSlider from "@/components/home/BannerSlider";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HomeClientProps {
  banners: any[];
  books: any[];
  categories: any[];
}

export default function HomeClient({ banners, books, categories }: HomeClientProps) {
  const getBooksByCategory = (catId: string, catName: string) => {
    return books.filter(book => 
        book.categoryId === catId || 
        (typeof book.category === 'object' ? book.category?.name === catName : book.category === catName)
    );
  };

  const displayCategories = categories.filter(cat => 
    getBooksByCategory(cat.id, cat.name).length > 0
  );

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-accent/30">
      <Navbar />

      {/* Hero Section - Replaced with Banner Slider */}
      <BannerSlider banners={banners} />


      {/* Curated Sections */}
      <div className="space-y-4 pb-12 relative mt-4">
        {displayCategories.map((cat) => {
          const catBooks = getBooksByCategory(cat.id, cat.name);
          return (
            <section key={cat.id} className="relative">
              <div className="px-6 lg:px-12 mb-2">
                <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-1">
                  <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">{cat.name}</h2>
                  <Link 
                    href={`/shop?category=${cat.name}`}
                    className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                  >
                    <span>View All</span>
                    <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Books Display */}
              <div className="relative">
                <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x pb-4 scroll-px-6 lg:scroll-px-12">
                  {catBooks.map(book => (
                    <div key={book.id} className="w-[300px] md:w-[450px] flex-shrink-0 snap-start">
                      <HorizontalBookCard {...book} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Newsletter - Elegant & Subtle */}
      <section className="bg-secondary/50 py-32 px-6 lg:px-12 border-y border-border/30 relative overflow-hidden">
         <div className="max-w-3xl mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-3xl md:text-6xl font-serif font-medium tracking-tight">Stay within the <span className="text-accent italic">circle.</span></h2>
            <p className="text-foreground/50 text-base font-medium max-w-lg mx-auto leading-relaxed">Join our mailing list to receive invitations to private readings and first access to rare releases.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-6">
                <input 
                    type="email" 
                    placeholder="E-mail address" 
                    className="flex-grow px-8 py-5 rounded-full bg-white dark:bg-zinc-900 border border-border focus:border-accent transition-all outline-none text-sm"
                />
                <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all premium-shadow shadow-xl active:scale-95">
                    Subscribe
                </button>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
