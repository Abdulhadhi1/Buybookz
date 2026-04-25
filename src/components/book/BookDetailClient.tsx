"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Loader2, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/components/ui/ToastProvider";

interface BookDetailClientProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    description: string | null;
    image: string | null;
    stock: number;
    languages: string[];
    category: { name: string } | null;
  };
}

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(book.languages?.[0] || "");
  const [adding, setAdding] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(book, quantity, selectedLanguage);
      router.prefetch("/cart");
      router.push("/cart");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(book.id);

    if (result.requiresLogin) {
      showToast(result.message, "warning");
      return;
    }

    if (!result.ok) {
      showToast(result.message, "warning");
      return;
    }

    showToast(result.message, "success");
  };

  const originalPrice = book.price * 1.2;

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary relative">
      <Navbar />

      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="relative aspect-square w-full bg-[#F4F1EA] flex items-center justify-center p-12 overflow-hidden group rounded-[2rem]">
              <button
                onClick={handleToggleFavorite}
                className={`absolute right-4 top-4 z-10 p-3 rounded-full border shadow-md transition-all ${
                  isFavorite(book.id)
                    ? "bg-red-50 border-red-100 text-red-500"
                    : "bg-white/90 border-white text-foreground/30 hover:text-red-500"
                }`}
                aria-label="Toggle favorite"
              >
                <Heart size={18} fill={isFavorite(book.id) ? "currentColor" : "none"} />
              </button>
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  priority
                  className="object-contain p-8 transform group-hover:scale-105 transition-transform duration-1000 shadow-2xl"
                />
              ) : (
                <div className="text-9xl font-serif italic text-white/50">{book.title[0]}</div>
              )}

              <div className="absolute top-4 left-4 bg-[#D1B89C] text-white px-3 py-1 text-[10px] font-bold rounded-full">
                10% Off
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-[#F4F1EA] p-2 flex items-center justify-center border-2 border-[#D1B89C] rounded-2xl">
                <div className="relative w-full h-full">
                  {book.image && <Image src={book.image} alt={`${book.title} preview`} fill className="object-contain" />}
                </div>
              </div>
              <div className="w-24 h-24 bg-[#F4F1EA] p-2 flex items-center justify-center border border-border rounded-2xl">
                <div className="relative w-full h-full opacity-50 grayscale">
                  {book.image && <Image src={book.image} alt={`${book.title} alternate preview`} fill className="object-contain" />}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">{book.title}</h1>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" stroke="none" className="text-black" />
                  ))}
                </div>
                <span className="text-xs text-[#999999] font-medium">(1 customer review)</span>
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-[#BBBBBB] line-through text-2xl">Rs. {originalPrice.toFixed(2)}</span>
                <span className="text-3xl font-medium text-primary">Rs. {book.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[#666666] leading-relaxed text-base space-y-2">
              <p className={isDescriptionExpanded ? "" : "line-clamp-2"}>
                {book.description || "A thoughtfully selected title from the BuyBookz collection."}
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

            <div className="space-y-8 pt-4">
              {book.languages && book.languages.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#999999]">Choose Variation</span>
                  <div className="flex flex-wrap gap-2">
                    {book.languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => setSelectedLanguage(language)}
                        className={`px-6 py-2 border-2 text-xs font-bold transition-all ${
                          selectedLanguage === language
                            ? "border-[#2D1B14] bg-[#2D1B14] text-white"
                            : "border-border hover:border-[#D1B89C]"
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center border-2 border-border p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || book.stock === 0}
                  className="flex-grow py-5 bg-[#2D1B14] text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                  <span className="uppercase tracking-widest text-xs">{book.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>

              </div>
            </div>

            <div className="pt-8 space-y-2 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-[#999999] uppercase tracking-widest font-bold">
                <span>Category:</span>
                <span className="text-primary">{book.category?.name || "Fiction"}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#999999] uppercase tracking-widest font-bold">
                <span>Author:</span>
                <span className="text-primary">{book.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
