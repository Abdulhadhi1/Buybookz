"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Loader2, ArrowLeft, CheckCircle2, BookOpen, MessageCircle, Search, Hash } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [searchError, setSearchError] = useState("");
  const router = useRouter();

  const generateWhatsAppLink = (order: any) => {
    const phone = "919677201727";
    const bookTitles = order.items.map((i: any) => `*${i.book.title}* (Qty: ${i.quantity})`).join("\n- ");
    const text = `Hello BuyBookz! 📚\n\nI have successfully paid for my order.\n\n*Order ID:* #${order.id.slice(-8).toUpperCase()}\n*Total Amount:* ${formatPrice(order.totalAmount)}\n\n*Books Ordered:*\n- ${bookTitles}\n\nPlease verify and process my order. Thank you!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearching(true);
    setSearchError("");
    setSearchedOrder(null);

    try {
      // We try to find in the existing list first for speed
      const foundInList = orders.find(o => 
        o.id.toLowerCase().includes(searchId.toLowerCase()) || 
        o.id.slice(-8).toLowerCase().includes(searchId.toLowerCase())
      );

      if (foundInList) {
        setSearchedOrder(foundInList);
      } else {
        // If not found in current user's list (maybe it's a full ID), try API
        const res = await fetch(`/api/orders/${searchId}`);
        if (res.ok) {
          const data = await res.json();
          setSearchedOrder(data);
        } else {
          setSearchError("Order not found or access denied.");
        }
      }
    } catch (err) {
      setSearchError("Failed to track order. Please check the ID.");
    } finally {
      setSearching(false);
    }
  };

  const OrderCard = ({ order, isHighlighted = false }: { order: any, isHighlighted?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-[2rem] p-6 md:p-8 border border-border shadow-sm transition-all",
        isHighlighted ? "ring-2 ring-accent border-accent/20 shadow-xl scale-[1.02]" : "hover:shadow-md"
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm font-bold flex items-center gap-2">
            <Hash size={14} className="text-accent" />
            #{order.id.slice(-8).toUpperCase()}
            <span className="text-[8px] text-muted-foreground/40 font-normal">({order.id})</span>
          </p>
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
                <h4 className="font-bold text-sm italic group-hover:text-accent transition-colors line-clamp-1">{item.book.title}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.book.price)}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
          </div>
        ))}
      </div>

      {order.status === 'PAID' && (
        <div className="mt-8 pt-6 border-t border-border border-dashed flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#25D366]/5 -mx-8 -mb-8 px-8 py-6 rounded-b-[2rem]">
          <div className="flex flex-col text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366] mb-1">Final Step: Verification</span>
              <span className="text-xs font-bold text-muted-foreground">Forward details to WhatsApp for instant verification.</span>
          </div>
          
          <a 
            href={generateWhatsAppLink(order)}
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 transition-all bg-[#25D366] text-white hover:bg-[#1ebd5a] shadow-[0_15px_30px_-5px_rgba(37,211,102,0.4)] active:scale-95 group w-full sm:w-auto justify-center flex-shrink-0"
          >
            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
            <span>Send to WhatsApp</span>
          </a>
        </div>
      )}
    </motion.div>
  );

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center space-x-6">
            <button onClick={() => router.push("/")} className="p-4 bg-secondary/50 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Your Orders</h1>
          </div>

          <div className="w-full md:w-80">
            <form onSubmit={handleSearch} className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Track by Order ID..."
                className="w-full bg-secondary/30 border border-border/50 rounded-full pl-10 pr-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent/50 focus:bg-white transition-all"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              {searching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 size={12} className="animate-spin text-accent" />
                </div>
              )}
            </form>
          </div>
        </div>

        <AnimatePresence>
          {searchedOrder && (
            <div className="mb-16 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Search Result</h3>
                <button onClick={() => setSearchedOrder(null)} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Clear Result</button>
              </div>
              <OrderCard order={searchedOrder} isHighlighted={true} />
            </div>
          )}
        </AnimatePresence>

        {searchError && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mb-8 p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center"
          >
            {searchError}
          </motion.p>
        )}

        <div className="space-y-12">
          {!searchedOrder && orders.length === 0 ? (
            <div className="text-center py-24 space-y-6">
              <Package size={64} className="mx-auto text-muted-foreground opacity-20" />
              <h2 className="text-2xl font-serif font-bold opacity-60">No orders found</h2>
              <button 
                onClick={() => router.push("/")}
                className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders
                .filter(o => o.id !== searchedOrder?.id)
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

