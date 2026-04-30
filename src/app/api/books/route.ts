import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Use select instead of include for faster database response
    const books = await prisma.book.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ]
      } : {},
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        image: true,
        category: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit || 10, // Default limit for safety
    });

    // Add Cache-Control header for faster client-side response on repeat searches
    return NextResponse.json(books, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, author, price, description, image, stock, categoryId, languages } = await req.json();

    const book = await prisma.book.create({
      data: {
        title,
        author,
        price: parseFloat(price),
        description,
        image,
        stock: parseInt(stock),
        categoryId,
        languages: languages || ["English"]
      },
    });
    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
