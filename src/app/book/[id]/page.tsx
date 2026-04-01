"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Share2, ArrowLeft, Loader2, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      // Mock data for now if API fails
      // In real scenario: const res = await fetch(`/api/books/${id}`);
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBook = {
        id: "1",
        title: "The Silent Forest",
        author: "Elena Rossi",
        price: 599,
        description: "A gripping thriller that takes you deep into the heart of a mysterious forest where secrets are buried and the silence is deafening. Elena Rossi delivers a masterpiece of suspense and atmosphere.",
        category: "Mystery",
        stock: 12,
      };
      
      setBook(mockBook);
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  const addToCart = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ bookId: book.id, quantity: 1 }),
      });
      if (res.status === 401) {
        router.push("/login");
      } else {
        // Show success toast (not implemented yet)
        alert("Added to cart!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Visuals */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="relative aspect-[3/4] bg-secondary rounded-[3rem] overflow-hidden shadow-2xl border border-border group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                    <span className="text-9xl font-serif italic text-white/20 select-none">{book.title[0]}</span>
                </div>
                <div className="absolute top-8 right-8">
                    <button className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-lg border border-border hover:text-accent transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {book.category}
                </span>
                <div className="flex items-center space-x-1 text-accent">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                    <span className="text-xs font-bold ml-2 text-muted-foreground mr-2 border-r border-border pr-2">4.8 (124 reviews)</span>
                </div>
              </div>
              <h1 className="text-5xl font-serif font-bold text-primary leading-tight leading-tight">{book.title}</h1>
              <p className="text-xl text-accent italic font-medium font-serif leading-tight">by {book.author}</p>
            </div>

            <div className="space-y-4">
               <span className="text-4xl font-bold text-primary">{formatPrice(book.price)}</span>
               <p className="text-sm text-green-600 font-bold tracking-widest uppercase">In Stock ({book.stock} left)</p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg pb-4 border-b border-border">
              {book.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={addToCart}
                  disabled={adding}
                  className="flex-grow py-5 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center space-x-3 shadow-2xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                  <span>Add to Cart</span>
                </button>
                <button className="flex-grow py-5 bg-accent text-white rounded-full font-bold shadow-2xl hover:bg-accent/90 transition-all active:scale-95">
                  Buy Direct
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="flex flex-col items-center text-center space-y-2">
                    <ShieldCheck className="text-accent" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Safe Payment</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                    <Truck className="text-accent" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                    <RefreshCw className="text-accent" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Easy Returns</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
