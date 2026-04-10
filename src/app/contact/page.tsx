"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
        setSending(false);
        alert("Message sent! We'll get back to you shortly.");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Get in Touch</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary leading-tight">Connect with Our Curators</h1>
                </div>

                <div className="space-y-8">
                    <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-1">Email Us</h4>
                            <p className="text-lg text-muted-foreground italic">hello@buybookz.com</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-1">Call Our Desk</h4>
                            <p className="text-lg text-muted-foreground italic">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-1">Visit The Library</h4>
                            <p className="text-lg text-muted-foreground italic">123 Literary Lane, Chennai, Tamil Nadu</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/40 p-10 md:p-16 rounded-[4rem] border border-border"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-4">Full Name</label>
                            <input required className="w-full px-8 py-5 bg-white rounded-3xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-4">Email Address</label>
                            <input required type="email" className="w-full px-8 py-5 bg-white rounded-3xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold" placeholder="your@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-4">Your Inquiry</label>
                        <textarea required rows={5} className="w-full px-8 py-5 bg-white rounded-3xl border border-border focus:ring-2 focus:ring-accent outline-none font-bold resize-none" placeholder="How can we help your reading journey?" />
                    </div>
                    <button 
                        disabled={sending}
                        className="w-full py-6 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-3 shadow-2xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        <span className="uppercase tracking-widest text-xs font-black">Dispatch Message</span>
                    </button>
                </form>
            </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
