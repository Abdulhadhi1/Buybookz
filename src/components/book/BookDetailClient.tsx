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
import { useToast } from "@/components/ui/ToastProvider";
import { Facebook, Instagram, Share2 } from "lucide-react";

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
      await addToCart(book, quantity, book.languages?.[0] || "Tamil");
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

  const { showToast } = useToast();

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'instagram') => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this amazing book: ${book.title} by ${book.author} at BuyBookz!`;
    
    if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
        navigator.clipboard.writeText(shareUrl);
        showToast("Link copied to clipboard!", "success");
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
                <div className="inline-block p-4 border border-border rounded-2xl bg-white shadow-sm w-full sm:w-auto">
                    <div className="flex items-baseline space-x-3">
                        <span className="text-2xl font-black">₹{book.price.toFixed(0)}</span>
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

                {/* Mobile Share */}
                <div className="pt-6 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share this Treasure</p>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => handleShare('whatsapp')} className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>
                        <button onClick={() => handleShare('facebook')} className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <Facebook size={24} fill="currentColor" />
                        </button>
                        <button onClick={() => handleShare('instagram')} className="w-12 h-12 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <Instagram size={24} />
                        </button>
                    </div>
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

                    {/* Desktop Share */}
                    <div className="pt-6 space-y-4 border-t border-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share with Friends</p>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => handleShare('whatsapp')}
                                className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all group"
                                title="Share on WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </button>
                            <button 
                                onClick={() => handleShare('facebook')}
                                className="w-10 h-10 bg-[#1877F2]/10 text-[#1877F2] rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all"
                                title="Share on Facebook"
                            >
                                <Facebook size={20} fill="currentColor" />
                            </button>
                            <button 
                                onClick={() => handleShare('instagram')}
                                className="w-10 h-10 bg-gradient-to-tr from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 text-[#DD2A7B] rounded-xl flex items-center justify-center hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all"
                                title="Copy Link for Instagram"
                            >
                                <Instagram size={20} />
                            </button>
                            <button 
                                onClick={() => handleShare('instagram')}
                                className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all"
                                title="More Options"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>
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
