"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

// The theme lives on <html data-theme>; this reads it and re-renders when it changes.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

/** A plain text control in the nav: names the theme it switches to, and remembers the choice. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private windows); the switch still works for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className={`link inline-flex items-center gap-2 text-muted hover:text-ink ${className}`}
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
        {theme === "dark" ? (
          // A sun: the theme this switches to.
          <>
            <circle cx="7" cy="7" r="3" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <rect key={a} x="6.4" y="0" width="1.2" height="2.2" fill="currentColor" transform={`rotate(${a} 7 7)`} />
            ))}
          </>
        ) : (
          // A moon.
          <path d="M9.5 1.2A6 6 0 1 0 12.8 9 4.8 4.8 0 0 1 9.5 1.2Z" fill="currentColor" />
        )}
      </svg>
      {next === "light" ? "Light" : "Dark"}
    </button>
  );
}
