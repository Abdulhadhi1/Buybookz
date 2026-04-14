"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Loader2, Minus, Plus, ShoppingCart, Heart, Share2, ArrowLeft, ChevronUp } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [adding, setAdding] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const router = useRouter();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        setBook(data);
        if (data.languages?.length > 0) setSelectedLanguage(data.languages[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ bookId: id, quantity, language: selectedLanguage }),
      });
      if (res.status === 401) {
        router.push("/login");
      } else if (res.ok) {
        await refreshCartCount();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF5]">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!book) return null;

  const originalPrice = book.price * 1.2;

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary relative">
      <Navbar />



      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Visuals Column */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full bg-[#F4F1EA] flex items-center justify-center p-12 overflow-hidden group">
                {book.image ? (
                    <Image 
                        src={book.image} 
                        alt={book.title} 
                        fill 
                        className="object-contain p-8 transform group-hover:scale-105 transition-transform duration-1000 shadow-2xl" 
                    />
                ) : (
                    <div className="text-9xl font-serif italic text-white/50">{book.title[0]}</div>
                )}
                
                <div className="absolute top-4 left-4 bg-[#D1B89C] text-white px-3 py-1 text-[10px] font-bold">
                    -10%
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-4">
                <div className="w-24 h-24 bg-[#F4F1EA] p-2 flex items-center justify-center border-2 border-[#D1B89C]">
                     <div className="relative w-full h-full">
                        {book.image && <Image src={book.image} alt="thumb" fill className="object-contain" />}
                     </div>
                </div>
                <div className="w-24 h-24 bg-[#F4F1EA] p-2 flex items-center justify-center border border-border">
                     <div className="relative w-full h-full opacity-50 grayscale">
                        {book.image && <Image src={book.image} alt="thumb" fill className="object-contain" />}
                     </div>
                </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">{book.title}</h1>
                
                {/* Stars and Review */}
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" stroke="none" className="text-black" />)}
                    </div>
                    <span className="text-xs text-[#999999] font-medium">(1 customer review)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline space-x-4">
                    <span className="text-[#BBBBBB] line-through text-2xl">₹{originalPrice.toFixed(2)}</span>
                    <span className="text-3xl font-medium text-primary">₹{book.price.toFixed(2)}</span>
                </div>
            </div>

            {/* Description */}
            <div className="text-[#666666] leading-relaxed text-base space-y-2">
                <p className={isDescriptionExpanded ? "" : "line-clamp-2"}>
                    {book.description || "A thoughtful literary novel told from the perspective of an artificial companion observing human emotion and hope."}
                </p>
                {book.description && book.description.length > 100 && (
                    <button 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                    >
                        {isDescriptionExpanded ? "Read Less" : "Read More"}
                    </button>
                )}
            </div>

            {/* Interactive Section */}
            <div className="space-y-8 pt-4">
                {/* Language / Variation */}
                {book.languages && book.languages.length > 0 && (
                    <div className="space-y-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#999999]">Choose Variation</span>
                        <div className="flex flex-wrap gap-2">
                            {book.languages.map((lang: string) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`px-6 py-2 border-2 text-xs font-bold transition-all ${
                                        selectedLanguage === lang 
                                        ? "border-[#2D1B14] bg-[#2D1B14] text-white" 
                                        : "border-border hover:border-[#D1B89C]"
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Qty and Add */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center border-2 border-border p-1">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 hover:text-accent transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-bold">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 hover:text-accent transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={adding || book.stock === 0}
                        className="flex-grow py-5 bg-[#2D1B14] text-white font-bold hover:bg-black transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                        {adding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                        <span className="uppercase tracking-widest text-xs">{book.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                    </button>
                </div>
            </div>

            {/* Extra Info */}
            <div className="pt-8 space-y-2 border-t border-border">
                <div className="flex items-center space-x-2 text-xs text-[#999999] uppercase tracking-widest font-bold">
                    <span>Category:</span>
                    <span className="text-primary hover:text-accent cursor-pointer transition-colors">{book.category?.name || "Fiction"}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
