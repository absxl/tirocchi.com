"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Custom desktop cursor: a dot that grows over interactive elements and shows
 * an optional label (data-cursor-label). Disabled on touch. The native cursor
 * is hidden only once the custom one is actually visible.
 */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    const root = document.documentElement;
    const reduce = prefersReducedMotion();
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let raf = 0;
    let visible = false;

    const render = () => {
      pos.x += (target.x - pos.x) * (reduce ? 1 : 0.18);
      pos.y += (target.y - pos.y) * (reduce ? 1 : 0.18);
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(16px, 16px)`;
      raf = requestAnimationFrame(render);
    };

    const show = () => {
      if (visible) return;
      visible = true;
      root.classList.add("has-cursor", "cursor-visible");
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      show();
      const interactive = (event.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (interactive) {
        dot.classList.add("is-hover");
        const text = interactive.dataset.cursorLabel ?? "";
        label.textContent = text;
        label.classList.toggle("is-active", text.length > 0);
      } else {
        dot.classList.remove("is-hover");
        label.classList.remove("is-active");
      }
    };

    const onLeave = () => {
      visible = false;
      root.classList.remove("has-cursor", "cursor-visible");
    };

    raf = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerenter", show);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerenter", show);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      root.classList.remove("has-cursor", "cursor-visible");
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
