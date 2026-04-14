"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: <Home size={20} />, href: "/" },
    { label: "Publishers", icon: <BookOpen size={20} />, href: "/categories" },
    { label: "Search", icon: <Search size={20} />, href: "/shop" },
    { label: "Cart", icon: <ShoppingBag size={20} />, href: "/cart" },
    { label: "Account", icon: <User size={20} />, href: "/profile" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-border px-6 py-3 pb-8">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
                key={item.label} 
                href={item.href}
                className="relative flex flex-col items-center group"
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300 relative z-10",
                isActive ? "text-accent" : "text-foreground/40"
              )}>
                {item.icon}
              </div>
              
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest mt-1",
                isActive ? "text-accent" : "text-foreground/20"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent/5 rounded-3xl -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
