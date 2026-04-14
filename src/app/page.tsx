import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// Force dynamic is not needed if we want it to be fast, 
// but we want the data to be fresh, so we can use revalidate.
export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch data directly on the server
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
        orderBy: { name: "asc" },
    }),
  ]);

  // Clean data for serialization if needed (though Prisma objects are usually fine)
  const serializedBooks = JSON.parse(JSON.stringify(books));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return <HomeClient books={serializedBooks} categories={serializedCategories} />;
}
