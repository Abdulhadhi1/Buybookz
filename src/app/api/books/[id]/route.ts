import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const book = await prisma.book.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.book.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Book deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
