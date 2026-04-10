import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [totalBooks, outOfStock, totalUsers, paidOrders] = await Promise.all([
            prisma.book.count(),
            prisma.book.count({ where: { stock: { lt: 5 } } }),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.order.findMany({
                where: { status: "PAID" },
                select: { totalAmount: true }
            })
        ]);

        const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        return NextResponse.json({
            totalBooks,
            outOfStock,
            totalUsers,
            totalRevenue
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
