import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addressId = params.id;
    const body = await req.json();

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        address: body.address,
        pincode: body.pincode,
        city: body.city,
        state: body.state,
        isDefault: body.isDefault ?? existingAddress.isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("PATCH Address Error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addressId = params.id;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Address Error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
