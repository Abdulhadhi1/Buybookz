"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const desktopMenuItems = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileMenuItems = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms-and-conditions" },
  { label: "Privacy", href: "/privacy-policy" },
];

interface SearchSuggestion {
  id: string;
  title: string;
  author: string;
  image?: string;
}

const Navbar = () => {
  const { cartCount } = useCart();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 1) {
        const fetchSuggestions = async () => {
          try {
            const res = await fetch(`/api/books?query=${encodeURIComponent(searchTerm)}&limit=5`);
            const books: SearchSuggestion[] = await res.json();
            setSuggestions(books);
            setShowSuggestions(true);
            books.forEach((book: { id: string }) => {
              router.prefetch(`/book/${book.id}`);
            });
          } catch (err) {
            console.error(err);
          }
        };

        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [router, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }

    const query = searchTerm.trim();
    router.prefetch(`/shop?query=${encodeURIComponent(query)}`);
    router.push(`/shop?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    closeMenu();
  };

  const warmMenuRoutes = () => {
    [...desktopMenuItems, ...mobileMenuItems].forEach((item) => router.prefetch(item.href));
    router.prefetch("/profile");
    router.prefetch("/cart");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-4 sm:px-6 lg:px-12 py-6 sm:py-8",
        isScrolled ? "bg-white/90 backdrop-blur-xl py-4 sm:py-5 border-b border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" prefetch className="flex items-center group select-none">
          <div className="flex items-baseline font-serif tracking-tighter transition-all duration-500 group-hover:scale-110">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary drop-shadow-sm select-none">Buy</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extralight italic text-accent ml-1 transition-all duration-500 group-hover:ml-2">Bookz</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-12">
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
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onMouseEnter={() => router.prefetch(`/book/${suggestion.id}`)}
                        onClick={() => {
                          setSearchTerm("");
                          setShowSuggestions(false);
                          router.push(`/book/${suggestion.id}`);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-secondary rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <div className="w-8 h-10 bg-secondary rounded overflow-hidden flex-shrink-0 relative">
                          {suggestion.image && <Image src={suggestion.image} alt={suggestion.title} fill className="object-cover" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold line-clamp-1">{suggestion.title}</p>
                          <p className="text-[8px] text-foreground/40 font-medium">by {suggestion.author}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        router.push(`/shop?query=${encodeURIComponent(searchTerm.trim())}`);
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
            {desktopMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                className="group relative text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          <Link href="/profile" prefetch className="hidden sm:block text-foreground/60 hover:text-foreground transition-colors">
            <User size={18} />
          </Link>

          <Link href="/cart" prefetch className="relative group p-2 text-foreground/60 hover:text-foreground transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => {
              warmMenuRoutes();
              setIsOpen((current) => !current);
            }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[84%] max-w-[340px] bg-white z-[80] p-8 sm:p-10 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-baseline font-serif tracking-tight">
                  <span className="text-3xl font-black text-primary">Buy</span>
                  <span className="text-3xl font-light italic text-accent -ml-0.5">Bookz</span>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-8 rounded-3xl border border-border bg-secondary/20 p-4">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Search size={14} className="absolute left-4 text-primary/40" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full rounded-full border border-transparent bg-white pl-10 pr-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-accent/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>

              <div className="flex flex-col space-y-5">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch
                    onClick={closeMenu}
                    className="text-2xl font-serif font-bold text-primary hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-6 pt-10 border-t border-border">
                <Link href="/profile" prefetch className="flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-primary">
                  <User size={16} />
                  <span>My Account</span>
                </Link>
                <a
                  href="https://wa.me/919677201727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-primary"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Support</span>
                </a>
                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest italic leading-relaxed">
                  (c) 2026 BuyBookz Archives.
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
