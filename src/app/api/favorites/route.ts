import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        book: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(favorites.map(f => f.book));
  } catch (error) {
    console.error("GET Favorites Error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return NextResponse.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          bookId
        }
      });
      return NextResponse.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("TOGGLE Favorite Error:", error);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}
