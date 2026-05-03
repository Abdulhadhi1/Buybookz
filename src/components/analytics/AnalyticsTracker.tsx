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
        
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
            browser: userAgent,
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
