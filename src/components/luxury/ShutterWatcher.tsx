"use client";

import { useEffect } from "react";

/**
 * Flags `html[data-footer-open]` while the shutter footer is mostly uncovered, so the fixed
 * header slides away and the footer has the whole screen (see .lux-shutter in globals.css).
 * The spacer is hidden where the shutter is off, so the flag never turns on there.
 */
export function ShutterWatcher({ spacerId }: { spacerId: string }) {
  useEffect(() => {
    const spacer = document.getElementById(spacerId);
    if (!spacer) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => root.toggleAttribute("data-footer-open", entry.isIntersecting && entry.intersectionRatio >= 0.75),
      { threshold: [0, 0.75, 1] },
    );
    io.observe(spacer);
    return () => {
      io.disconnect();
      root.removeAttribute("data-footer-open");
    };
  }, [spacerId]);

  return null;
}
