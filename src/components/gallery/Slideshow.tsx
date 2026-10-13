"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Slideshow.module.css";

export interface Slide {
  id: string;
  image: string;
  alt: string;
  title: string;
  meta?: string;
  href?: string;
  onOpen?: () => void;
}

/**
 * Gallery slideshow: 2 slides on desktop, 1 on mobile. Autoplay (paused on
 * hover/focus/drag), manual arrows, keyboard arrows and swipe. Respects
 * prefers-reduced-motion (no autoplay, instant moves).
 */
export function Slideshow({
  items,
  label,
  prevLabel,
  nextLabel,
  sizes = "(min-width: 768px) 45vw, 90vw",
}: {
  items: Slide[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  sizes?: string;
}) {
  const twoUp = useMediaQuery("(min-width: 768px)");
  const perView = twoUp ? 2 : 1;
  const maxIndex = Math.max(0, items.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ x: 0, active: false });

  // Keep index in range when perView changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.max(0, Math.min(maxIndex, i)));
  }, [maxIndex]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        if (maxIndex === 0) return 0;
        const next = i + delta;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [maxIndex]
  );

  useEffect(() => {
    if (paused || maxIndex === 0 || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, maxIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    drag.current = { x: event.clientX, active: true };
    setPaused(true);
  };
  const onPointerUp = (event: React.PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return;
    const delta = event.clientX - drag.current.x;
    drag.current.active = false;
    setPaused(false);
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      className={styles.slideshow}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <ul
        className={styles.track}
        style={{
          ["--per-view" as string]: perView,
          transform: `translateX(calc(${-index} * 100% / ${items.length}))`,
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current.active = false;
          setPaused(false);
        }}
      >
        {items.map((item) => {
          const inner = (
            <>
              <span className={styles.media}>
                <SmartImage src={item.image} alt={item.alt} sizes={sizes} />
              </span>
              {item.meta && <span className={`mono ${styles.meta}`}>{item.meta}</span>}
              <span className={styles.title}>{item.title}</span>
            </>
          );
          return (
            <li key={item.id} className={styles.slide} aria-roledescription="slide">
              {item.href ? (
                <Link href={item.href} className={styles.card} draggable={false}>
                  {inner}
                </Link>
              ) : (
                <button type="button" className={styles.card} onClick={item.onOpen} draggable={false}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {maxIndex > 0 && (
        <div className={styles.controls}>
          <button type="button" className={styles.nav} onClick={() => go(-1)} aria-label={prevLabel}>
            ‹
          </button>
          <span className={`mono ${styles.counter}`}>
            {String(Math.min(index + 1, items.length)).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <button type="button" className={styles.nav} onClick={() => go(1)} aria-label={nextLabel}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}
