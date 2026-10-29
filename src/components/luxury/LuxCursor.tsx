"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], select, label, summary";

/**
 * The soft gold ring that trails the flame cursor (the flame itself is a CSS cursor, see
 * .theme-lux in globals.css). Mouse only, and not for visitors who prefer reduced motion.
 * It grows over links and buttons and hides when the pointer leaves the window.
 */
export function LuxCursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0, y = 0, rx = 0, ry = 0, frame = 0, started = false;

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      el.style.translate = `${rx}px ${ry}px`;
      frame = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Centre the ring on the flame's body, a little below its tip (the hotspot).
      x = e.clientX + 1;
      y = e.clientY + 9;
      if (!started) {
        started = true;
        rx = x;
        ry = y;
      }
      el.dataset.visible = "";
      el.toggleAttribute("data-hover", !!(e.target as Element | null)?.closest?.(INTERACTIVE));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => delete el.dataset.visible;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ring} aria-hidden className="lux-cursor-ring" />;
}
