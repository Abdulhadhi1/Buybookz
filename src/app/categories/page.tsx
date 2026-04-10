"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, Ghost, ChefHat, History, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { name: "Mystery", icon: <Ghost />, count: 124, color: "bg-purple-500/10 text-purple-600 border-purple-200" },
    { name: "Sci-Fi", icon: <Sparkles />, count: 98, color: "bg-blue-500/10 text-blue-600 border-blue-200" },
    { name: "Lifestyle", icon: <ChefHat />, count: 156, color: "bg-orange-500/10 text-orange-600 border-orange-200" },
    { name: "History", icon: <History />, count: 87, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
    { name: "Self-Help", icon: <Heart />, count: 212, color: "bg-red-500/10 text-red-600 border-red-200" },
    { name: "Literature", icon: <BookOpen />, count: 342, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-24"
        >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Browse by Genre</span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary leading-tight">Curated Worlds</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground italic leading-relaxed">
                Every reader has a unique path. Choose yours by exploring our carefully categorized genres, each a doorway to a new reality.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Link 
                        href={`/shop?category=${cat.name}`}
                        className="group flex flex-col p-10 bg-white border border-border rounded-[3.5rem] hover:border-accent hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full"
                    >
                        <div className={`w-20 h-20 rounded-[2rem] border ${cat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            {cat.icon}
                        </div>
                        
                        <div className="flex-grow">
                            <h3 className="text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors mb-2">{cat.name}</h3>
                            <p className="text-xs font-black uppercase tracking-widest opacity-40">{cat.count} Titles Available</p>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between text-accent">
                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:mr-4 transition-all">Explore Genre</span>
                            <ArrowRight size={18} />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
