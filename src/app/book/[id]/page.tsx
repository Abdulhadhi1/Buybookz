"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Share2, ArrowLeft, Loader2, ShieldCheck, Truck, RefreshCw, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PriceDisplay from "@/components/ui/PriceDisplay";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { refreshCartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const addToCart = async (redirect = false) => {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ bookId: book.id, quantity }),
      });
      if (res.status === 401) {
        router.push("/login");
      } else if (res.ok) {
        await refreshCartCount();
        if (redirect) {
            router.push("/checkout");
        } else {
            // Success animation or toast could be here
        }
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

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
        <h2 className="text-3xl font-serif font-bold opacity-30 italic leading-tight">Book has vanished from the library...</h2>
        <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-primary text-white rounded-full font-bold">Go To Shop</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-3 text-[10px] font-black tracking-[0.2em] uppercase mb-12 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Curated List</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 sticky top-32"
          >
            <div className="relative aspect-[3/4] bg-secondary rounded-[3.5rem] overflow-hidden shadow-2xl border border-border group">
                {book.image ? (
                    <Image src={book.image} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center p-20">
                        <span className="text-9xl font-serif italic text-white/20 select-none group-hover:scale-110 transition-transform duration-700">{book.title[0]}</span>
                    </div>
                )}
                <div className="absolute top-8 right-8">
                    <button className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-lg border border-border hover:bg-accent hover:text-white transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-5 py-2 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">
                  {book.category}
                </span>
                <div className="flex items-center space-x-1 text-accent ring-1 ring-border px-3 py-1.5 rounded-full bg-white/50">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= 4 ? "currentColor" : "none"} />)}
                    <span className="text-[10px] font-black ml-2 text-muted-foreground">4.8</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary leading-[1.1] tracking-tight">{book.title}</h1>
              <p className="text-2xl text-accent italic font-serif leading-tight">by {book.author}</p>
            </div>

            <div className="flex items-center space-x-8">
               <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Price</span>
                   <PriceDisplay price={book.price} amountClassName="text-5xl" symbolClassName="text-xl mr-1" />
               </div>
               <div className="h-12 w-px bg-border"></div>
               <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Availability</span>
                   <p className={`text-xs font-bold tracking-widest uppercase ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
                   </p>
               </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-widest opacity-50">Overview</h3>
                 <p className="text-muted-foreground leading-relaxed text-lg italic">
                   {book.description || "No description available for this masterpiece."}
                 </p>
            </div>

            <div className="space-y-8 pt-6">
                <div className="flex items-center space-x-6">
                    <span className="text-xs font-black uppercase tracking-widest italic opacity-40">Quantity</span>
                    <div className="flex items-center bg-secondary/30 rounded-full border border-border p-1.5 shadow-sm">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="p-3 bg-white rounded-full hover:bg-secondary transition-all active:scale-90"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => Math.min(book.stock, prev + 1))}
                        className="p-3 bg-white rounded-full hover:bg-secondary transition-all active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                    <button 
                      onClick={() => addToCart(false)}
                      disabled={adding || book.stock === 0}
                      className="flex-grow py-6 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center space-x-4 shadow-2xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 group"
                    >
                      {adding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} className="group-hover:-translate-y-1 transition-transform" />}
                      <span className="uppercase tracking-widest text-xs font-black">Add to Collection</span>
                    </button>
                    <button 
                      onClick={() => addToCart(true)}
                      disabled={adding || book.stock === 0}
                      className="flex-grow py-6 bg-accent text-white rounded-full font-bold shadow-2xl hover:bg-accent/90 transition-all active:scale-95 text-xs uppercase tracking-widest font-black"
                    >
                      Settle Account Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-secondary/20 rounded-[2.5rem] border border-border items-center">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ShieldCheck className="text-accent" size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Certified Secure</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Truck className="text-accent" size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Transit</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <RefreshCw className="text-accent" size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">30-Day returns</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
