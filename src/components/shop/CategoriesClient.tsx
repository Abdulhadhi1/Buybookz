"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface CategoriesClientProps {
  initialCategories: any[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-24"
        >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Publication Network</span>
            <h1 className="text-6xl md:text-7xl font-serif font-black text-primary leading-tight tracking-tight">The Publishers</h1>
            <p className="max-w-2xl mx-auto text-sm text-muted-foreground italic leading-relaxed uppercase tracking-widest font-bold">
                Exquisite houses of literature and storytelling masterpieces.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {initialCategories.map((cat, idx) => (
                <motion.div
                    key={cat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="h-full"
                >
                    <Link 
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="group flex flex-col p-12 bg-white border border-border rounded-[4rem] hover:border-accent hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] transition-all duration-500 relative overflow-hidden h-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]"
                    >
                        {/* Force White Icon Container */}
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-border flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500 shadow-sm">
                            <Layers size={32} />
                        </div>
                        
                        <div className="flex-grow space-y-5">
                            <h3 className="text-3xl font-serif font-black text-primary group-hover:text-accent transition-colors leading-tight uppercase tracking-tighter">
                                {cat.name}
                            </h3>
                            <div className="flex items-center space-x-3">
                                <span className="h-0.5 w-6 bg-accent opacity-30" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">
                                    {cat._count?.books || 0} Registered Collections
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-border/10 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent group-hover:mr-4 transition-all">Explore Catalogue</span>
                            <div className="h-11 w-11 rounded-full border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all text-accent shadow-sm">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>

        {initialCategories.length === 0 && (
            <div className="text-center py-40 bg-white border border-dashed border-border rounded-[4rem] shadow-sm">
                 <h2 className="text-2xl font-serif text-primary/10 italic">Library Index Empty.</h2>
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
