"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, ChevronRight, Loader2, ArrowLeft, CheckCircle2, BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/user");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="flex items-center space-x-6 mb-16">
          <button onClick={() => router.push("/")} className="p-4 bg-secondary/50 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-5xl font-serif font-bold text-primary">Your Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <Package size={64} className="mx-auto text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-serif font-bold opacity-60">No orders found</h2>
            <button 
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1 md:text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Date</p>
                    <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1 md:text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Status</p>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-secondary text-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1 md:text-right">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-serif font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-secondary rounded-lg flex items-center justify-center font-serif text-primary/30 text-xs shadow-sm italic overflow-hidden">
                          {item.book.image ? (
                             <img src={item.book.image} alt={item.book.title} className="w-full h-full object-cover" />
                          ) : item.book.title[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm italic group-hover:text-accent transition-colors">{item.book.title}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.book.price)}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
