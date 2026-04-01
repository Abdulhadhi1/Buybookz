"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BookCard from "@/components/shop/BookCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <Hero />

      {/* Featured Books Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <span className="text-accent font-bold tracking-widest text-xs uppercase">Curated Selection</span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary">Featured Books</h2>
            <p className="text-muted-foreground max-w-md">
                Handpicked by our editors, these titles represent the best of modern literature.
            </p>
          </div>
          <button className="text-sm font-bold tracking-widest uppercase pb-1 border-b-2 border-accent hover:text-accent transition-colors">
            View All Collection
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 bg-secondary/20 rounded-[3rem] border border-dashed border-border lg:col-span-4">
                <p className="font-serif italic text-xl opacity-50">No books found in the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </section>

      {/* Categories / Newsletter placeholder */}
      <section className="bg-primary text-primary-foreground py-24 px-6 lg:px-12 text-center">
         <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-serif font-bold">Join Our Book Community</h2>
            <p className="text-primary-foreground/70 text-lg">
                Stay updated with new arrivals, exclusive offers, and literary events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-accent transition-colors text-white"
                />
                <button className="px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-colors shadow-xl">
                    Subscribe
                </button>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
