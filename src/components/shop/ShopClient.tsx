"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronDown, X, ChevronRight, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";
import Link from "next/link";

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
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("relevance");
  const [showInStockOnly, setShowInStockOnly] = useState(true);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    const params = new URLSearchParams(searchParams.toString());
    if (catName === "All") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const filteredBooks = initialBooks.filter((book) => {
    const bookCategoryName = typeof book.category === "object" ? book.category?.name : book.category;
    const matchesCategory = selectedCategory === "All" ||
                           bookCategoryName?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    
    const matchesStock = showInStockOnly ? (book.stock ?? 10) > 0 : true;
    
    return matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 1. Horizontal Category Bar (Top) */}
      <div className="pt-24 bg-white border-b border-border shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 overflow-x-auto no-scrollbar flex items-center space-x-8 whitespace-nowrap">
            {["All", ...initialCategories.map(c => c.name)].map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-xs font-bold transition-all ${selectedCategory === cat ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground hover:text-primary'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 2. Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={10} />
            <span className="text-primary font-bold">{selectedCategory}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* 3. Left Sidebar (Filters) */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <div className="bg-white rounded-2xl border border-border p-6 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Filters</h2>
                        <button 
                            onClick={() => {setSelectedCategory("All"); setShowInStockOnly(false); router.push("/shop")}}
                            className="text-[10px] font-bold text-accent hover:underline"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2">
                        {selectedCategory !== "All" && (
                            <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1.5 rounded-full text-[10px] font-bold">
                                <span>{selectedCategory}</span>
                                <button onClick={() => handleCategorySelect("All")}><X size={10} /></button>
                            </div>
                        )}
                        {showInStockOnly && (
                            <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1.5 rounded-full text-[10px] font-bold">
                                <span>In stock</span>
                                <button onClick={() => setShowInStockOnly(false)}><X size={10} /></button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="border-t border-border pt-4 group">
                            <div className="flex items-center justify-between cursor-pointer">
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">Categories</span>
                                <ChevronDown size={14} className="text-muted-foreground" />
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 group">
                            <div className="flex items-center justify-between cursor-pointer">
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">Authors</span>
                                <ChevronDown size={14} className="text-muted-foreground" />
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 group">
                            <div className="flex items-center justify-between cursor-pointer text-primary">
                                <span className="text-xs font-bold">Availability</span>
                                <ChevronDown size={14} />
                            </div>
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={showInStockOnly} 
                                        onChange={(e) => setShowInStockOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                                    />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Show In Stock</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 4. Main Content Area */}
            <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                        {selectedCategory === "All" ? "Explore Our Archive" : `${selectedCategory} Books`}
                    </h1>
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2 text-muted-foreground">
                            <LayoutGrid size={16} className="text-primary cursor-pointer" />
                            <List size={16} className="cursor-pointer hover:text-primary transition-colors" />
                         </div>
                         <div className="h-6 w-[1px] bg-border hidden md:block" />
                         <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-border px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                         >
                            <option value="relevance">By Relevance</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                         </select>
                    </div>
                </div>

                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} {...book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 space-y-6 bg-white rounded-[3rem] border border-border shadow-sm">
                        <h3 className="text-xl font-serif text-muted-foreground italic">No books found in this filter.</h3>
                        <button 
                            onClick={() => {setSelectedCategory("All"); setShowInStockOnly(false); router.push("/shop")}}
                            className="px-8 py-3.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
