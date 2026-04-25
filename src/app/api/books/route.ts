import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const books = await prisma.book.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ]
      } : {},
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit || undefined,
    });
    return NextResponse.json(books);
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
