import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("GET Addresses Error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { address, pincode, city, state, isDefault } = await req.json();

    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId: session.user.id },
            data: { isDefault: false },
        });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        address,
        pincode,
        city,
        state,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("POST Address Error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
