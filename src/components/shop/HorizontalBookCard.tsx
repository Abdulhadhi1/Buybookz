"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HorizontalBookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string | null;
  category?: { name?: string | null } | string | null;
}

interface FavoriteItem {
  id: string;
}

const HorizontalBookCard = ({ id, title, author, price, image, category }: HorizontalBookCardProps) => {
  const categoryName = typeof category === "object" ? category?.name : category;
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data: FavoriteItem[] = await res.json();
          setIsFavorite(data.some((favorite) => favorite.id === id));
        }
      } catch {}
    };

    checkFavorite();
  }, [id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${window.location.pathname}`);
      } else if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      }
    } catch {}
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-white/5 rounded-2xl p-4 md:p-6 w-[280px] md:w-[480px] flex-shrink-0 snap-start border border-border/10 transition-all duration-500 hover:shadow-2xl relative"
    >
      <button
        onClick={toggleFavorite}
        className={`absolute top-6 right-6 z-10 p-2 rounded-full border transition-all ${
          isFavorite
            ? "bg-red-50 border-red-100 text-red-500"
            : "bg-white/80 border-border text-foreground/20 hover:text-red-500 hover:border-red-100"
        }`}
      >
        <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <Link href={`/book/${id}`} prefetch className="flex space-x-4 md:space-x-6 h-32 md:h-40">
        <div className="relative w-24 md:w-32 h-full bg-secondary rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif italic text-primary/10">{title[0]}</div>
          )}
        </div>

        <div className="flex flex-col justify-between py-1 flex-grow overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-accent px-2 py-0.5 rounded-full bg-accent/10 mb-1 md:mb-2">
              {categoryName || "Archive"}
            </span>
            <h3 className="text-sm md:text-xl font-serif font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-[10px] md:text-xs text-foreground/40 font-medium italic">by {author}</p>
          </div>

          <div className="flex items-center justify-between border-t border-border/20 pt-2 md:pt-3">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-foreground/20">Price</span>
              <span className="text-sm md:text-md font-bold text-foreground">{`Rs. ${price.toFixed(2)}`}</span>
            </div>

            <div className="h-8 w-8 md:h-10 md:w-10 bg-secondary group-hover:bg-primary group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HorizontalBookCard;
