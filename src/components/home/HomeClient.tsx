"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeCategoryList from "@/components/home/HomeCategoryList";
import RankedBookCard from "@/components/home/RankedBookCard";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BookSummary {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
}

interface CategoryWithBooks {
  id: string;
  name: string;
  books: BookSummary[];
}

interface HomeClientProps {
  categories: any[];
  featuredCategories: CategoryWithBooks[];
  recentBooks: BookSummary[];
  uncategorizedBooks: BookSummary[];
}

export default function HomeClient({ categories, featuredCategories, recentBooks, uncategorizedBooks }: HomeClientProps) {
  const displayCategories = featuredCategories;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-accent/30">
      <Navbar />

      {/* Hero Spacing - Clean */}
      <div className="pt-24 lg:pt-28"></div>

      {/* Circular Categories - Scrollable */}
      <HomeCategoryList categories={categories} />

      <div className="space-y-4 pb-24 relative mt-8">
        {/* New Arrivals / Best Selling Section - Smooth Horizontal Scroll */}
        {recentBooks.length > 0 && (
          <section className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">Best Selling</h2>
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
            
            <div className="overflow-x-auto no-scrollbar pb-8 flex space-x-6 px-6 lg:px-12 snap-x scroll-smooth">
                {recentBooks.map((book, index) => (
                    <div key={book.id} className="w-[180px] sm:w-[220px] flex-shrink-0 snap-start">
                        <RankedBookCard {...book} rank={index + 1} />
                    </div>
                ))}
            </div>
          </section>
        )}

        {/* Categories Sections - Smooth Horizontal Scroll */}
        {displayCategories.map((cat) => (
          <section key={cat.id} className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">{cat.name} Collections</h2>
                <Link 
                  href={`/shop?category=${cat.name}`}
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>View All</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar pb-8 flex space-x-6 px-6 lg:px-12 snap-x scroll-smooth">
                {cat.books.map((book) => (
                    <div key={book.id} className="w-[180px] sm:w-[220px] flex-shrink-0 snap-start">
                        <RankedBookCard {...book} />
                    </div>
                ))}
            </div>
          </section>
        ))}

        {/* Uncategorized / Best Deal Section - Smooth Horizontal Scroll */}
        {uncategorizedBooks.length > 0 && (
          <section className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <h2 className="text-xl md:text-2xl font-serif font-black leading-none tracking-tight capitalize">Best Deal of Month</h2>
                <Link 
                  href="/shop?discount=true"
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>Explore More</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar pb-8 flex space-x-6 px-6 lg:px-12 snap-x scroll-smooth">
                {uncategorizedBooks.map((book) => (
                    <div key={book.id} className="w-[180px] sm:w-[220px] flex-shrink-0 snap-start">
                        <RankedBookCard {...book} />
                    </div>
                ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
