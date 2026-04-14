"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: <Home size={22} />, href: "/" },
    { label: "Publishers", icon: <BookOpen size={22} />, href: "/categories" },
    { label: "Search", icon: <Search size={22} />, href: "/shop" },
    { label: "Cart", icon: <ShoppingBag size={22} />, href: "/cart" },
    { label: "Account", icon: <User size={22} />, href: "/profile" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 border-t border-border px-4 py-3 pb-8 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
                key={item.label} 
                href={item.href}
                className="relative flex flex-col items-center flex-1 py-1"
                prefetch
            >
              <div className={cn(
                "transition-all duration-200",
                isActive ? "text-accent scale-110" : "text-foreground/30 hover:text-foreground/60"
              )}>
                {item.icon}
              </div>
              
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.2em] mt-1.5 transition-all duration-200",
                isActive ? "text-accent" : "text-foreground/20"
              )}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
