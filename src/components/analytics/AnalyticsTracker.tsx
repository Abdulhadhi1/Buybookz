"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if the path has changed to avoid double tracking on mount/re-renders
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    const trackView = async () => {
      try {
        // Get basic device info
        const userAgent = window.navigator.userAgent;
        
        // Simple browser/OS detection logic or just send UA
        // We'll send UA and let the server or admin panel parse it if needed
        // For now, let's keep it simple
        
        // We can get location data from a free API
        // Note: Using a free API might have rate limits or privacy concerns
        // but for "own analytics" this is a common approach.
        let locationData = {};
        try {
          const locRes = await fetch("https://ipapi.co/json/");
          if (locRes.ok) {
            const loc = await locRes.json();
            locationData = {
              ip: loc.ip,
              city: loc.city,
              region: loc.region,
              country: loc.country_name,
            };
          }
        } catch (e) {
          console.warn("Location tracking failed:", e);
        }

        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
            browser: userAgent, // Simplified
            ...locationData
          }),
        });
      } catch (error) {
        // Silently fail to not disturb user experience
      }
    };

    trackView();
  }, [pathname]);

  return null;
}
