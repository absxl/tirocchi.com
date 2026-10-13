"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./SectionCover.module.css";

/**
 * Typographic section cover: a large title, index and description that react
 * to the pointer (parallax + accent glow following the cursor).
 */
export function SectionCover({
  index,
  label,
  desc,
  href,
  side,
  ctaLabel,
}: {
  index: number;
  label: string;
  desc: string;
  href: string;
  side: "left" | "right";
  ctaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = prefersReducedMotion();

    let raf = 0;
    let nx = 0;
    let ny = 0;

    const apply = () => {
      raf = 0;
      element.style.setProperty("--mx", `${(nx * 100 + 50).toFixed(1)}%`);
      element.style.setProperty("--my", `${(ny * 100 + 50).toFixed(1)}%`);
      if (reduce) return;
      element.style.setProperty("--tx", `${(nx * -30).toFixed(1)}px`);
      element.style.setProperty("--ty", `${(ny * -20).toFixed(1)}px`);
      element.style.setProperty("--sk", `${(nx * 3).toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      nx = event.clientX / window.innerWidth - 0.5;
      ny = event.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cover} data-side={side}>
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <span className={`mono ${styles.index}`}>{String(index).padStart(2, "0")}</span>
        <h2 className={styles.title}>{label}</h2>
        <p className={styles.desc}>{desc}</p>
        <Link
          href={href}
          className={styles.cta}
          data-cursor
          data-cursor-label={label}
          transitionTypes={["nav-forward"]}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
