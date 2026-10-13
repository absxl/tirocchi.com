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
 * Gallery slideshow: 3 slides on desktop, 2 on tablet, 1 on mobile. Autoplay
 * (paused on hover/focus/drag), side arrows, keyboard, drag/swipe and
 * trackpad horizontal scroll. Respects prefers-reduced-motion.
 */
export function Slideshow({
  items,
  label,
  prevLabel,
  nextLabel,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
}: {
  items: Slide[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  sizes?: string;
}) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const mid = useMediaQuery("(min-width: 640px)");
  const perView = wide ? 3 : mid ? 2 : 1;
  const maxIndex = Math.max(0, items.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, active: false, moved: 0 });

  // Keep index in range when perView changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.max(0, Math.min(maxIndex, i)));
  }, [maxIndex]);

  // Move by one slide (wrap around).
  const step = useCallback(
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

  // Move by a full "page" (used by the arrows and keyboard).
  const page = useCallback(
    (direction: number) => {
      step(direction * Math.max(1, perView));
    },
    [step, perView]
  );

  useEffect(() => {
    if (paused || maxIndex === 0 || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, maxIndex]);

  // Trackpad / horizontal wheel scrolling.
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    let accumulated = 0;
    const onWheel = (event: WheelEvent) => {
      // Only horizontal gestures (two-finger swipe on a trackpad).
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      accumulated += event.deltaX;
      const threshold = 45;
      if (accumulated > threshold) {
        step(1);
        accumulated = 0;
      } else if (accumulated < -threshold) {
        step(-1);
        accumulated = 0;
      }
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [step]);

  const setDrag = (value: number) => {
    trackRef.current?.style.setProperty("--drag", `${value}px`);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    drag.current = { x: event.clientX, active: true, moved: 0 };
    setPaused(true);
    if (trackRef.current) trackRef.current.dataset.dragging = "true";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    drag.current.moved = dx;
    setDrag(dx);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = drag.current.moved;
    if (trackRef.current) trackRef.current.dataset.dragging = "false";
    setDrag(0);
    setPaused(false);
    const threshold = 45;
    if (dx <= -threshold) step(1);
    else if (dx >= threshold) step(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      page(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      page(1);
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
      <div className={styles.viewport} ref={viewportRef}>
        <ul
          ref={trackRef}
          className={styles.track}
          style={{
            ["--per-view" as string]: perView,
            transform: `translateX(calc(${-index} * 100% / ${items.length} + var(--drag, 0px)))`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
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
          <>
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={() => page(-1)}
              aria-label={prevLabel}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={() => page(1)}
              aria-label={nextLabel}
            >
              ›
            </button>
          </>
        )}
      </div>

      {maxIndex > 0 && (
        <span className={`mono ${styles.counter}`}>
          {String(Math.min(index + 1, items.length)).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
