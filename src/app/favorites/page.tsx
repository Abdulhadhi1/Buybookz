"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HorizontalBookCard from "@/components/shop/HorizontalBookCard";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

interface FavoriteBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  category?: { name?: string | null } | string | null;
}

export default function FavoritesPage() {
  const [books, setBooks] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const { favoriteIds, hasLoaded } = useFavorites();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.status === 401) {
          setIsUnauthorized(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data: FavoriteBook[] = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [favoriteIds]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Curated Collection</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight">Your Favorites</h1>
            {!loading && books.length > 0 && (
                <p className="text-sm text-muted-foreground italic">You have saved {books.length} masterpieces to your private archives.</p>
            )}
        </div>

        {loading || !hasLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[2rem] border border-border bg-white p-6 animate-pulse">
                <div className="h-32 rounded-2xl bg-secondary/70" />
                <div className="mt-4 h-4 w-24 rounded-full bg-secondary/70" />
                <div className="mt-3 h-6 w-3/4 rounded-full bg-secondary/70" />
                <div className="mt-3 h-4 w-1/2 rounded-full bg-secondary/70" />
              </div>
            ))}
          </div>
        ) : isUnauthorized ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40 bg-secondary/30 rounded-[4rem] border border-dashed border-border space-y-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-red-500/20">
                <Heart fill="currentColor" size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-primary italic">Members Only Archives</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">Please sign in to view and manage your favorite books.</p>
            </div>
            <Link href="/login" className="inline-flex items-center space-x-3 px-10 py-5 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all active:scale-95 shadow-2xl">
              <span className="uppercase tracking-widest text-xs font-black">Sign In To Save</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : books.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40 bg-secondary/30 rounded-[4rem] border border-dashed border-border space-y-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-red-500/10">
                 <Heart fill="currentColor" size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-primary italic">The heart is empty...</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">You have not saved any treasures to your favorites yet.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center space-x-3 px-10 py-5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-2xl">
              <span className="uppercase tracking-widest text-xs font-black">Explore The Library</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                     <HorizontalBookCard {...book} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
