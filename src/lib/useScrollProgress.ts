"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Writes a 0→1 progress value to `--reveal` on the element while scrolling
 * through the first `end` fraction of the viewport. No re-renders.
 * When disabled (inner pages) the value is fixed to 1.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  end = 0.6
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!enabled) {
      element.style.setProperty("--reveal", "1");
      element.removeAttribute("data-revealed");
      return;
    }

    const reduce = prefersReducedMotion();
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      let progress = window.scrollY / (end * vh);
      progress = Math.min(1, Math.max(0, progress));
      if (reduce) progress = progress > 0.5 ? 1 : 0;
      element.style.setProperty("--reveal", progress.toFixed(3));
      element.toggleAttribute("data-revealed", progress > 0.15);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, enabled, end]);
}
