"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShoppingCart, Heart, Search, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary relative">
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
      <section className="pt-40 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
         <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary lowercase">loved book titles</h1>
      </section>

      {/* Grid Display */}
      <section className="pb-40 px-6 lg:px-12 max-w-7xl mx-auto">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 px-6 text-center border-2 border-dashed border-border">
              <h2 className="text-3xl font-serif font-bold opacity-20 italic">The archives are awaiting your selection...</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-8 gap-y-16">
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </section>

      {/* Modern Newsletter Section */}
      <section className="bg-white border-t border-border py-40 px-6 lg:px-12 text-center">
         <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Stay Inspired.</h2>
            <p className="text-[#666666] text-lg leading-relaxed">
                Join our newsletter to receive curated lists of must-read literary reviews.
            </p>
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
