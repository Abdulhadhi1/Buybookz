import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// Optimized ISR configuration to prevent oversized pages
export const revalidate = 60; 

export default async function Home() {
  // 1. Fetch Categories for the circular icons (only need the latest book's image for each)
  const categories = await prisma.category.findMany({
    include: {
      books: {
        take: 1, // Only need 1 book for the icon image
        orderBy: { createdAt: "desc" },
        select: { image: true }
      }
    },
    orderBy: { name: "asc" },
  });

  // 2. Fetch Best Selling / Recent Books
  const recentBooks = await prisma.book.findMany({
    take: 10,
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
  });

  // 3. Fetch Featured Categories (Limit to top 6 categories on home page to keep it fast)
  const featuredCategoryIds = categories.slice(0, 6).map(c => c.id);
  const featuredCategories = await prisma.category.findMany({
    where: { id: { in: featuredCategoryIds } },
    include: {
      books: {
        take: 10, // Only show top 10 books per category on home page
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
  });

  // 4. Fetch Uncategorized / Deals
  const uncategorizedBooks = await prisma.book.findMany({
    where: { categoryId: null },
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      price: true,
      image: true,
      categoryId: true,
    }
  });

  const serializedData = JSON.parse(JSON.stringify({
    categories,
    featuredCategories,
    recentBooks,
    uncategorizedBooks
  }));

  return (
    <HomeClient 
      categories={serializedData.categories}
      featuredCategories={serializedData.featuredCategories}
      recentBooks={serializedData.recentBooks}
      uncategorizedBooks={serializedData.uncategorizedBooks}
    />
  );
}
