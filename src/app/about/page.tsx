"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
            >
                <div className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Our Legacy</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary leading-tight">Curating Stories Since 2024</h1>
                </div>
                
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed italic">
                    <p>
                        BuyBookz was born out of a simple yet profound realization: that in a digital world, the visceral experience of a well-told story is more vital than ever.
                    </p>
                    <p>
                        We don't just sell books; we provide portals to different worlds. Each title in our collection is hand-picked for its ability to provoke thought, inspire emotion, or challenge perspectives.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-border">
                    <div className="space-y-2">
                        <h4 className="text-4xl font-serif font-bold text-primary">5k+</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Curated Titles</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-4xl font-serif font-bold text-primary">12k</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Happy Readers</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/40 flex items-center justify-center p-20">
                     <div className="text-center space-y-4">
                         <div className="w-20 h-0.5 bg-white mx-auto"></div>
                         <p className="text-white text-3xl font-serif italic">"A room without books is like a body without a soul."</p>
                         <p className="text-white/60 text-xs font-black uppercase tracking-widest">— Marcus Tullius Cicero</p>
                     </div>
                </div>
            </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
