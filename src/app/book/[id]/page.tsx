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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buybookzs.com';
  
  // WhatsApp and other crawlers require ABSOLUTE URLs for images
  const imageUrl = book.image 
    ? (book.image.startsWith('http') ? book.image : `${siteUrl}${book.image}`)
    : `${siteUrl}/newlogo.png`; 

  return {
    metadataBase: new URL(siteUrl),
    title: `${book.title} | ${book.author} | BuyBookz`,
    description: description,
    openGraph: {
      title: book.title,
      description: `₹${book.price} - ${description}`,
      url: `/book/${id}`,
      siteName: "BuyBookz",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800, // WhatsApp prefers square or 1.91:1
          alt: book.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: description,
      images: [imageUrl],
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
