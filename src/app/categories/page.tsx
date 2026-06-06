import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { books: true }
      },
      books: {
        take: 1,
        select: { image: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary mb-4 tracking-tight">All Collections</h1>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Explore our entire library of curated categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const latestImage = cat.books[0]?.image;
            
            return (
              <Link 
                key={cat.id} 
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center space-y-4 p-4 rounded-3xl hover:bg-secondary/50 transition-all duration-500"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-red-500 transition-all duration-500">
                    <div className="w-full h-full bg-secondary flex items-center justify-center overflow-hidden">
                        {latestImage ? (
                            <img 
                                src={latestImage} 
                                alt={cat.name} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                            />
                        ) : (
                            <span className="text-2xl font-black text-accent/20">{cat.name[0]}</span>
                        )}
                    </div>
                </div>
                
                <div className="text-center space-y-1">
                    <h2 className="text-sm sm:text-base font-black text-primary group-hover:text-red-600 transition-colors">{cat.name}</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cat._count.books} Books</p>
                </div>
              </Link>
            )
          })}
        </div>

        {categories.length === 0 && (
            <div className="py-24 text-center">
                <p className="text-muted-foreground font-bold italic">No categories found yet.</p>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
