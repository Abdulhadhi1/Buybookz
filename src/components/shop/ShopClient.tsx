"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, ArrowUpDown, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";

interface ShopBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  stock?: number;
  category?: { name?: string | null } | string | null;
}

interface ShopCategory {
  id: string;
  name: string;
}

interface ShopClientProps {
  initialBooks: ShopBook[];
  initialCategories: ShopCategory[];
}

export default function ShopClient({ initialBooks, initialCategories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryFromUrl = searchParams.get("category") || "All";
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("latest");
  const effectiveSearch = searchTerm || query;
  const effectiveCategory = selectedCategory || categoryFromUrl;

  const filteredBooks = initialBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                         book.author.toLowerCase().includes(effectiveSearch.toLowerCase());
    
    const bookCategoryName = typeof book.category === "object" ? book.category?.name : book.category;
    
    const matchesCategory = effectiveCategory === "All" ||
                           bookCategoryName?.trim().toLowerCase() === effectiveCategory.trim().toLowerCase();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0;
  });

  const allCategories = ["All", ...initialCategories.map((category) => category.name)];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 md:pt-32 pb-4 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-border/40 bg-white/80 backdrop-blur-xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <div className="relative flex-grow">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  className="w-full pl-11 pr-4 py-3.5 bg-secondary/50 border border-transparent rounded-full focus:bg-white focus:border-accent/20 outline-none text-xs md:text-sm font-semibold transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-3 px-4 py-3 bg-secondary/50 rounded-full border border-transparent text-foreground/60 w-full lg:w-auto">
                  <ArrowUpDown size={12} />
                  <select
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer w-full"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                </div>
                <p className="hidden md:block text-[10px] font-black uppercase tracking-widest text-foreground/40 whitespace-nowrap">
                  {filteredBooks.length} books
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest opacity-40">
                <Filter size={10} />
                <span>Categories</span>
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      effectiveCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary border border-transparent hover:border-border/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 md:hidden text-[10px] font-black uppercase tracking-widest text-foreground/40">
              {filteredBooks.length} books found
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
                {filteredBooks.map((book) => (
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
