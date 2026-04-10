import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
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
