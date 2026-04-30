"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CartBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  language?: string | null;
  book: CartBook;
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
    // Prefetch checkout for instant transition
    router.prefetch("/checkout");
  }, [router, refreshCart]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-border">
            <ShoppingCart size={64} className="mx-auto text-muted-foreground opacity-20 mb-6" />
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some books to your collection to see them here.</p>
            <Link href="/shop" className="inline-flex px-8 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Items List */}
            <div className="flex-grow w-full lg:w-[65%] bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 relative group">
                    {/* Book Image */}
                    <div className="relative w-24 h-32 flex-shrink-0 bg-secondary rounded-lg overflow-hidden border border-border/50">
                      {item.book.image ? (
                        <Image src={item.book.image} alt={item.book.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-muted-foreground">{item.book.title[0]}</div>
                      )}
                    </div>

                    {/* Book Info & Controls */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-[#1E293B] line-clamp-1">{item.book.title}</h3>
                          {item.language && <p className="text-xs text-muted-foreground font-medium italic">Edition: {item.language}</p>}
                        </div>
                        
                        {/* Quantity Controls - Right Top */}
                        <div className="flex items-center space-x-3">
                           <span className="text-xs font-bold text-[#4A4A4A]">Quantity</span>
                           <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-secondary transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 text-red-500 hover:bg-secondary transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                           </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Price - Left Bottom */}
                        <p className="text-2xl font-black text-[#1E293B]">₹{(item.book.price * item.quantity).toFixed(0)}</p>
                        
                        {/* Delete Button - Right Bottom */}
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="flex items-center space-x-2 px-4 py-2 text-[10px] font-bold text-muted-foreground hover:text-red-500 border border-border rounded-lg hover:bg-red-50 transition-all"
                        >
                            <Trash2 size={14} />
                            <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Sidebar */}
            <div className="w-full lg:w-[350px] space-y-4 sticky top-32">
                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
                    <div className="flex items-center space-x-4 text-[#1E293B]">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <ShoppingCart size={20} />
                        </div>
                        <p className="text-sm font-bold">You have <span className="text-red-500">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} items</span></p>
                    </div>

                    <div className="space-y-4 border-t border-border pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-[#4A4A4A]">Price of Items</span>
                            <span className="text-sm font-bold text-[#1E293B]">₹{subtotal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border pt-4">
                            <span className="text-base font-bold text-red-500">Total</span>
                            <span className="text-lg font-black text-[#1E293B]">₹{subtotal.toFixed(0)}</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <Link 
                            href="/checkout"
                            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-red-100 hover:bg-red-700 transition-colors block text-center"
                        >
                            Proceed to checkout
                        </Link>
                        <button 
                            onClick={() => router.push("/shop")}
                            className="w-full text-center text-sm font-bold text-green-600 hover:underline block"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">+ Free Delivery on all orders</p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
