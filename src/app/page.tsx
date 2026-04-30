import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// Removed force-dynamic to allow ISR (Incremental Static Regeneration)
// This will make the page load instantly from cache
export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const [categories, recentBooks, uncategorizedBooks] = await Promise.all([
    prisma.category.findMany({
      include: {
        books: {
          take: 20, // Reduced from 40 for faster query
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            author: true,
            price: true,
            image: true,
            categoryId: true,
          }
        }
      },
      orderBy: { name: "asc" },
    }),
    prisma.book.findMany({
      take: 12, // Reduced from 20 for faster initial load
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        image: true,
        categoryId: true,
        category: { select: { name: true } }
      }
    }),
    prisma.book.findMany({
      where: { categoryId: null },
      take: 12, // Reduced from 20 for faster initial load
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        image: true,
        categoryId: true,
        category: { select: { name: true } }
      }
    })
  ]);

  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedRecentBooks = JSON.parse(JSON.stringify(recentBooks));
  const serializedUncategorizedBooks = JSON.parse(JSON.stringify(uncategorizedBooks));

  return (
    <HomeClient 
      categories={serializedCategories}
      recentBooks={serializedRecentBooks}
      uncategorizedBooks={serializedUncategorizedBooks}
    />
  );
}
