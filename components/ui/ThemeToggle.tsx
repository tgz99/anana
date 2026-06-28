"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { trackEvent } from "./Analytics";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  const handleToggle = () => {
    toggle();
    trackEvent("theme_toggle", { from: theme });
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-full border border-[var(--card-stroke)] hover:border-[var(--accent-blue)] transition-colors focus-visible:outline-[var(--accent-blue)] ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[var(--text-muted)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--lt-blue)]" />
      )}
    </button>
  );
}
