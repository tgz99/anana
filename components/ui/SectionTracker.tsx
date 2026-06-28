"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/ui/Analytics";

export function SectionTracker({
  sectionId,
  source,
}: {
  sectionId: string;
  source: string;
}) {
  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("section_view", { source });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId, source]);

  return null;
}
