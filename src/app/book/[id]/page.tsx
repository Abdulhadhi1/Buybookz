import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookDetailClient from "@/components/book/BookDetailClient";

export const revalidate = 300;

export async function generateStaticParams() {
  const books = await prisma.book.findMany({
    select: { id: true },
    take: 200,
    orderBy: { createdAt: "desc" },
  });

  return books.map((book) => ({ id: book.id }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
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
      category: { select: { name: true } },
    },
  });

  if (!book) {
    notFound();
  }

  const serializedBook = JSON.parse(JSON.stringify(book));

  return <BookDetailClient book={serializedBook} />;
}
