"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CreditCard, ChevronRight, Loader2, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([
          fetch("/api/cart"),
          fetch("/api/addresses")
        ]);
        
        if (cartRes.status === 401) {
            router.push("/login");
            return;
        }

        const [cartItems, addrList] = await Promise.all([
          cartRes.json(),
          addrRes.json()
        ]);

        setItems(cartItems);
        setAddresses(addrList);
        if (addrList.length > 0) {
            setSelectedAddress(addrList.find((a: any) => a.isDefault)?.id || addrList[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const subtotal = items.reduce((acc: number, item: any) => acc + item.book.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setProcessing(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ addressId: selectedAddress }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error);

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BuyBookz",
        description: "Purchase of Books",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            router.push(`/orders`);
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#d4a373",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
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
      
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6 mb-16">
            <button onClick={() => router.back()} className="p-4 bg-secondary/50 rounded-full hover:bg-secondary transition-colors">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-5xl font-serif font-bold text-primary">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Steps / Info */}
            <div className="lg:col-span-2 space-y-12">
                {/* 1. Address */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <h2 className="text-2xl font-serif font-bold">Shipping Address</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-14">
                        {addresses.map((addr) => (
                           <div 
                             key={addr.id}
                             onClick={() => setSelectedAddress(addr.id)}
                             className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-accent bg-accent/5' : 'border-border bg-white hover:border-accent/40'}`}
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <MapPin size={20} className={selectedAddress === addr.id ? 'text-accent' : 'text-muted-foreground'} />
                                 {addr.isDefault && <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Default</span>}
                              </div>
                              <p className="text-sm font-medium leading-relaxed mb-4">{addr.address}, {addr.city}</p>
                              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{addr.pincode} • {addr.state}</p>
                           </div>
                        ))}
                        <button className="p-6 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 hover:text-primary transition-all">
                            <span className="text-sm font-bold uppercase tracking-widest">+ Add New Address</span>
                        </button>
                    </div>
                </section>

                {/* 2. Order Review */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <h2 className="text-2xl font-serif font-bold">Review Order</h2>
                    </div>
                    
                    <div className="ml-14 divide-y divide-border">
                        {items.map((item) => (
                           <div key={item.id} className="py-6 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-16 bg-secondary rounded-lg flex items-center justify-center font-serif text-primary/30 text-xs shadow-sm italic">
                                    {item.book.title[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{item.book.title}</h4>
                                    <p className="text-xs text-muted-foreground italic">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-sm">{formatPrice(item.book.price * item.quantity)}</span>
                           </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sticky summary */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-primary text-primary-foreground p-10 rounded-[3rem] shadow-2xl space-y-10 sticky top-32"
            >
                <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold flex items-center space-x-3">
                        <CreditCard size={20} />
                        <span>Payment Summary</span>
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-60 uppercase tracking-widest font-medium">Order Subtotal</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-60 uppercase tracking-widest font-medium">Delivery Fee</span>
                            <span className="text-accent italic">Complimentary</span>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest mb-1">Final Total</span>
                            <span className="text-4xl font-serif font-bold tracking-tighter">{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                       onClick={handleCheckout}
                       disabled={processing || items.length === 0}
                       className="w-full py-5 bg-accent text-white rounded-full font-bold flex items-center justify-center space-x-3 shadow-xl hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                        <span>Pay Securely Now</span>
                    </button>
                    
                    <div className="flex items-center justify-center space-x-6 pt-4 grayscale opacity-40">
                         <div className="text-[8px] font-black uppercase tracking-[0.2em]">UPI</div>
                         <div className="text-[8px] font-black uppercase tracking-[0.2em]">Cards</div>
                         <div className="text-[8px] font-black uppercase tracking-[0.2em]">NetBanking</div>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
