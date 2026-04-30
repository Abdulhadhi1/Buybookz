"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import RankedBookCard from "@/components/home/RankedBookCard";

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    description: string | null;
    image: string | null;
    stock: number;
    languages: string[];
    category: { name: string } | null;
}

interface BookDetailClientProps {
  book: Book;
  relatedBooks: any[];
}

export default function BookDetailClient({ book, relatedBooks }: BookDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const originalPrice = book.price * 1.3;
  const savings = originalPrice - book.price;
  const savingsPercent = 30;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(book, quantity, book.languages?.[0] || "English");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    try {
      await addToCart(book, quantity, book.languages?.[0] || "English");
      router.push("/checkout");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1E293B]">
      <Navbar />

      <div className="pt-24 lg:pt-28 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] text-muted-foreground mb-6 lg:mb-10 overflow-hidden whitespace-nowrap px-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={10} />
            <Link href={`/shop?category=${book.category?.name}`} className="hover:text-primary">{book.category?.name}</Link>
            <ChevronRight size={10} />
            <span className="text-primary font-bold truncate">{book.title}</span>
        </nav>

        {/* Layout: Sequential for Mobile, Three-Column for Desktop */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* 1. Book Image - Large as per screenshot */}
          <div className="w-full lg:w-[30%] flex-shrink-0 px-2 sm:px-0">
            <div className="lg:sticky lg:top-28">
                <div className="relative aspect-[3/3.8] w-full max-w-[400px] mx-auto bg-transparent rounded-2xl overflow-hidden shadow-lg border border-border/5">
                {book.image ? (
                    <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    priority
                    className="object-contain"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-serif text-[#CBD5E1]">{book.title[0]}</div>
                )}
                </div>
            </div>
          </div>

          {/* 2. Details Column */}
          <div className="flex-grow w-full lg:w-[40%] space-y-6 lg:space-y-10 px-4 sm:px-0">
            <div className="space-y-2 lg:space-y-4">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-sans font-bold text-[#1E293B] leading-tight">{book.title}</h1>
              <p className="text-base lg:text-lg font-bold text-muted-foreground">Author : {book.author}</p>
            </div>

            {/* Mobile-Only Purchase Section */}
            <div className="lg:hidden space-y-6">
                <div className="inline-block p-4 border-2 border-red-500 rounded-2xl bg-white shadow-sm w-full sm:w-auto">
                    <div className="flex items-baseline space-x-3">
                        <span className="text-2xl font-black">₹{book.price.toFixed(0)}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toFixed(0)}</span>
                        <span className="text-xs font-bold text-green-600">{savingsPercent}% off</span>
                    </div>
                </div>

                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-black text-[#10B981]">In Stock</span>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quantity</span>
                        <div className="flex items-center border border-border rounded-xl p-0.5">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={12} /></button>
                            <span className="w-6 text-center text-sm font-black">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-red-500"><Plus size={12} /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={handleAddToCart}
                        disabled={adding || book.stock === 0}
                        className="w-full py-4 border-2 border-red-500 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-red-50"
                    >
                        {adding ? <Loader2 size={16} className="animate-spin" /> : <span>Add to Cart</span>}
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        disabled={adding || book.stock === 0}
                        className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-100"
                    >
                        Buy Now
                    </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                    <TrustItem icon={<Truck size={20} />} text="புத்தகம் 3 - 7 நாட்களில் அனுப்பி வைக்கப்படும்." />
                    <TrustItem icon={<RotateCcw size={20} />} text="15 Days Replacement Policy" />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4 pt-4 lg:pt-0">
               <div className="flex items-center space-x-2">
                    <span className="px-4 py-1.5 bg-[#4A4A4A] text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Description</span>
               </div>
               <div className="text-[15px] leading-relaxed text-[#4A4A4A] space-y-4">
                    <p className={isDescriptionExpanded ? "" : "line-clamp-4 lg:line-clamp-6"}>
                        {book.description || "A masterfully crafted narrative that resonates with the deep traditions and cultural richness of its origins."}
                    </p>
                    <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center space-x-1"
                    >
                        <span>{isDescriptionExpanded ? "Read Less" : "Read More"}</span>
                        <ChevronDown size={12} className={isDescriptionExpanded ? "rotate-180" : ""} />
                    </button>
               </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6 pt-10 border-t border-border">
                <h3 className="text-lg font-serif font-black text-[#1E293B]">Product details</h3>
                <div className="space-y-4">
                    <DetailItem label="Generic Name" value="Book" />
                    <DetailItem label="Book code" value={book.id.slice(0, 8)} />
                    <DetailItem label="Language" value={book.languages?.[0] || "Tamil"} />
                    <DetailItem label="Country of Origin" value="India" />
                    <DetailItem label="Contact us" value="bybookzbookz@gmail.com" isLink />
                </div>
            </div>
          </div>

          {/* 3. Desktop Sidebar */}
          <div className="hidden lg:block lg:w-[30%]">
            <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-8">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <span className="text-lg font-black text-[#1E293B]">Details</span>
                        <span className="text-sm font-black text-[#10B981]">In Stock</span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-4xl font-black text-[#1E293B]">₹{book.price.toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">M.R.P: <span className="line-through">₹{originalPrice.toFixed(0)}</span></p>
                        <p className="text-xs font-bold text-red-500">Save: ₹{savings.toFixed(0)} ({savingsPercent}%)</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quantity</span>
                        <div className="flex items-center border border-border rounded-xl p-1">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm font-black">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-red-500"><Plus size={14} /></button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={handleAddToCart}
                            disabled={adding || book.stock === 0}
                            className="w-full py-4 border-2 border-primary text-primary rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary/5"
                        >
                            {adding ? <Loader2 size={16} className="animate-spin" /> : <span>Add to Cart</span>}
                        </button>
                        <button 
                             onClick={handleBuyNow}
                             disabled={adding || book.stock === 0}
                             className="w-full py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:opacity-90 shadow-xl shadow-primary/10"
                        >
                            Buy Now
                        </button>
                        <p className="text-center text-[10px] text-muted-foreground font-medium">+ Additional Delivery charges will apply</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                        <TrustItem icon={<Truck size={20} />} text="புத்தகம் 3 - 7 நாட்களில் அனுப்பி வைக்கப்படும்." />
                        <TrustItem icon={<RotateCcw size={20} />} text="15 Days Replacement Policy" />
                        <TrustItem icon={<ShieldCheck size={20} />} text="நீங்கள் புத்தகம் வாங்கும்போது பாதுகாப்பான பரிவர்த்தனை" />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
            <div className="mt-20 lg:mt-32 space-y-8 lg:space-y-12 px-2 lg:px-0">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-xl lg:text-2xl font-serif font-black text-[#1E293B]">Books you may like</h2>
                    <Link href="/shop" className="group flex items-center space-x-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                        <span>View all</span>
                        <div className="bg-green-600 text-white p-1 rounded-full group-hover:scale-110 transition-transform">
                            <ChevronRight size={14} />
                        </div>
                    </Link>
                </div>
                <div className="overflow-x-auto no-scrollbar flex space-x-6 lg:space-x-8 pb-8">
                    {relatedBooks.map((relatedBook) => (
                        <div key={relatedBook.id} className="w-[160px] lg:w-[180px] flex-shrink-0">
                            <RankedBookCard {...relatedBook} />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

function DetailItem({ label, value, isLink }: { label: string, value: string, isLink?: boolean }) {
    return (
        <div className="flex items-start text-xs">
            <span className="w-32 font-bold text-[#1E293B] flex-shrink-0">{label} :</span>
            {isLink ? (
                <a href={`mailto:${value}`} className="text-primary font-bold hover:underline truncate">{value}</a>
            ) : (
                <span className="text-[#4A4A4A] font-medium">{value}</span>
            )}
        </div>
    );
}

function TrustItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-start space-x-4 text-[#10B981]">
            <div className="mt-0.5">{icon}</div>
            <p className="text-[11px] font-bold leading-relaxed text-muted-foreground">{text}</p>
        </div>
    );
}
