import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.image) return NextResponse.json({ error: "Image is required" }, { status: 400 });

    const banner = await prisma.banner.create({
      data: {
        image: body.image,
        title: body.title || null,
        link: body.link || null,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
