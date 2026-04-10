"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, Loader2, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  const { refreshCartCount } = useCart();
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
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error("Update failed");
      await refreshCartCount();
    } catch (err) {
      console.error(err);
      fetchCart(); // Revert on failure
    }
  };

  const removeItem = async (id: string) => {
    // Optimistic update
    setItems(prev => prev.filter(item => item.id !== id));
    
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await refreshCartCount();
    } catch (err) {
      console.error(err);
      fetchCart(); // Revert on failure
    }
  };

  const subtotal = items.reduce((acc: number, item: any) => acc + item.book.price * item.quantity, 0);

  const startCheckout = async () => {
    setCheckingOut(true);
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

      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Shopping Bag</h1>
                <p className="text-muted-foreground mt-2 italic">You have {items.length} exquisite picks in your bag.</p>
            </div>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-accent hover:underline flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Continue Browsing</span>
            </Link>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-24 px-6 space-y-8 bg-secondary/20 rounded-[3rem] border border-dashed border-border"
          >
             <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-secondary/30">
                <ShoppingCart size={32} className="text-accent" />
             </div>
             <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-2xl font-serif font-bold text-primary">Your bag is empty</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-widest leading-loose">The library is vast, yet your collection remains humble. Start your next adventure today.</p>
             </div>
             <Link 
              href="/shop" 
              className="inline-flex items-center space-x-3 px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-2xl active:scale-95"
             >
                <ArrowRight size={16} />
                <span>Visit the Shop</span>
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="hidden md:grid grid-cols-12 px-8 mb-4 opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="col-span-6">Book Details</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Subtotal</div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-border group hover:bg-white hover:shadow-xl transition-all duration-500"
                  >
                    {/* Item Info */}
                    <div className="md:col-span-6 flex items-center space-x-6">
                        <div className="relative w-20 md:w-24 aspect-[3/4] bg-secondary rounded-xl overflow-hidden shadow-md flex-shrink-0">
                            {item.book.image ? (
                                <img src={item.book.image} alt={item.book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-serif italic text-primary/20">
                                    {item.book.title[0]}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Link href={`/book/${item.book.id}`}>
                                <h3 className="text-lg md:text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                                    {item.book.title}
                                </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground italic font-medium tracking-wide">{item.book.author}</p>
                            <p className="text-sm font-bold text-accent md:hidden mt-2">{formatPrice(item.book.price)} each</p>
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="md:col-span-3 flex items-center justify-center">
                        <div className="flex items-center bg-secondary/30 rounded-full border border-border p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-3 hover:bg-white rounded-full transition-all active:scale-90"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-3 hover:bg-white rounded-full transition-all active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                    </div>

                    {/* Price & Delete */}
                    <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                        <div className="text-right">
                            <span className="text-xl font-black font-serif text-primary tracking-tight">
                                {formatPrice(item.book.price * item.quantity)}
                            </span>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-muted-foreground hover:text-white hover:bg-red-500 rounded-full transition-all active:rotate-12 group/trash"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sticky summary */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-primary text-primary-foreground p-8 md:p-10 rounded-[3rem] shadow-2xl flex flex-col space-y-8 sticky top-32"
            >
                <div>
                    <h2 className="text-2xl font-serif font-bold border-b border-white/10 pb-6 mb-8 uppercase tracking-widest text-[10px] opacity-60">Order Summary</h2>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-60 uppercase tracking-widest font-black text-[10px]">Initial Subtotal</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-60 uppercase tracking-widest font-black text-[10px]">Express Shipping</span>
                            <span className="text-accent italic font-bold">Complimentary</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col mb-8">
                        <span className="text-[10px] opacity-40 uppercase font-black tracking-[0.3em] mb-3">Estimated Final Total</span>
                        <span className="text-5xl font-serif font-bold tracking-tighter">{formatPrice(subtotal)}</span>
                    </div>
                    
                    <button 
                       onClick={startCheckout}
                       disabled={checkingOut}
                       className="w-full py-6 bg-accent text-white rounded-full font-bold flex items-center justify-center space-x-3 shadow-2xl hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50 group"
                    >
                        {checkingOut ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        <span className="uppercase tracking-widest text-xs font-black">Proceed to Checkout</span>
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-6 grayscale opacity-30 pt-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay" className="h-4 invert" />
                </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
