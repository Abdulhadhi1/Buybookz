"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, MapPin, ShoppingBag, CreditCard, ChevronRight } from "lucide-react";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STEPS = ["Shipping Address", "Order Summary", "Payment"];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  
  // Detailed Address Form State
  const [addressForm, setAddressForm] = useState({
    country: "India",
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    houseNo: "",
    buildingName: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "Tamil Nadu"
  });

  const router = useRouter();

  const fetchAddresses = async () => {
    try {
        const res = await fetch("/api/addresses");
        const addrList = await res.json();
        setAddresses(addrList);
        if (addrList.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addrList.find((a: any) => a.isDefault)?.id || addrList[0].id);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAddress(true);
    
    // Construct full address string for the existing schema
    const fullAddress = `${addressForm.houseNo}, ${addressForm.buildingName}${addressForm.landmark ? ', ' + addressForm.landmark : ''}`;
    
    try {
        const res = await fetch("/api/addresses", {
            method: "POST",
            body: JSON.stringify({ 
                address: fullAddress, 
                city: addressForm.city, 
                state: addressForm.state, 
                pincode: addressForm.pincode,
                isDefault: addresses.length === 0 
            }),
        });
        if (res.ok) {
            await fetchAddresses();
            setShowAddressForm(false);
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
          setAddressForm(prev => ({ ...prev, fullName: sessionData.user.name || "", emailAddress: sessionData.user.email || "" }));
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

  const handleFinalPayment = async () => {
    setProcessing(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ addressId: selectedAddressId }),
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
            router.push(`/checkout/success?orderId=${orderData.orderId}`);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#ef4444" },
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="pt-24 lg:pt-32 pb-24 max-w-5xl mx-auto px-4">
        
        {/* Step Navigation Tabs */}
        <div className="flex items-center justify-center space-x-8 md:space-x-16 border-b border-border mb-10 overflow-x-auto no-scrollbar pb-1">
            {STEPS.map((step, idx) => (
                <button 
                    key={step}
                    onClick={() => idx <= activeStep && setActiveStep(idx)}
                    className={`relative pb-4 text-sm md:text-base font-bold whitespace-nowrap transition-colors ${activeStep === idx ? 'text-red-600' : 'text-muted-foreground'}`}
                >
                    {step}
                    {activeStep === idx && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full" />
                    )}
                </button>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Main Content Area */}
            <div className="flex-grow w-full lg:w-[65%]">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SHIPPING ADDRESS */}
                    {activeStep === 0 && (
                        <motion.div 
                            key="shipping"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl border border-border p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Select a delivery address</h2>
                                {addresses.length > 0 && !showAddressForm && (
                                    <button onClick={() => setShowAddressForm(true)} className="text-sm font-bold text-blue-600 hover:underline">+ Add address</button>
                                )}
                            </div>

                            {!showAddressForm ? (
                                <div className="space-y-6">
                                    {addresses.length > 0 ? (
                                        addresses.map((addr) => (
                                            <div 
                                                key={addr.id} 
                                                className={`p-6 rounded-xl border transition-all ${selectedAddressId === addr.id ? 'border-blue-200 bg-blue-50/20' : 'border-border bg-white'}`}
                                            >
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-lg">{user?.name || 'Customer'}</p>
                                                        <p className="text-sm font-bold">{addressForm.mobileNumber || '9999999999'}</p>
                                                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                                                        <p className="text-sm text-muted-foreground mt-2">{addr.address}</p>
                                                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.pincode},</p>
                                                        <p className="text-sm text-muted-foreground">{addr.state}, India</p>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-4">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedAddressId(addr.id);
                                                                setActiveStep(1);
                                                            }}
                                                            className="px-8 py-3 border border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition-colors"
                                                        >
                                                            Deliver this address
                                                        </button>
                                                        <button className="text-sm font-bold text-blue-600 hover:underline">Edit address</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                                            <button onClick={() => setShowAddressForm(true)} className="text-blue-600 font-bold hover:underline">+ Add your first delivery address</button>
                                        </div>
                                    )}
                                    
                                    {addresses.length > 0 && (
                                        <button onClick={() => setShowAddressForm(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center space-x-2">
                                            <span>+ Add address</span>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSaveAddress} className="space-y-8">
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="bg-green-600 text-white px-4 py-1.5 rounded-md text-xs font-bold shadow-sm">Show All Addresses</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Country */}
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold">Country<span className="text-red-500">*</span></label>
                                            <select className="w-full p-3 bg-white border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})}>
                                                <option>India</option>
                                                <option>USA</option>
                                                <option>UK</option>
                                            </select>
                                        </div>

                                        {/* Name & Mobile */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Full Name<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Mobile Number<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.mobileNumber} onChange={e => setAddressForm({...addressForm, mobileNumber: e.target.value})} />
                                        </div>

                                        {/* Email & House No */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Email Address<span className="text-red-500">*</span></label>
                                            <input required type="email" className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.emailAddress} onChange={e => setAddressForm({...addressForm, emailAddress: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">House / Flat / Block no.<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.houseNo} onChange={e => setAddressForm({...addressForm, houseNo: e.target.value})} />
                                        </div>

                                        {/* Building / Street */}
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold">Building name, Apartment Area, Street, Village<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.buildingName} onChange={e => setAddressForm({...addressForm, buildingName: e.target.value})} />
                                        </div>

                                        {/* Landmark & Pincode */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-muted-foreground">Landmark (optional)</label>
                                            <input className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Pincode<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                                        </div>

                                        {/* Town & State */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Town/City<span className="text-red-500">*</span></label>
                                            <input required className="w-full p-3 border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">State<span className="text-red-500">*</span></label>
                                            <select className="w-full p-3 bg-white border border-border rounded-lg outline-none focus:border-red-500" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})}>
                                                <option>Tamil Nadu</option>
                                                <option>Kerala</option>
                                                <option>Karnataka</option>
                                                <option>Maharashtra</option>
                                                <option>Delhi</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={addingAddress}
                                        className="w-full py-4 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors"
                                    >
                                        {addingAddress ? <Loader2 className="animate-spin mx-auto" /> : "Save and Continue"}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: ORDER SUMMARY */}
                    {activeStep === 1 && (
                        <motion.div 
                            key="summary"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-8"
                        >
                            <h2 className="text-xl font-bold">Review your treasures</h2>
                            <div className="divide-y divide-border">
                                {items.map((item) => (
                                    <div key={item.id} className="py-6 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-16 h-24 bg-secondary rounded-lg overflow-hidden border border-border/50">
                                                {item.book.image ? <Image src={item.book.image} alt={item.book.title} fill className="object-cover" /> : null}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{item.book.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-1 italic">Qty: {item.quantity} • {item.language || 'Edition'}</p>
                                            </div>
                                        </div>
                                        <p className="font-black">₹{(item.book.price * item.quantity).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setActiveStep(2)}
                                className="w-full py-4 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Continue to Payment</span>
                                <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {activeStep === 2 && (
                        <motion.div 
                            key="payment"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl border border-border p-12 shadow-sm text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Ready for Checkout</h2>
                                <p className="text-muted-foreground">Complete your purchase using our secure payment gateway.</p>
                            </div>
                            
                            <div className="p-6 border border-border rounded-2xl bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm"><CreditCard className="text-blue-500" size={24} /></div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Online Payment</p>
                                        <p className="text-xs text-muted-foreground">UPI, Cards, Netbanking</p>
                                    </div>
                                </div>
                                <span className="bg-blue-100 text-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded">Secure</span>
                            </div>

                            <button 
                                onClick={handleFinalPayment}
                                disabled={processing}
                                className="w-full py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 flex items-center justify-center space-x-3"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                                <span>Pay ₹{subtotal.toFixed(0)} and Complete Order</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Price Summary Sidebar */}
            <div className="w-full lg:w-[320px] sticky top-32 space-y-6">
                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b border-border pb-4">Price Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Bag Subtotal</span>
                            <span>₹{subtotal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Delivery Fee</span>
                            <span className="text-green-600 italic">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                            <span className="font-bold">Order Total</span>
                            <span className="text-xl font-black">₹{subtotal.toFixed(0)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
                    <div className="bg-white p-2 rounded-lg text-blue-500 shadow-sm"><CheckCircle2 size={16} /></div>
                    <p className="text-[11px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">Your transaction is encrypted and 100% secure.</p>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
