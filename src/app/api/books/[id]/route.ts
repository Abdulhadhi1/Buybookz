import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const book = await prisma.book.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.book.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Book deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
