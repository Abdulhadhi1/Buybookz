import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer, browser } = body;
    
    // Get IP from headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    
    const session = await getSession();
    
    // Attempt to get location data from server-side (optional, to avoid CORS)
    let locationData = { city: null, region: null, country: null };
    try {
        // Only fetch if not localhost
        if (ip !== "127.0.0.1") {
            const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
            if (locRes.ok) {
                const loc = await locRes.json();
                locationData = {
                    city: loc.city || null,
                    region: loc.region || null,
                    country: loc.country_name || null,
                };
            }
        }
    } catch (e) {
        console.error("Server-side location fetch failed:", e);
    }

    // Track even if session is not available, but enrich if it is
    await prisma.analytics.create({
      data: {
        path: path || "/",
        referrer,
        ip,
        ...locationData,
        browser,
        userId: session?.user?.id,
        userPhone: session?.user?.phone,
        userName: session?.user?.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Return 200 even on error to not disturb the client-side tracker
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
