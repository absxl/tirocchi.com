"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const HOME_PATHS = new Set(["/", "/en"]);

export function SmoothScroll() {
  const pathname = usePathname();
  const normalized = pathname.replace(/\/+$/, "") || "/";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // The home uses native scroll-snap paging, which conflicts with Lenis.
    if (HOME_PATHS.has(normalized)) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [normalized]);

  return null;
}
