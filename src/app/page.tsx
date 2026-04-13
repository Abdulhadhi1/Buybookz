"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, ArrowRight, ShoppingCart, Heart, Search, ChevronUp, BookOpen, Star, ArrowUpRight } from "lucide-react";
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
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
            <Loader2 className="animate-spin text-accent mx-auto" size={40} strokeWidth={1.5} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Opening your library...</p>
        </div>
      </div>
    );
  }

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

      {/* Hero Section - Cinematic */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-bold tracking-widest uppercase text-accent"
          >
            <BookOpen size={12} />
            <span>Curated rare editions and masterpieces</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tighter"
          >
            The Art of <br /> <span className="text-luxury">Literature.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xl mx-auto text-lg md:text-xl text-foreground/60 font-medium leading-relaxed"
          >
            Explore our meticulously curated archives of rare editions, modern masterpieces, and timeless odysseys.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link href="/shop" className="px-10 py-5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all premium-shadow group">
              Browse Collection
              <ArrowRight size={14} className="inline ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="px-10 py-5 bg-secondary text-foreground rounded-full text-xs font-black uppercase tracking-widest hover:bg-border transition-all">
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Utilities */}
      <div className="fixed right-6 bottom-32 z-50 flex flex-col space-y-3">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-2xl border border-border/50"
        >
          <ChevronUp size={20} />
        </motion.button>
      </div>

      {/* Curated Sections */}
      <div className="space-y-16 pb-20 relative">
        {displayCategories.length === 0 ? (
          <div className="px-6 lg:px-12 max-w-7xl mx-auto py-20 text-center opacity-40">
             <h2 className="text-2xl font-serif italic">Curating your library...</h2>
          </div>
        ) : (
          displayCategories.map((cat, idx) => {
            const catBooks = getBooksByCategory(cat.id, cat.name);
            return (
                <section key={cat.id} className="relative">
                    <div className="px-6 lg:px-12 max-w-7xl mx-auto mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-serif font-medium leading-none tracking-tight capitalize">{cat.name}</h2>
                            </div>
                            <Link 
                                href={`/shop?category=${cat.name}`}
                                className="group flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:text-accent transition-all"
                            >
                                <span>See entire archive</span>
                                <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Books Display */}
                    <div className="relative">
                        {/* Horizontal Scroll for Mobile/Tablet */}
                        <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x pb-12 scroll-px-6 lg:scroll-px-12">
                            {catBooks.map(book => (
                                <div key={book.id} className="w-[300px] md:w-[450px] flex-shrink-0 snap-start">
                                    <HorizontalBookCard {...book} />
                                </div>
                            ))}
                        </div>

                        {/* Elegant Desktop Showcase for the first category */}
                        {idx === 0 && (
                          <div className="hidden lg:grid grid-cols-4 gap-12 px-6 lg:px-12 max-w-7xl mx-auto pt-10">
                              {catBooks.slice(0, 4).map(book => (
                                  <BookCard key={book.id} {...book} />
                              ))}
                          </div>
                        )}
                    </div>
                </section>
            );
          })
        )}
      </div>

      {/* Newsletter - Elegant & Subtle */}
      <section className="bg-secondary/50 py-40 px-6 lg:px-12 border-y border-border/30 relative overflow-hidden">
         <div className="max-w-3xl mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-4xl md:text-7xl font-serif font-medium tracking-tight">Stay within the <span className="text-accent italic">circle.</span></h2>
            <p className="text-foreground/50 text-lg font-medium max-w-lg mx-auto leading-relaxed">Join our mailing list to receive invitations to private readings and first access to rare releases.</p>
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

