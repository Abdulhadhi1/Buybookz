"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PriceDisplay from "@/components/ui/PriceDisplay";

interface CartBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  category?: { name?: string | null } | string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  language?: string | null;
  book: CartBook;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { refreshCart } = useCart();
  const router = useRouter();

  const getGuestCart = useCallback((): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      let allItems: CartItem[] = [];
      
      if (res.ok) {
        setIsLoggedIn(true);
        allItems = await res.json();
      } else {
        setIsLoggedIn(false);
        allItems = getGuestCart();
      }
      
      setItems(allItems);
    } catch (err) {
      console.error(err);
      setItems(getGuestCart());
    } finally {
      setLoading(false);
    }
  }, [getGuestCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    if (isLoggedIn) {
       try {
         const res = await fetch(`/api/cart/${itemId}`, {
           method: "PATCH",
           body: JSON.stringify({ quantity: newQuantity }),
         });
         if (res.ok) {
           await fetchCart();
           await refreshCartCount();
         }
       } catch (err) {
         console.error(err);
       }
    } else {
       const guestCart = getGuestCart();
       const index = guestCart.findIndex((item) => item.id === itemId);
       if (index > -1) {
         guestCart[index].quantity = newQuantity;
         localStorage.setItem('guestCart', JSON.stringify(guestCart));
         setItems(guestCart);
         await refreshCartCount();
       }
    }
  };

  const removeItem = async (itemId: string) => {
    if (isLoggedIn) {
       try {
         const res = await fetch(`/api/cart/${itemId}`, {
           method: "DELETE",
         });
         if (res.ok) {
           await fetchCart();
           await refreshCartCount();
         }
       } catch (err) {
         console.error(err);
       }
    } else {
       const guestCart = getGuestCart();
       const newCart = guestCart.filter((item) => item.id !== itemId);
       localStorage.setItem('guestCart', JSON.stringify(newCart));
       setItems(newCart);
       await refreshCart();
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Your Selection</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight">Shopping Bag</h1>
            </div>
            {!loading && items.length > 0 && (
                <p className="text-sm text-muted-foreground italic">You have {items.length} unique treasures in your bag.</p>
            )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center p-6 md:p-8 bg-white border border-border rounded-[3rem] gap-8 animate-pulse">
                  <div className="w-32 h-44 rounded-2xl bg-secondary/70" />
                  <div className="flex-grow space-y-4 w-full">
                    <div className="h-3 w-24 rounded-full bg-secondary/70" />
                    <div className="h-8 w-3/4 rounded-full bg-secondary/70" />
                    <div className="h-4 w-1/2 rounded-full bg-secondary/70" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary text-primary-foreground p-10 rounded-[3.5rem] space-y-6 animate-pulse">
              <div className="h-4 w-32 rounded-full bg-white/10" />
              <div className="h-10 w-40 rounded-full bg-white/10" />
              <div className="h-14 w-full rounded-full bg-white/10" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40 bg-secondary/30 rounded-[4rem] border border-dashed border-border space-y-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="text-accent/30" size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-primary italic">Empty archives...</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">Your collection is waiting for its first masterpiece.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center space-x-3 px-10 py-5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-2xl">
              <span className="uppercase tracking-widest text-xs font-black">Browse The Library</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  (() => {
                    const categoryLabel =
                      typeof item.book.category === "object"
                        ? item.book.category?.name
                        : item.book.category;

                    return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row items-center p-6 md:p-8 bg-white border border-border rounded-[3rem] hover:shadow-xl transition-shadow group gap-8"
                  >
                    <div className="relative w-32 h-44 bg-secondary rounded-2xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                      {item.book.image ? (
                        <Image src={item.book.image} alt={item.book.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary/20 text-4xl font-serif italic">{item.book.title[0]}</div>
                      )}
                    </div>

                    <div className="flex-grow space-y-4 text-center sm:text-left">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent opacity-60">{categoryLabel}</span>
                            <h3 className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
                              {item.book.title}
                            </h3>
                            <div className="flex items-center space-x-3 text-xs">
                                <span className="text-muted-foreground italic font-medium">by {item.book.author}</span>
                                {item.language && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded leading-none">
                                        Edition: {item.language}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <PriceDisplay price={item.book.price} className="justify-center sm:justify-start" amountClassName="text-xl" />
                    </div>

                    <div className="flex flex-col sm:items-end justify-between h-full gap-6">
                      <div className="flex items-center bg-secondary/50 rounded-full border border-border p-1.5 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-3 bg-white rounded-full hover:bg-secondary transition-all active:scale-90 shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-bold text-sm tracking-tighter">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-3 bg-white rounded-full hover:bg-secondary transition-all active:scale-90 shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-4 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all rounded-full flex items-center justify-center self-center sm:self-end"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                    );
                  })()
                ))}
              </AnimatePresence>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-primary text-primary-foreground p-10 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] sticky top-32 space-y-10 border border-white/5"
            >
              <div className="space-y-8">
                <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Order Abstract</span>
                    <h3 className="text-2xl font-serif font-bold">Bag Summary</h3>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-40 uppercase tracking-widest font-black">Item Total</span>
                    <PriceDisplay price={subtotal} amountClassName="text-sm" symbolClassName="text-xs" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-40 uppercase tracking-widest font-black">Logistics</span>
                    <span className="text-accent font-black uppercase tracking-widest italic">Complimentary</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Investment Total</span>
                    <PriceDisplay price={subtotal} className="text-white" amountClassName="text-5xl tracking-tighter" symbolClassName="text-xl mr-1" />
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full py-6 bg-accent text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-2xl hover:bg-accent/90 transition-all active:scale-95 group"
                >
                  <span className="uppercase tracking-[0.2em] text-xs font-black">Proceed to Checkout</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link 
                  href="/shop" 
                  className="w-full py-5 bg-white/5 border border-white/10 text-white/60 rounded-full font-bold flex items-center justify-center hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                >
                  Continue Browsing
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
