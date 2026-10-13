export const MOTION = {
  ease: "power3.out",
  easeIn: "power3.in",
  dur: { fast: 0.35, base: 0.8, slow: 1.1 },
  stagger: 0.05,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
