"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, X, ChevronRight, LayoutGrid, List, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/shop/BookCard";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  totalCount: number;
}

export default function ShopClient({ initialBooks, initialCategories, totalCount: serverTotalCount }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category") || "All";
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("relevance");
  const [showInStockOnly, setShowInStockOnly] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("categories");
  const [books, setBooks] = useState(initialBooks);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(serverTotalCount);
  const [hasMoreBooks, setHasMoreBooks] = useState(initialBooks.length < serverTotalCount);
  const [isPending, startTransition] = useTransition();

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    setBooks(initialBooks);
    setTotalCount(serverTotalCount);
    setHasMoreBooks(initialBooks.length < serverTotalCount);
  }, [initialBooks, serverTotalCount]);

  const handleCategorySelect = (catName: string) => {
    startTransition(() => {
        setSelectedCategory(catName);
        const params = new URLSearchParams(searchParams.toString());
        if (catName === "All") {
          params.delete("category");
        } else {
          params.set("category", catName);
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setIsMobileFilterOpen(false);
    });
  };

  const loadMoreBooks = async () => {
    if (isLoadingMore || !hasMoreBooks) return;
    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", "12"); // Load more at once for better feel
      params.set("skip", String(books.length));
      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      } else {
        params.delete("category");
      }

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more books");

      const data = await res.json();
      const nextBooks: ShopBook[] = data.books || data;
      const nextTotal: number = data.totalCount ?? totalCount;

      setBooks((current) => [...current, ...nextBooks]);
      setTotalCount(nextTotal);
      setHasMoreBooks(books.length + nextBooks.length < nextTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredBooks = books.filter((book) => {
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

  const FilterContent = () => (
    <div className="space-y-6">
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
          {/* Categories Accordion */}
          <div className="border-t border-border pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setOpenAccordion(openAccordion === 'categories' ? null : 'categories')}
              >
                  <span className={`text-xs font-bold ${openAccordion === 'categories' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>Categories</span>
                  <ChevronDown size={14} className={`transition-transform ${openAccordion === 'categories' ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <AnimatePresence>
                {openAccordion === 'categories' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                        {["All", ...initialCategories.map(c => c.name)].map((cat) => (
                            <label 
                              key={cat} 
                              className="flex items-center space-x-3 cursor-pointer group py-1"
                              onClick={() => handleCategorySelect(cat)}
                            >
                                <input 
                                    type="radio" 
                                    name="category"
                                    checked={selectedCategory === cat} 
                                    readOnly
                                    className="w-4 h-4 rounded-full border-border text-primary focus:ring-primary cursor-pointer" 
                                />
                                <span className={`text-xs font-medium cursor-pointer ${selectedCategory === cat ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-primary'}`}>{cat}</span>
                            </label>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* Availability Accordion */}
          <div className="border-t border-border pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setOpenAccordion(openAccordion === 'availability' ? null : 'availability')}
              >
                  <span className={`text-xs font-bold ${openAccordion === 'availability' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>Availability</span>
                  <ChevronDown size={14} className={`transition-transform ${openAccordion === 'availability' ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <AnimatePresence>
                {openAccordion === 'availability' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={showInStockOnly} 
                                onChange={(e) => setShowInStockOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                            />
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary cursor-pointer">Show In Stock</span>
                        </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
      </div>
    </div>
  );

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
        {/* 2. Breadcrumbs & Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-8">
            <nav className="flex items-center space-x-2 text-[10px] text-muted-foreground">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight size={10} />
                <span className="text-primary font-bold">{selectedCategory}</span>
            </nav>
            <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
            >
                <Filter size={14} />
                <span>Filters</span>
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* 3. Desktop Sidebar (Filters) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-32">
                    <FilterContent />
                </div>
            </aside>

            {/* 4. Main Content Area */}
            <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                            {selectedCategory === "All" ? "Explore Our Archive" : `${selectedCategory} Books`}
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{totalCount} Books Found</p>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2 text-muted-foreground">
                            <LayoutGrid size={16} className="text-primary cursor-pointer" />
                            <List size={16} className="cursor-pointer hover:text-primary transition-colors" />
                         </div>
                         <div className="h-6 w-[1px] bg-border hidden md:block" />
                         <div className="flex items-center space-x-3 px-4 py-2 bg-white border border-border rounded-xl shadow-sm">
                            <SlidersHorizontal size={14} className="text-muted-foreground" />
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-xs font-bold outline-none cursor-pointer min-w-[120px]"
                            >
                                <option value="relevance">By Relevance</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                         </div>
                    </div>
                </div>

                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 size={40} className="animate-spin text-primary/20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Updating Collection...</p>
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
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

                {filteredBooks.length > 0 && hasMoreBooks && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={loadMoreBooks}
                            disabled={isLoadingMore}
                            className="min-w-40 px-8 py-3.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isLoadingMore && <Loader2 size={14} className="animate-spin" />}
                            <span>{isLoadingMore ? "Loading" : "Load More"}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 5. Mobile Bottom Sheet Filter */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[100] p-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-8" />
              <FilterContent />
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
