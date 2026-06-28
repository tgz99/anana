"use client";

import { useEffect, useRef } from "react";

interface BubbleFieldProps {
  count?: number;
  className?: string;
}

export function BubbleField({ count = 12, className = "" }: BubbleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Cap on mobile
    const isMobile = window.innerWidth < 640;
    const actualCount = isMobile ? Math.min(count, 6) : count;

    const bubbles: HTMLDivElement[] = [];
    for (let i = 0; i < actualCount; i++) {
      const bubble = document.createElement("div");
      const size = 4 + Math.random() * 10;
      bubble.className = "bubble";
      Object.assign(bubble.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 20}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${4 + Math.random() * 5}s`,
        animation: `bubbleRise ${4 + Math.random() * 5}s ${Math.random() * 6}s ease-in infinite`,
        opacity: (0.3 + Math.random() * 0.5).toString(),
      });
      container.appendChild(bubble);
      bubbles.push(bubble);
    }

    return () => {
      bubbles.forEach((b) => b.remove());
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
