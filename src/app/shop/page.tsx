"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";

function ShopContent() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("latest");

  const categories = ["All", "Novel", "Mystery", "Sci-Fi", "History", "Self-Help"];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) setSearchTerm(query);
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const bookCategoryName = typeof book.category === 'object' ? book.category?.name : book.category;
    const matchesCategory = selectedCategory === "All" || bookCategoryName?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0; // default (latest)
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Refined Header */}
      <section className="pt-32 pb-12 px-6 lg:px-12 border-b border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-accent">Curated Collection</span>
                <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight">{selectedCategory === "All" ? "The Archive" : selectedCategory}</h1>
            </div>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed italic">
              Displaying {filteredBooks.length} titles from our premium publication house.
            </p>
        </div>
      </section>

      {/* Modern Filter Toolbar */}
      <section className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-sm">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input 
                    type="text"
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/40 border border-transparent rounded-full focus:bg-white focus:border-accent/20 outline-none text-[10px] font-bold uppercase tracking-widest transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat 
                            ? "bg-primary text-white" 
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 bg-secondary/40 rounded-full border border-transparent">
                    <ArrowUpDown size={12} className="text-foreground/40" />
                    <select 
                        className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer"
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
      </section>

      {/* Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Synchronizing Archive...</p>
            </div>
        ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
                {filteredBooks.map((book: any) => (
                    <BookCard key={book.id} {...book} />
                ))}
            </div>
        ) : (
            <div className="text-center py-40 space-y-8 bg-secondary/10 rounded-[4rem] border border-dashed border-border/50">
                <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-bold italic text-primary/20 tracking-tight">No records located.</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Try adjusting your selection criteria.</p>
                </div>
                <button 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setSortBy("latest");}}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-accent transition-all"
                >
                    <span>Reset All Filters</span>
                    <ArrowRight size={14} />
                </button>
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-accent" size={48} /></div>}>
            <ShopContent />
        </Suspense>
    );
}
