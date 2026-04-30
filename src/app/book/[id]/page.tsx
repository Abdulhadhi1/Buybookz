import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookDetailClient from "@/components/book/BookDetailClient";

// Optimized ISR for lightning-fast page loading
export const revalidate = 60; 

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch book and related books in parallel for speed
  const [book, relatedBooks] = await Promise.all([
    prisma.book.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          description: true,
          image: true,
          stock: true,
          languages: true,
          categoryId: true,
          category: { select: { name: true } },
        },
      }),
      prisma.book.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          image: true,
          categoryId: true,
        }
      })
  ]);

  if (!book) {
    notFound();
  }

  const serializedBook = JSON.parse(JSON.stringify(book));
  const serializedRelatedBooks = JSON.parse(JSON.stringify(relatedBooks));

  return <BookDetailClient book={serializedBook} relatedBooks={serializedRelatedBooks} />;
}
