import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getApiBooks } from "@/lib/book-data";
import { revalidateTag } from "next/cache";

export const revalidate = 300;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const requestedLimit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 6;
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 12) : 6;
    const requestedSkip = searchParams.get("skip") ? parseInt(searchParams.get("skip")!) : 0;
    const skip = Number.isFinite(requestedSkip) ? Math.max(requestedSkip, 0) : 0;

    const data = await getApiBooks(query, category, limit, skip);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
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
    revalidateTag("books", "max");
    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
