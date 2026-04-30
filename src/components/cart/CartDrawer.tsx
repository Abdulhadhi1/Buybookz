"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, cartItems, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[1000] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/5 p-2 rounded-xl">
                    <ShoppingBag className="text-primary" size={20} />
                </div>
                <h2 className="text-lg font-black text-primary uppercase tracking-widest">Your Cart</h2>
                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {cartItems.length}
                </span>
              </div>
              <button 
                onClick={closeDrawer}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-24 w-16 flex-shrink-0 bg-secondary rounded-lg overflow-hidden border border-border/10">
                      {item.book.image ? (
                        <Image src={item.book.image} alt={item.book.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-serif text-muted-foreground">{item.book.title[0]}</div>
                      )}
                    </div>
                    
                    <div className="flex-grow space-y-1">
                      <h3 className="text-sm font-bold text-primary line-clamp-1 group-hover:text-red-500 transition-colors">
                        {item.book.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground italic">{item.book.author}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border rounded-lg p-0.5">
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:text-primary"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 text-red-500"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-black text-primary">₹{item.book.price * item.quantity}</span>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-secondary p-6 rounded-full">
                        <ShoppingBag size={48} className="text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-muted-foreground font-medium italic">Your cart is feeling a bit empty...</p>
                    <button 
                        onClick={closeDrawer}
                        className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                    >
                        Start Shopping
                    </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border bg-secondary/30 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl font-black text-primary">₹{subtotal.toFixed(0)}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={handleCheckout}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                    >
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={14} />
                    </button>
                    <Link 
                        href="/cart" 
                        onClick={closeDrawer}
                        className="w-full py-4 border-2 border-border text-primary rounded-2xl font-black uppercase tracking-widest text-[11px] text-center hover:bg-white transition-all"
                    >
                        View Full Cart
                    </Link>
                </div>
                <p className="text-center text-[10px] text-muted-foreground font-medium">Shipping & taxes calculated at checkout</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
