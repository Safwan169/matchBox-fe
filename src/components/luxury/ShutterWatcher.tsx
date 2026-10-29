"use client";

import { useEffect } from "react";

/**
 * Drives the shutter footer (see .lux-shutter in globals.css):
 * - `--page-stick` = viewport height minus page height, so the page sticks once its end is on
 *   screen and the footer slides up over it;
 * - `html[data-footer-open]` while the footer covers most of the screen, so the header slides away.
 */
export function ShutterWatcher({ footerId }: { footerId: string }) {
  useEffect(() => {
    const footer = document.getElementById(footerId);
    const page = document.querySelector<HTMLElement>(".lux-page");
    if (!footer || !page) return;
    const root = document.documentElement;

    const measure = () => page.style.setProperty("--page-stick", `${Math.min(0, window.innerHeight - page.offsetHeight)}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(page);
    window.addEventListener("resize", measure);

    const io = new IntersectionObserver(
      ([entry]) => root.toggleAttribute("data-footer-open", entry.isIntersecting && entry.intersectionRatio >= 0.75),
      { threshold: [0, 0.75, 1] },
    );
    io.observe(footer);

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", measure);
      root.removeAttribute("data-footer-open");
    };
  }, [footerId]);

  return null;
}
