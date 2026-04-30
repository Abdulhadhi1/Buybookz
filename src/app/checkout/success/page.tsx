"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ArrowRight, Package, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          
          // Automatically trigger WhatsApp to Admin after a short delay
          setTimeout(() => {
            handleSendToAdmin(data);
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleSendToAdmin = (orderData: any) => {
    const adminPhone = "919677201727";
    const bookTitles = orderData.items.map((i: any) => `*${i.book.title}* (Qty: ${i.quantity})`).join("\n- ");
    const text = `Hello BuyBookz! 📚\n\nNew Order Confirmed! ✅\n\n*Order ID:* #${orderData.id.slice(-8).toUpperCase()}\n*Customer:* ${orderData.user.name || orderData.user.email}\n*Total Amount:* ${formatPrice(orderData.totalAmount)}\n\n*Books Ordered:*\n- ${bookTitles}\n\nPlease process this order. Thank you!`;
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSendToUser = () => {
    if (!order?.user?.phone) {
        alert("User phone number not found. Please update your profile.");
        return;
    }
    const userPhone = order.user.phone.replace(/\D/g, "");
    const formattedPhone = userPhone.startsWith("91") ? userPhone : `91${userPhone}`;
    const text = `Hi ${order.user.name || 'there'}! 👋\n\nThank you for ordering from *BuyBookz*! 📚\n\nYour order is confirmed and is being processed.\n\n*Order ID:* #${order.id.slice(-8).toUpperCase()}\n*Amount:* ${formatPrice(order.totalAmount)}\n\nWe will notify you once your books are dispatched. Happy Reading! 📖`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl font-serif">Order not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4 italic">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-12">Your literary journey begins now. We have received your order.</p>

          <div className="bg-white rounded-[3rem] p-10 border border-border shadow-xl mb-12 text-left">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-border/50">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Order Identifier</p>
                    <p className="text-xl font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Amount Paid</p>
                    <p className="text-2xl font-serif font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                </div>
            </div>

            <div className="space-y-6 mb-10">
                <div className="flex items-center space-x-3 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Processing Automations</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                    We are opening WhatsApp to notify the admin. If it doesn&apos;t open automatically, please use the buttons below.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={() => handleSendToAdmin(order)}
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-[#25D366] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-200 hover:scale-[1.02] transition-all"
                >
                    <MessageCircle size={18} />
                    <span>Notify Admin</span>
                </button>
                <button 
                    onClick={handleSendToUser}
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <Package size={18} />
                    <span>Get Order Copy</span>
                </button>
            </div>
          </div>

          <button 
            onClick={() => router.push("/orders")}
            className="flex items-center justify-center space-x-2 mx-auto text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
          >
            <span>View All Orders</span>
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
