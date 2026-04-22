"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, Heart, Book, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { cartCount } = useCart();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 1) {
        const fetchSuggestions = async () => {
          try {
            const res = await fetch(`/api/books?query=${encodeURIComponent(searchTerm)}&limit=5`);
            const books = await res.json();
            setSuggestions(books);
            setShowSuggestions(true);
          } catch (err) {
            console.error(err);
          }
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?query=${searchTerm}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 lg:px-12 py-8",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl py-5 border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center group select-none"
        >
          <div className="flex items-baseline font-serif tracking-tighter transition-all duration-500 group-hover:scale-110">
            <span className="text-4xl lg:text-5xl font-black text-primary drop-shadow-sm select-none">Buy</span>
            <span className="text-4xl lg:text-5xl font-extralight italic text-accent ml-1 transition-all duration-500 group-hover:ml-2">Bookz</span>
            <span className="text-5xl lg:text-6xl font-black text-accent ml-0.5">.</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-12">
          {/* Advanced Search in Nav */}
          <div className="relative group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search size={14} className="absolute left-4 text-primary/40" />
              <input 
                type="text" 
                placeholder="Search the archives..." 
                className="pl-10 pr-4 py-2 bg-secondary/50 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none border border-transparent focus:border-accent/30 focus:bg-white transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
              />
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-border z-[100]"
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-accent/50">Suggestions</p>
                    {suggestions.map((s) => (
                      <button 
                        key={s.id}
                        onClick={() => {
                          setSearchTerm("");
                          router.push(`/book/${s.id}`);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-secondary rounded-lg transition-colors flex items-center space-x-3"
                      >
                         <div className="w-8 h-10 bg-secondary rounded overflow-hidden flex-shrink-0 relative">
                            {s.image && <Image src={s.image} alt={s.title} fill className="object-cover" />}
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-[10px] font-bold line-clamp-1">{s.title}</p>
                            <p className="text-[8px] text-foreground/40 font-medium">by {s.author}</p>
                         </div>
                      </button>
                    ))}
                    <button 
                      onClick={() => {
                        router.push(`/shop?query=${searchTerm}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full mt-2 py-2 px-3 border-t border-border text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/5 transition-colors text-center"
                    >
                      Show All Collections
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-12">
            {["Shop", "Favorites", "About", "Contact"].map((item) => (
              <Link 
                href={`/${item.toLowerCase()}`}
                className="group relative text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
              >
                <span>{item}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
           <Link href="/profile" className="hidden sm:block text-foreground/60 hover:text-foreground transition-colors">
            <User size={18} />
          </Link>
          
          <Link href="/cart" className="relative group p-2 text-foreground/60 hover:text-foreground transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button 
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm" 
            />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[80] p-10 flex flex-col shadow-2xl"
            >
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-baseline font-serif tracking-tight">
                        <span className="text-3xl font-black text-primary">Buy</span>
                        <span className="text-3xl font-light italic text-accent -ml-0.5">Bookz</span>
                        <span className="text-4xl font-black text-accent ml-0.5">.</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="flex flex-col space-y-6">
                    {["Shop", "Favorites", "About", "Contact"].map((item) => (
                      <Link 
                        key={item}
                        href={`/${item.toLowerCase()}`} 
                        onClick={() => setIsOpen(false)} 
                        className="text-2xl font-serif font-bold text-primary hover:text-accent transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                </div>
                
                <div className="mt-auto space-y-6 pt-10 border-t border-border">
                  <Link href="/profile" className="flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-primary">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest italic leading-relaxed">
                    © 2024 BuyBookz Archives.
                  </p>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
