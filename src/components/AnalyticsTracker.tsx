"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

function TrackerComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // We construct the full relative path with query parameters
    const queryStr = searchParams ? searchParams.toString() : "";
    const fullPath = pathname + (queryStr ? `?${queryStr}` : "");
    
    // Log page view event
    trackEvent("page_view", fullPath);
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerComponent />
    </Suspense>
  );
}
