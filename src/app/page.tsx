import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 300;

type HomeBook = {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string | null;
  categoryId: string | null;
  category: { name: string } | null;
};

type HomeCategory = {
  id: string;
  name: string;
};

export default async function Home() {
  // Fetch banners, books, and categories directly on the server for maximum performance
  // Fetch books and categories directly on the server
  const [books, categories] = await Promise.all([
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
      take: 120,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Handle banners safely as empty array since table doesn't exist
  const serializedBanners: [] = [];
  const serializedBooks: HomeBook[] = JSON.parse(JSON.stringify(books));
  const serializedCategories: HomeCategory[] = JSON.parse(JSON.stringify(categories));

  return (
    <HomeClient 
      banners={serializedBanners}
      books={serializedBooks} 
      categories={serializedCategories} 
    />
  );
}
