"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const desktopMenuItems = [
  { label: "New Releases", href: "/shop?sortBy=latest" },
  { label: "Special Offers", href: "/shop?discount=true" },
  { label: "POD", href: "/shop" },
  { label: "Out of Stock", href: "/shop?stock=false" },
];

const mobileMenuItems = [
  { label: "New Releases", href: "/shop?sortBy=latest" },
  { label: "Special Offers", href: "/shop?discount=true" },
  { label: "POD", href: "/shop" },
  { label: "Out of Stock", href: "/shop?stock=false" },
  { label: "My Account", href: "/profile" },
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if logged in (simple cookie check simulation)
    const checkAuth = async () => {
        try {
            const res = await fetch("/api/profile");
            setIsLoggedIn(res.ok);
        } catch (e) {
            setIsLoggedIn(false);
        }
    }
    checkAuth();
  }, []);

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
    router.push(`/shop?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    closeMenu();
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 px-4 sm:px-6 lg:px-12 py-3 sm:py-4",
        "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Bar: Logo, Menu, Action Buttons */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <Link href="/" prefetch className="flex items-center group select-none">
            <div className="flex items-center transition-all duration-500 hover:scale-105">
                <div className="relative w-10 h-10 mr-2">
                    <Image src="/favicon.ico" alt="Logo" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-[#2D2D2D] leading-none">BOOKS</span>
                    <span className="text-xl font-black text-red-600 leading-none flex items-center tracking-tight">
                        <span className="w-2 h-2 rounded-full bg-red-600 mr-1 animate-pulse"></span>
                        VIKATAN
                    </span>
                </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {desktopMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-bold text-[#4D4D4D] hover:text-red-600 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn ? (
                <Link href="/profile" target="_blank" className="text-[#4D4D4D] hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50">
                    <User size={22} />
                </Link>
            ) : (
                <Link 
                    href="/login" 
                    className="flex items-center space-x-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                >
                    <LogOut size={16} className="rotate-180" />
                    <span>Login</span>
                </Link>
            )}

            <Link href="/cart" className="relative p-2 text-[#4D4D4D] hover:text-red-600 transition-all">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline-block ml-1 text-sm font-bold">Cart</span>
            </Link>

            <button
              className="lg:hidden p-2 text-[#4D4D4D]"
              onClick={() => setIsOpen((current) => !current)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar Row (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-center max-w-2xl mx-auto">
            <div className="relative w-full flex items-center bg-[#F4F6F8] rounded-xl border border-[#E2E8F0] focus-within:border-red-300 focus-within:bg-white transition-all shadow-sm">
                <div className="flex items-center px-4 border-r border-[#E2E8F0] cursor-pointer group hover:text-red-600 transition-colors">
                    <span className="text-xs font-bold text-[#4D4D4D] group-hover:text-red-600">Books</span>
                    <ChevronDown size={14} className="ml-1 opacity-40 group-hover:opacity-100" />
                </div>
                <form onSubmit={handleSearch} className="flex-grow flex items-center">
                    <input
                        type="text"
                        placeholder="Books name"
                        className="w-full px-4 py-2.5 bg-transparent text-sm font-medium outline-none placeholder:text-[#94A3B8]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                    />
                    <button type="submit" className="px-5 py-2.5 text-[#64748B] hover:text-red-600 transition-all border-l border-border/10">
                        <Search size={20} />
                    </button>
                </form>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#E2E8F0] z-[100]"
                        >
                            <div className="p-2">
                                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Suggested Books</p>
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => {
                                            setSearchTerm("");
                                            setShowSuggestions(false);
                                            router.push(`/book/${suggestion.id}`);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] rounded-xl transition-colors flex items-center space-x-4"
                                    >
                                        <div className="w-10 h-14 bg-[#F1F5F9] rounded-lg overflow-hidden flex-shrink-0 relative shadow-sm">
                                            {suggestion.image && <Image src={suggestion.image} alt={suggestion.title} fill className="object-cover" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1E293B] line-clamp-1">{suggestion.title}</p>
                                            <p className="text-xs text-[#64748B] font-medium mt-0.5">by {suggestion.author}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
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
              className="fixed top-0 right-0 bottom-0 w-[84%] max-w-[340px] bg-white z-[80] p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center">
                  <span className="text-2xl font-black text-[#2D2D2D]">Buy</span>
                  <span className="text-2xl font-black text-red-600">Bookz</span>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-[#F1F5F9] rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="text-lg font-bold text-[#1E293B] hover:text-red-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t border-[#E2E8F0]">
                <a
                  href="https://wa.me/919677201727"
                  target="_blank"
                  className="flex items-center space-x-3 text-sm font-bold text-[#1E293B]"
                >
                  <MessageCircle size={18} className="text-green-500" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Internal icon for login button
function LogOut({ size, className }: { size: number; className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}

export default Navbar;
