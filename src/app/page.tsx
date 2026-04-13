"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShoppingCart, Heart, Search, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

import HorizontalBookCard from "@/components/shop/HorizontalBookCard";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/categories")
        ]);
        const [booksData, catsData] = await Promise.all([
          booksRes.json(),
          catsRes.json()
        ]);
        setBooks(booksData);
        setCategories(catsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF5]">
        <div className="space-y-4 text-center">
            <Loader2 className="animate-spin text-accent mx-auto" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Curating your experience...</p>
        </div>
      </div>
    );
  }

  // Only show categories that have books
  const displayCategories = categories.filter(cat => 
    books.some(book => book.categoryId === cat.id)
  );

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary relative no-scrollbar">
      <Navbar />

      {/* Floating Action Buttons (Right) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-px">
        <button onClick={() => router.push("/cart")} className="p-4 bg-[#D1B89C] text-white hover:bg-[#b0967a] transition-all">
          <ShoppingCart size={20} />
        </button>
        <button className="p-4 bg-[#D1B89C] text-white hover:bg-[#b0967a] transition-all">
          <Heart size={20} />
        </button>
        <button className="p-4 bg-[#D1B89C] text-white hover:bg-[#b0967a] transition-all">
          <Search size={20} />
        </button>
      </div>

      {/* Scroll to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-10 right-10 z-40 p-4 bg-[#2D1B14] text-white hover:bg-black transition-all shadow-xl"
      >
        <ChevronUp size={24} />
      </button>
      
      {/* Page Header */}
      <section className="pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
         <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-primary">the library</h1>
         <p className="mt-6 text-lg text-muted-foreground italic font-serif opacity-60">handpicked titles for the discerning reader.</p>
      </section>

      {/* NEW: Horizontal View List (Mobile Responsive) */}
      <section className="mb-24 space-y-8">
          <div className="px-6 lg:px-12 max-w-7xl mx-auto flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight uppercase">Curated Collection</h3>
              <Link href="/shop" className="text-[9px] font-black uppercase tracking-widest border-b border-primary">Explore All</Link>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 lg:px-12 snap-x">
              {books.slice(0, 6).map(book => (
                  <HorizontalBookCard key={book.id} {...book} />
              ))}
          </div>
      </section>

      {/* Category Wise Display */}
      <div className="space-y-32 pb-40">
        {displayCategories.length === 0 ? (
          <div className="px-6 lg:px-12 max-w-7xl mx-auto py-40 border-t border-border">
             <h2 className="text-3xl font-serif font-bold opacity-10 italic">The collection is being replenished...</h2>
          </div>
        ) : (
          displayCategories.map((cat) => (
            <section key={cat.id} className="space-y-10">
                {/* Section Header */}
                <div className="px-6 lg:px-12 max-w-7xl mx-auto flex items-end justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Collection</span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight lowercase">{cat.name}</h2>
                    </div>
                    <Link 
                        href={`/shop?category=${cat.name}`}
                        className="pb-1 border-b-2 border-primary text-[10px] font-black uppercase tracking-widest hover:text-accent hover:border-accent transition-all"
                    >
                        View All
                    </Link>
                </div>

                {/* Horizontal Scroll Area */}
                <div className="relative group">
                    <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x">
                        {books
                            .filter(book => book.categoryId === cat.id)
                            .map(book => (
                                <div key={book.id} className="w-[280px] md:w-[350px] flex-shrink-0 snap-start">
                                    <BookCard {...book} />
                                </div>
                            ))
                        }
                    </div>
                    
                    {/* Visual gradients for scroll hint */}
                    <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FDFAF5] to-transparent pointer-events-none"></div>
                    <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FDFAF5] to-transparent pointer-events-none"></div>
                </div>
            </section>
          ))
        )}
      </div>

      {/* Standard Newsletter */}
      <section className="bg-white border-t border-border py-40 px-6 lg:px-12 text-center">
         <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Stay Inspired.</h2>
            <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border-b-2 border-primary">
                <input 
                    type="email" 
                    placeholder="E-mail Address" 
                    className="flex-grow px-0 py-4 bg-transparent focus:outline-none font-medium placeholder:text-[#BBBBBB]"
                />
                <button className="px-8 py-4 text-primary font-black uppercase tracking-widest text-[10px] hover:text-accent transition-all">
                    Inscribe
                </button>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
