import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch banners, books, and categories directly on the server for maximum performance
  const [banners, books, categories] = await Promise.all([
    (prisma as any).banner?.findMany({
      orderBy: { createdAt: "desc" },
    }) || Promise.resolve([]),
    prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        image: true,
        categoryId: true,
        category: { select: { name: true } }
      },
      take: 60, // Sufficient for displaying several per category
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
        orderBy: { name: "asc" },
    }),
  ]);

  // Serialize data for client component
  const serializedBanners = JSON.parse(JSON.stringify(banners));
  const serializedBooks = JSON.parse(JSON.stringify(books));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <HomeClient 
      banners={serializedBanners}
      books={serializedBooks} 
      categories={serializedCategories} 
    />
  );
}
