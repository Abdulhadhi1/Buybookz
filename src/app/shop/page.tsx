"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";

function ShopContent() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

  const categories = ["All", "Mystery", "Sci-Fi", "Lifestyle", "History", "Self-Help"];

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

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Support both string category and object-based category
    const bookCategoryName = typeof book.category === 'object' ? book.category?.name : book.category;
    const matchesCategory = selectedCategory === "All" || bookCategoryName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary tracking-tighter">The Library</h1>
                <p className="max-w-xl text-lg text-muted-foreground italic leading-relaxed">
                  Explore our curated collection of literary masterpieces, from gripping mysteries to future-shaping science fiction.
                </p>
            </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Search */}
            <div className="relative group flex-grow max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by title or author..."
                    className="w-full pl-12 pr-6 py-3 bg-secondary/50 border border-border rounded-full focus:ring-2 focus:ring-accent outline-none font-medium text-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            selectedCategory === cat 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="animate-spin text-accent" size={48} />
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Opening the archives...</p>
            </div>
        ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filteredBooks.map((book: any) => (
                    <BookCard key={book.id} {...book} />
                ))}
            </div>
        ) : (
            <div className="text-center py-40 space-y-6">
                <h3 className="text-3xl font-serif font-bold italic opacity-30">No matches found in our records.</h3>
                <button 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                    className="flex items-center space-x-2 mx-auto text-accent font-bold hover:underline"
                >
                    <span>Clear all filters</span>
                    <ArrowRight size={16} />
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
