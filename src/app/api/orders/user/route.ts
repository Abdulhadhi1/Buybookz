import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { book: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
