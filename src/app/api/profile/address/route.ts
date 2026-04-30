import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { address, pincode, city, state, isDefault } = body;

  try {
    // If isDefault is true, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        address,
        pincode,
        city,
        state,
        isDefault: !!isDefault
      }
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, isDefault } = body;

  try {
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id, userId: session.user.id },
      data: { isDefault }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await prisma.address.delete({
      where: { id, userId: session.user.id }
    });

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
