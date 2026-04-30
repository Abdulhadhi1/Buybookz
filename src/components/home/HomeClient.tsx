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
  categories: CategoryWithBooks[];
  recentBooks: BookSummary[];
  uncategorizedBooks: BookSummary[];
}

export default function HomeClient({ categories, recentBooks, uncategorizedBooks }: HomeClientProps) {
  const displayCategories = categories.filter((cat) => cat.books.length > 0);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-accent/30">
      <Navbar />

      {/* Hero Spacing - Reduced gap */}
      <div className="pt-24 lg:pt-28"></div>

      {/* Circular Categories */}
      <HomeCategoryList categories={categories} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B]">BuyBookz: #1 Online Bookstore</h1>
      </div>

      <div className="space-y-12 pb-24 relative mt-8">
        {/* New Arrivals / Best Selling Section */}
        {recentBooks.length > 0 && (
          <section className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-8">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl md:text-3xl font-serif font-black leading-none tracking-tight capitalize">Best Selling</h2>
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
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recentBooks.slice(0, 6).map((book, index) => (
                    <RankedBookCard key={book.id} {...book} rank={index + 1} />
                ))}
            </div>
          </section>
        )}

        {/* Categories Sections */}
        {displayCategories.map((cat) => (
          <section key={cat.id} className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-8">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <h2 className="text-2xl md:text-3xl font-serif font-black leading-none tracking-tight capitalize">{cat.name} Collections</h2>
                <Link 
                  href={`/shop?category=${cat.name}`}
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>View All</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {cat.books.slice(0, 6).map((book) => (
                    <RankedBookCard key={book.id} {...book} />
                ))}
            </div>
          </section>
        ))}

        {/* Uncategorized / Best Deal Section */}
        {uncategorizedBooks.length > 0 && (
          <section className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-8">
              <div className="flex items-end justify-between gap-4 border-b border-border/10 pb-2">
                <h2 className="text-2xl md:text-3xl font-serif font-black leading-none tracking-tight capitalize">Best Deal of Month</h2>
                <Link 
                  href="/shop?discount=true"
                  className="group flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all whitespace-nowrap"
                >
                  <span>Explore More</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {uncategorizedBooks.slice(0, 6).map((book) => (
                    <RankedBookCard key={book.id} {...book} />
                ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
