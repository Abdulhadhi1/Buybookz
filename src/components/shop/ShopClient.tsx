"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, ArrowUpDown, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";

interface ShopClientProps {
  initialBooks: any[];
  initialCategories: any[];
}

export default function ShopClient({ initialBooks, initialCategories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("latest");

  // Synchronize state with URL params (e.g., when clicking View All)
  useEffect(() => {
    const query = searchParams.get("query");
    if (query !== null) setSearchTerm(query);
    
    const cat = searchParams.get("category");
    if (cat !== null) {
        setSelectedCategory(cat);
    } else {
        setSelectedCategory("All");
    }
  }, [searchParams]);

  const filteredBooks = initialBooks.filter((book: any) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const bookCategoryName = typeof book.category === 'object' ? book.category?.name : book.category;
    
    // Exact match for category names from URL, case-insensitive for safety
    const matchesCategory = selectedCategory === "All" || 
                           bookCategoryName?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0;
  });

  const allCategories = ["All", ...initialCategories.map(c => c.name)];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Refined Header */}
      <section className="pt-32 pb-10 px-6 lg:px-12 border-b border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Publisher Archives</span>
                <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight">
                    {selectedCategory === "All" ? "The Full Library" : selectedCategory}
                </h1>
            </div>
            <div className="flex flex-col md:items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-relaxed italic">
                  Showing {filteredBooks.length} curated works
                </p>
            </div>
        </div>
      </section>

      {/* Modern Filter Toolbar */}
      <section className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
                {/* Search Input */}
                <div className="relative flex-grow max-w-sm">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                        type="text"
                        placeholder="Search books or authors..."
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-transparent rounded-full focus:bg-white focus:border-accent/20 outline-none text-[10px] font-bold uppercase tracking-wider transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sorting Dropdown */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3 px-5 py-2.5 bg-secondary/50 rounded-full border border-transparent text-foreground/60">
                        <ArrowUpDown size={12} />
                        <select 
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">Latest Arrivals</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Dynamic Publisher Filters */}
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest opacity-40">
                    <Filter size={10} />
                    <span>Publishers:</span>
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                (selectedCategory.toLowerCase() === cat.toLowerCase())
                                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                                : "bg-secondary/60 text-muted-foreground hover:bg-secondary border border-transparent hover:border-border/50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filteredBooks.map((book: any) => (
                    <BookCard key={book.id} {...book} />
                ))}
            </div>
        ) : (
            <div className="text-center py-40 space-y-8 bg-secondary/5 rounded-[4rem] border border-dashed border-border/30">
                <div className="space-y-3">
                    <h3 className="text-2xl font-serif text-primary/30 tracking-tight italic">No titles found in this archive.</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Try clearing your search or exploring all publishers.</p>
                </div>
                <button 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setSortBy("latest");}}
                    className="inline-flex items-center space-x-4 px-10 py-5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:bg-accent transition-all active:scale-95"
                >
                    <span>Reset All Archives</span>
                    <ArrowRight size={14} />
                </button>
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
