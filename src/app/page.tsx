"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShoppingCart, Heart, Search, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";
import HorizontalBookCard from "@/components/shop/HorizontalBookCard";
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF5] dark:bg-[#0a0a0a]">
        <div className="space-y-4 text-center">
            <Loader2 className="animate-spin text-accent mx-auto" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Authenticating Collection...</p>
        </div>
      </div>
    );
  }

  // Filter books with logic that handles potential data variations
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
    <main className="min-h-screen bg-[#FDFAF5] dark:bg-[#0a0a0a] text-primary transition-colors duration-300 relative no-scrollbar">
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
      <section className="pt-48 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
         <h1 className="text-5xl md:text-9xl font-bold tracking-tighter text-primary lowercase border-b-8 border-accent/20 pb-4">The Library.</h1>
         <p className="mt-8 text-xl text-muted-foreground italic font-serif max-w-2xl leading-relaxed">
            Curating rare editions and modern masterpieces. Explore our archives by genre to find your next great odyssey.
         </p>
      </section>

      {/* LANDSCAPE VIEW: Curated Picks per Genre (Horizontal Scroll) */}
      <div className="space-y-40 pb-40">
        {displayCategories.length === 0 ? (
          <div className="px-6 lg:px-12 max-w-7xl mx-auto border-t border-border/20 pt-20">
             <h2 className="text-3xl font-serif font-bold opacity-10 italic">Library Indexing in progress...</h2>
          </div>
        ) : (
          displayCategories.map((cat, idx) => {
            const catBooks = getBooksByCategory(cat.id, cat.name);
            return (
                <section key={cat.id} className="space-y-12">
                    {/* Header with View All */}
                    <div className="px-6 lg:px-12 max-w-7xl mx-auto flex items-end justify-between">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent flex items-center">
                                <span className="w-8 h-[2px] bg-accent mr-3"></span> Selection {idx + 1}
                            </span>
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tight lowercase">{cat.name}</h2>
                        </div>
                        <Link 
                            href={`/shop?category=${cat.name}`}
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg active:scale-95"
                        >
                            View All Titles
                        </Link>
                    </div>

                    {/* Horizontal Scroll Containers - RESPONSIVE */}
                    <div className="relative group">
                        {/* Horizontal List View for Mobile/Tablet */}
                        <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 lg:px-12 snap-x pb-8">
                            {catBooks.map(book => (
                                <div key={book.id} className="w-[290px] md:w-[380px] flex-shrink-0 snap-start">
                                    <HorizontalBookCard {...book} />
                                </div>
                            ))}
                        </div>
                        
                        {/* Standard Card Grid for Desktop if many books */}
                        <div className="hidden lg:grid grid-cols-4 gap-8 px-6 lg:px-12 max-w-7xl mx-auto pt-10">
                            {catBooks.slice(0, 4).map(book => (
                                <BookCard key={book.id} {...book} />
                            ))}
                        </div>
                    </div>
                </section>
            );
          })
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-40 px-6 lg:px-12 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         <div className="max-w-2xl mx-auto space-y-12 relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter">Stay Connected.</h2>
            <p className="text-primary-foreground/60 text-lg italic max-w-lg mx-auto">Join our inner circle for premier releases and literary gatherings.</p>
            <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border-b-2 border-primary-foreground/30">
                <input 
                    type="email" 
                    placeholder="Enter E-mail" 
                    className="flex-grow px-0 py-6 bg-transparent focus:outline-none font-medium placeholder:text-white/20 text-white"
                />
                <button className="px-10 py-6 text-primary-foreground font-black uppercase tracking-widest text-xs hover:text-accent transition-all">
                    Inscribe
                </button>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
