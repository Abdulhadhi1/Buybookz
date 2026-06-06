"use client";

import { useState, useEffect, useTransition, useRef } from "react";
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
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("categories");
  const [books, setBooks] = useState(initialBooks);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(serverTotalCount);
  const [hasMoreBooks, setHasMoreBooks] = useState(initialBooks.length < serverTotalCount);
  const [isPending, startTransition] = useTransition();

  // Sync state with URL
  const lastCategoryRef = useRef(categoryFromUrl);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync state with URL and initial books from server
  useEffect(() => {
    const currentCategory = searchParams.get("category") || "All";
    setSelectedCategory(currentCategory);
    
    // Only reset books if the CATEGORY changed (navigation/filter click)
    // Avoid resetting if we just changed sort/inStock which triggered initialBooks update
    if (lastCategoryRef.current !== currentCategory) {
        setBooks(initialBooks);
        setTotalCount(serverTotalCount);
        setHasMoreBooks(initialBooks.length < serverTotalCount);
        setPage(1);
        lastCategoryRef.current = currentCategory;
    }
  }, [initialBooks, serverTotalCount, searchParams]);

  // Handle local filter changes (sort and stock)
  useEffect(() => {
    const fetchFiltered = async () => {
      // Avoid redundant initial fetch
      if (books.length === initialBooks.length && sortBy === "relevance" && !showInStockOnly) return;
      
      setIsLoadingMore(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", "12");
        params.set("skip", "0");
        setPage(1); // Reset page on filter change
        params.set("sort", sortBy);
        params.set("inStock", String(showInStockOnly));
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        
        // Update URL to keep state in sync
        router.push(`/shop?${params.toString()}`, { scroll: false });

        const res = await fetch(`/api/books?${params.toString()}`);
        const data = await res.json();
        const nextBooks = data.books || [];
        setBooks(nextBooks);
        setTotalCount(data.totalCount || 0);
        setHasMoreBooks(nextBooks.length < (data.totalCount || 0));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingMore(false);
      }
    };

    fetchFiltered();
  }, [sortBy, showInStockOnly]);

  // Infinite scroll auto loading on scroll using IntersectionObserver
  useEffect(() => {
    if (!hasMoreBooks || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreBooks();
        }
      },
      { rootMargin: "300px" } // Load more 300px before reaching the bottom
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMoreBooks, isLoadingMore, books.length]);

  const handleCategorySelect = (catName: string) => {
    startTransition(() => {
        setSelectedCategory(catName);
        const params = new URLSearchParams(searchParams.toString());
        params.set("skip", "0"); // Reset skip on category change
        if (catName === "All") {
          params.delete("category");
        } else {
          params.set("category", catName);
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setIsMobileFilterOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const loadMoreBooks = async () => {
    if (isLoadingMore || !hasMoreBooks) return;
    setIsLoadingMore(true);

    try {
      const currentCount = books.length;
      const params = new URLSearchParams();
      params.set("limit", "12");
      params.set("skip", String(currentCount));
      params.set("sort", sortBy);
      params.set("inStock", String(showInStockOnly));
      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more books");

      const data = await res.json();
      const nextBooks: ShopBook[] = data.books || [];
      const nextTotal: number = data.totalCount ?? totalCount;

      if (nextBooks.length === 0) {
        setHasMoreBooks(false);
        return;
      }

      setBooks((prev) => {
        const existingIds = new Set(prev.map(b => b.id));
        const unique = nextBooks.filter(b => !existingIds.has(b.id));
        const combined = [...prev, ...unique];
        
        // Update hasMore based on the NEW combined length
        setHasMoreBooks(combined.length < nextTotal);
        return combined;
      });
      setTotalCount(nextTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredBooks = books; // Trust the server-side filtering for accuracy and performance

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 1. Horizontal Category Bar (Top) */}
      <div className="pt-28 sm:pt-36 bg-white border-b border-border shadow-sm overflow-hidden sticky top-0 z-[50]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 overflow-x-auto no-scrollbar flex items-center space-x-8 whitespace-nowrap">
            {["All", ...initialCategories.map(c => c.name)].map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${selectedCategory === cat ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground hover:text-primary'}`}
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
                {hasMoreBooks && (
                    <div ref={sentinelRef} className="flex justify-center mt-12 py-8">
                        <Loader2 size={24} className="animate-spin text-primary" />
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
              <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black uppercase tracking-widest text-primary">Filters</h2>
                      <button 
                          onClick={() => {setSelectedCategory("All"); setShowInStockOnly(false); setIsMobileFilterOpen(false); router.push("/shop")}}
                          className="text-[10px] font-bold text-accent hover:underline"
                      >
                          Clear all
                      </button>
                  </div>

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
