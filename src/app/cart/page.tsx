"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, Loader2, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    // In-memory update for instant feedback
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
    // In real app, call PATCH /api/cart/[id] (not implemented yet, using simplistic POST/GET for now)
  };

  const removeItem = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    // Call DELETE /api/cart/[id] here
  };

  const subtotal = items.reduce((acc: number, item: any) => acc + item.book.price * item.quantity, 0);

  const startCheckout = async () => {
    setCheckingOut(true);
    // In real app: call POST /api/orders to get razorpayOrderId
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/checkout");
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
        <h1 className="text-5xl font-serif font-bold text-primary mb-12">Your Shopping Bag</h1>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-24 space-y-8 bg-secondary/30 rounded-[3rem] border border-dashed border-border"
          >
             <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto shadow-xl">
                <ShoppingCart size={32} className="text-accent" />
             </div>
             <div className="space-y-4">
                <p className="text-xl font-serif italic text-primary">Your bag is looking a bit light.</p>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Discover your next story to fill it up.</p>
             </div>
             <Link 
              href="/shop" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl"
             >
                <ArrowLeft size={16} />
                <span>Go To Shop</span>
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 p-6 bg-secondary/20 rounded-[2.5rem] border border-border group hover:bg-secondary/40 transition-colors"
                  >
                    <div className="relative w-32 aspect-[3/4] bg-background rounded-2xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                            <span className="text-3xl font-serif italic text-white/40">{item.book.title[0]}</span>
                        </div>
                    </div>

                    <div className="flex-grow text-center sm:text-left space-y-2">
                      <Link href={`/book/${item.book.id}`} className="block">
                        <h3 className="text-xl font-serif font-bold text-primary hover:text-accent transition-colors underline-offset-4 hover:underline">
                          {item.book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground italic tracking-widest font-medium uppercase">{item.book.author}</p>
                    </div>

                    <div className="flex items-center bg-background rounded-full border border-border p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-3 hover:bg-secondary rounded-full transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-3 hover:bg-secondary rounded-full transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center sm:items-end space-y-2 min-w-[120px]">
                        <span className="text-lg font-bold text-primary">{formatPrice(item.book.price * item.quantity)}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all group/trash"
                        >
                          <Trash2 size={18} className="transform group-hover/trash:rotate-12" />
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-primary text-primary-foreground p-10 rounded-[3rem] shadow-2xl flex flex-col space-y-8 sticky top-32"
            >
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold border-b border-white/10 pb-4">Order Summary</h2>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="opacity-70 uppercase tracking-widest">Subtotal</span>
                        <span className="text-lg">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="opacity-70 uppercase tracking-widest">Estimated Shipping</span>
                        <span className="italic text-accent">Complimentary</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/20 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-70 uppercase font-black tracking-widest mb-1">Total Amount Due</span>
                        <span className="text-4xl font-serif font-bold tracking-tight">{formatPrice(subtotal)}</span>
                    </div>
                </div>

                <button 
                   onClick={startCheckout}
                   disabled={checkingOut}
                   className="w-full py-5 bg-accent text-white rounded-full font-bold flex items-center justify-center space-x-3 shadow-xl hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50"
                >
                    {checkingOut ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                    <span>Secure Checkout</span>
                </button>

                <p className="text-[10px] text-center opacity-50 uppercase tracking-widest font-medium">
                    Secure payment processing powered by Razorpay
                </p>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
