"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Script from "next/script";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PriceDisplay from "@/components/ui/PriceDisplay";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: "", city: "", state: "", pincode: "" });
  const [addingAddress, setAddingAddress] = useState(false);
  const router = useRouter();

  const fetchAddresses = async () => {
    try {
        const res = await fetch("/api/addresses");
        const addrList = await res.json();
        setAddresses(addrList);
        if (addrList.length > 0 && !selectedAddress) {
            setSelectedAddress(addrList.find((a: any) => a.isDefault)?.id || addrList[0].id);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
        const res = await fetch("/api/addresses", {
            method: "POST",
            body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
        });
        if (res.ok) {
            await fetchAddresses();
            setShowAddressForm(false);
            setNewAddress({ address: "", city: "", state: "", pincode: "" });
        }
    } catch (err) {
        console.error(err);
    } finally {
        setAddingAddress(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cartRes = await fetch("/api/cart");
      if (cartRes.status === 401) {
          router.push("/login");
          return;
      }
      const cartItems = await cartRes.json();
      setItems(cartItems);

      const sessionRes = await fetch("/api/auth/session");
      if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setUser(sessionData.user);
      }

      await fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          name: user?.name || "Customer",
          email: user?.email || "",
        },
        theme: {
          color: "#d4a373",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
          alert("Payment failed: " + response.error.description);
      });
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6 mb-12">
            <button onClick={() => router.back()} className="p-4 bg-secondary/50 rounded-full hover:bg-secondary transition-colors">
                <ArrowLeft size={18} />
            </button>
            <div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">Checkout</h1>
                <p className="text-sm text-muted-foreground mt-1 italic">Secure your literary treasures.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-12">
                <section className="space-y-8 bg-white/40 p-6 md:p-10 rounded-[3rem] border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
                            <h2 className="text-2xl font-serif font-bold">Delivery Address</h2>
                        </div>
                        {addresses.length > 0 && !showAddressForm && (
                            <button onClick={() => setShowAddressForm(true)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                                + New Address
                            </button>
                        )}
                    </div>
                    
                    {!showAddressForm ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {addresses.map((addr) => (
                               <motion.div 
                                 key={addr.id}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setSelectedAddress(addr.id)}
                                 className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative overflow-hidden group ${selectedAddress === addr.id ? 'border-accent bg-accent/5' : 'border-border bg-white hover:border-accent/30'}`}
                               >
                                  {selectedAddress === addr.id && (
                                      <div className="absolute top-0 right-0 p-3">
                                          <CheckCircle2 size={16} className="text-accent" />
                                      </div>
                                  )}
                                  <div className="flex items-center space-x-3 mb-4">
                                     <MapPin size={18} className={selectedAddress === addr.id ? 'text-accent' : 'text-muted-foreground'} />
                                     {addr.isDefault && <span className="text-[10px] uppercase font-black tracking-widest text-accent/50">Default</span>}
                                  </div>
                                  <p className="text-sm font-bold leading-relaxed mb-1 line-clamp-2">{addr.address}</p>
                                  <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">{addr.city}, {addr.state} • {addr.pincode}</p>
                               </motion.div>
                            ))}
                            {addresses.length === 0 && (
                                <button onClick={() => setShowAddressForm(true)} className="p-8 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 hover:text-primary transition-all space-y-3">
                                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"><MapPin size={20} /></div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Add Shipping Address</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAddAddress} className="space-y-6 bg-secondary/10 p-8 rounded-[2rem] border border-border">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-2">Full Street Address</label>
                                    <input required className="w-full px-6 py-4 bg-white rounded-2xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold text-sm" placeholder="Flat No, Wing, Street Name..." value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-2">City</label>
                                        <input required className="w-full px-6 py-4 bg-white rounded-2xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold text-sm" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-2">State</label>
                                        <input required className="w-full px-6 py-4 bg-white rounded-2xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold text-sm" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-2">Pincode</label>
                                    <input required className="w-full px-6 py-4 bg-white rounded-2xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold text-sm" placeholder="6 Digits" maxLength={6} value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 pt-4">
                                <button type="submit" disabled={addingAddress} className="flex-grow py-4 bg-primary text-white rounded-full font-bold shadow-xl hover:bg-primary/95 transition-all disabled:opacity-50">
                                    {addingAddress ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Save Address"}
                                </button>
                                <button type="button" onClick={() => setShowAddressForm(false)} className="px-8 py-4 bg-secondary font-bold rounded-full hover:bg-secondary/50 transition-all">Cancel</button>
                            </div>
                        </motion.form>
                    )}
                </section>

                <section className="space-y-8">
                    <div className="flex items-center space-x-5">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h2 className="text-2xl font-serif font-bold">Review Order</h2>
                    </div>
                    <div className="ml-14 divide-y divide-border">
                        {items.map((item) => (
                           <div key={item.id} className="py-6 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-20 bg-secondary rounded-xl flex items-center justify-center font-serif text-primary/30 text-xs shadow-sm border border-border select-none">
                                    {item.book.title[0]}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm tracking-tight">{item.book.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-secondary px-2 py-0.5 rounded leading-none pt-1">Qty: {item.quantity}</span>
                                        <PriceDisplay price={item.book.price} className="text-muted-foreground" amountClassName="text-[10px]" symbolClassName="text-[8px]" />
                                    </div>
                                </div>
                              </div>
                              <PriceDisplay price={item.book.price * item.quantity} amountClassName="text-sm" />
                           </div>
                        ))}
                    </div>
                </section>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-primary text-primary-foreground p-10 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] space-y-10 sticky top-32 border border-white/5">
                <div className="space-y-8">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Settlement Detail</span>
                        <h3 className="text-2xl font-serif font-bold">Checkout Summary</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs"><span className="opacity-40 uppercase tracking-widest font-black">Subtotal</span><PriceDisplay price={subtotal} amountClassName="text-sm" symbolClassName="text-xs" /></div>
                        <div className="flex justify-between items-center text-xs"><span className="opacity-40 uppercase tracking-widest font-black">Transit</span><span className="text-accent font-black uppercase tracking-widest italic">Free</span></div>
                    </div>

                    <div className="pt-8 border-t border-white/10 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Final Amount Payable</span>
                        <PriceDisplay price={subtotal} className="text-white" amountClassName="text-5xl tracking-tighter" symbolClassName="text-xl mr-1" />
                    </div>
                </div>

                <div className="space-y-6">
                    <button onClick={handleCheckout} disabled={processing || items.length === 0} className="w-full py-6 bg-accent text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-2xl hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50 group">
                        {processing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} className="group-hover:translate-x-1 transition-transform" />}
                        <span className="uppercase tracking-[0.2em] text-xs font-black">Complete Purchase</span>
                    </button>
                    <div className="flex flex-col items-center space-y-4 opacity-30">
                         <div className="flex items-center space-x-4 grayscale">
                            <CreditCard size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Fully Secure Transaction</span>
                         </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
