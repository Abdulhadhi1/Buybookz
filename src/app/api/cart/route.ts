import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { book: true },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId, quantity } = await req.json();

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId: session.user.id, bookId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
      return NextResponse.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        bookId,
        quantity: quantity || 1,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      });
  
      return NextResponse.json({ message: "Cart cleared" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
    }
  }
