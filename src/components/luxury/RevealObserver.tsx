"use client";

import { useEffect } from "react";

/**
 * One observer for every <Reveal> on the page: marks `[data-reveal]` elements `data-shown` as
 * they scroll into view. New elements (streamed sections, infinite scroll, page changes) are
 * picked up by a MutationObserver.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // The first report can arrive below the threshold, so check the ratio too.
          if (!entry.isIntersecting || entry.intersectionRatio < 0.3) continue;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        }
      },
      // Start once 30% of the element is on screen (the element itself never moves; its inner wrapper does).
      { threshold: 0.3 },
    );

    const observeWithin = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    };
    observeWithin(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-shown])")) io.observe(node);
          observeWithin(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
