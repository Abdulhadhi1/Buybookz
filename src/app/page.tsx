import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// Optimized ISR configuration to prevent oversized pages
export const revalidate = 60; 

export default async function Home() {
  // 1. Fetch Categories for the circular icons (ONLY get the image and name)
  const categoriesRaw = await prisma.category.findMany({
    select: {
        id: true,
        name: true,
        books: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { image: true }
        }
    },
    orderBy: { name: "asc" },
  });

  // 2. Fetch Best Selling / Recent Books (Limit to 8)
  const recentBooks = await prisma.book.findMany({
    take: 8,
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

  // 3. Fetch Featured Categories (Limit to top 4 categories for home page)
  const featuredCategoryIds = categoriesRaw.slice(0, 4).map(c => c.id);
  const featuredCategories = await prisma.category.findMany({
    where: { id: { in: featuredCategoryIds } },
    select: {
        id: true,
        name: true,
        books: {
            take: 8, // Only 8 books per category
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

  // 4. Fetch Uncategorized / Deals (Limit to 4)
  const uncategorizedBooks = await prisma.book.findMany({
    where: { categoryId: null },
    take: 4,
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

  // Map categories to a cleaner structure for the icon list
  const categories = categoriesRaw.map(cat => ({
    id: cat.id,
    name: cat.name,
    image: cat.books?.[0]?.image || null
  }));

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
