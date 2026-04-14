"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface CategoriesClientProps {
  initialCategories: any[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-24"
        >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Publication Network</span>
            <h1 className="text-6xl md:text-8xl font-serif font-black text-primary leading-tight tracking-tight">The Publishers</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground italic leading-relaxed">
                Connect with our esteemed network of publication houses, each dedicated to bringing world-class literature to your library.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {initialCategories.map((cat, idx) => (
                <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <Link 
                        href={`/shop?category=${cat.name}`}
                        className="group flex flex-col p-12 bg-white dark:bg-zinc-900 border border-border rounded-[4rem] hover:border-accent hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 relative overflow-hidden h-full"
                    >
                        <div className="w-20 h-20 rounded-[2.5rem] bg-secondary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                            <BookOpen size={32} />
                        </div>
                        
                        <div className="flex-grow">
                            <h3 className="text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors mb-3 leading-tight uppercase tracking-tight">
                                {cat.name}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                {cat._count?.books || 0} Titles in Archive
                            </p>
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-border/10 flex items-center justify-between text-accent">
                            <span className="text-[9px] font-black uppercase tracking-widest group-hover:mr-4 transition-all">Explore Publisher</span>
                            <div className="h-10 w-10 rounded-full border border-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>

        {initialCategories.length === 0 && (
            <div className="text-center py-40 border-2 border-dashed border-border rounded-[4rem]">
                 <h2 className="text-3xl font-serif text-primary/20 italic">No publishers found in the registry.</h2>
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
