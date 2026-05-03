import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer, ip, city, region, country, browser, os, device } = body;
    
    const session = await getSession();
    
    // Track even if session is not available, but enrich if it is
    await prisma.analytics.create({
      data: {
        path: path || "/",
        referrer,
        ip,
        city,
        region,
        country,
        browser,
        os,
        device,
        userId: session?.user?.id,
        userPhone: session?.user?.phone,
        userName: session?.user?.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
