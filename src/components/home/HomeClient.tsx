"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HorizontalBookCard from "@/components/shop/HorizontalBookCard";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BookSummary {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  categoryId?: string | null;
  category?: { name?: string | null } | string | null;
}

interface CategoryWithBooks {
  id: string;
  name: string;
  books: BookSummary[];
}

interface HomeClientProps {
  categories: CategoryWithBooks[];
  recentBooks: BookSummary[];
  uncategorizedBooks: BookSummary[];
}

export default function HomeClient({ categories, recentBooks, uncategorizedBooks }: HomeClientProps) {
  const displayCategories = categories.filter((cat) => cat.books.length > 0)
    .sort((a, b) => {
      if (a.name.toLowerCase() === "novel") return -1;
      if (b.name.toLowerCase() === "novel") return 1;
      return 0;
    });

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-accent/30">
      <Navbar />

      {/* Hero Section - Removed Banners */}
      <div className="pt-24 lg:pt-32"></div>

      {/* Main Sections */}
      <div className="space-y-4 pb-12 relative mt-4">
        
        {/* New Arrivals Section - Ensuring latest books reflect immediately */}
        {recentBooks.length > 0 && (
          <section className="relative">
            <div className="px-6 lg:px-12 mb-2">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">New Arrivals</h2>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest rounded-full border border-accent/20">Latest</span>
                </div>
                <Link 
                  href="/shop?sortBy=latest"
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>View All</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x pb-4 scroll-px-6 lg:scroll-px-12">
                {recentBooks.map((book) => (
                  <div key={`recent-${book.id}`} className="w-[300px] md:w-[450px] flex-shrink-0 snap-start">
                    <HorizontalBookCard {...book} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Sections */}
        {displayCategories.map((cat) => {
          return (
            <section key={cat.id} className="relative">
              <div className="px-6 lg:px-12 mb-2">
                <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-1">
                  <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">{cat.name}</h2>
                  <Link 
                    href={`/shop?category=${cat.name}`}
                    className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                  >
                    <span>View All</span>
                    <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Books Display */}
              <div className="relative">
                <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x pb-4 scroll-px-6 lg:scroll-px-12">
                  {cat.books.map((book) => (
                    <div key={`${cat.id}-${book.id}`} className="w-[300px] md:w-[450px] flex-shrink-0 snap-start">
                      <HorizontalBookCard {...book} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* Uncategorized Section */}
        {uncategorizedBooks.length > 0 && (
          <section className="relative">
            <div className="px-6 lg:px-12 mb-2">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-1">
                <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">Curated Archive</h2>
                <Link 
                  href="/shop"
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>Explore More</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 snap-x pb-4 scroll-px-6 lg:scroll-px-12">
                {uncategorizedBooks.map((book) => (
                  <div key={`uncat-${book.id}`} className="w-[300px] md:w-[450px] flex-shrink-0 snap-start">
                    <HorizontalBookCard {...book} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
