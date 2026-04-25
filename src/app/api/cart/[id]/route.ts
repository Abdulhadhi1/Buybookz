export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { quantity } = await req.json();
        
        const updatedItem = await prisma.cartItem.update({
            where: { id, userId: session.user.id },
            data: { quantity: Math.max(1, quantity) },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.cartItem.delete({
            where: { id, userId: session.user.id },
        });

        return NextResponse.json({ message: "Item removed" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
    }
}
