import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookDetailClient from "@/components/book/BookDetailClient";

// Optimized ISR for lightning-fast page loading
export const revalidate = 60; 

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    select: { title: true, author: true, description: true, image: true, price: true }
  });

  if (!book) return { title: "Book Not Found" };

  const description = book.description?.slice(0, 160) || `Buy ${book.title} by ${book.author} online at BuyBookz. Best prices on premium literature.`;
  
  return {
    title: `${book.title} | ${book.author} | BuyBookz`,
    description: description,
    openGraph: {
      title: `Buy ${book.title} by ${book.author} Online`,
      description: `₹${book.price} - ${description}`,
      images: book.image ? [book.image] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: description,
      images: book.image ? [book.image] : [],
    },
  };
}

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
