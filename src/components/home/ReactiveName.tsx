"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./ReactiveName.module.css";

/**
 * Display name that reacts to the pointer: letters near the cursor lift, scale
 * and pick up the accent colour. Uses a window listener so it works regardless
 * of the element's pointer-events. On touch, a tap sends a short wave.
 * With prefers-reduced-motion it falls back to a colour-only highlight.
 */
export function ReactiveName({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    const letters = () => lettersRef.current.filter(Boolean);

    const apply = (clientX: number | null, clientY: number | null) => {
      raf.current = 0;
      const rect = root.getBoundingClientRect();
      const cx = clientX ?? rect.left + rect.width / 2;
      const cy = clientY ?? rect.top - 9999;
      const radius = Math.max(150, rect.width * 0.2);
      for (const el of letters()) {
        const r = el.getBoundingClientRect();
        const distance = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2));
        const influence = Math.max(0, 1 - distance / radius);
        el.style.color = influence > 0.3 ? "var(--accent)" : "";
        if (reduce) continue;
        // Slight magnify around the cursor: grow more, lift a little.
        el.style.transform = `translateY(${(-influence * 9).toFixed(2)}px) scale(${(
          1 + influence * 0.42
        ).toFixed(3)})`;
      }
    };

    const schedule = (x: number | null, y: number | null) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => apply(x, y));
    };

    const onMove = (event: PointerEvent) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      schedule(event.clientX, event.clientY);
    };
    const onLeave = () => schedule(null, null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      for (const el of letters()) {
        el.style.transform = "";
        el.style.color = "";
      }
    };
  }, []);

  const onPointerDown = () => {
    if (prefersReducedMotion()) return;
    lettersRef.current.filter(Boolean).forEach((el, i) => {
      el.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-16px) scale(1.24)" },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 520, delay: i * 26, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    });
  };

  const words = text.split(" ");
  let index = 0;

  return (
    <h1 ref={ref} className={className} aria-label={text} onPointerDown={onPointerDown}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word}>
          {Array.from(word).map((char, charIndex) => {
            const i = index++;
            return (
              <span
                key={charIndex}
                ref={(el) => {
                  if (el) lettersRef.current[i] = el;
                }}
                className={styles.letter}
                aria-hidden="true"
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className={styles.space} aria-hidden="true">
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </h1>
  );
}
