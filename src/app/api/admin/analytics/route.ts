import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Fetch total visitors (unique IPs)
    const totalVisitors = await prisma.analytics.groupBy({
      by: ['ip'],
    });

    // Fetch recent page views
    const pageViews = await prisma.analytics.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: skip,
    });

    // Fetch path stats
    const pathStats = await prisma.analytics.groupBy({
      by: ['path'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    return NextResponse.json({
      pageViews,
      totalVisitors: totalVisitors.length,
      totalViews: await prisma.analytics.count(),
      pathStats,
    });
  } catch (error) {
    console.error("Admin analytics fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
