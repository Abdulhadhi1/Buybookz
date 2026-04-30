import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";
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
  const [categories, recentBooks, uncategorizedBooks] = await Promise.all([
    prisma.category.findMany({
      include: {
        books: {
          take: 40,
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
      take: 20,
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
      take: 20,
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
