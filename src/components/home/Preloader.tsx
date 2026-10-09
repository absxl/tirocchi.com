"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/eases";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./home.module.css";

export function Preloader({
  name,
  loadingLabel,
  onDone,
}: {
  name: string;
  loadingLabel: string;
  onDone?: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("matteo-preloaded") === "1") {
      // One-time sync from sessionStorage on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      onDone?.();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const reduce = prefersReducedMotion();
    const tasks = { fonts: false, room: false, min: false };
    let raf = 0;
    let finished = false;

    document.fonts?.ready
      .then(() => {
        tasks.fonts = true;
      })
      .catch(() => {
        tasks.fonts = true;
      });
    window.addEventListener(
      "matteo:room-ready",
      () => {
        tasks.room = true;
      },
      { once: true }
    );
    const minTimer = window.setTimeout(() => {
      tasks.min = true;
    }, 900);

    const startedAt = performance.now();
    let progress = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(minTimer);
      sessionStorage.setItem("matteo-preloaded", "1");

      if (reduce) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.3,
          onComplete: () => {
            setHidden(true);
            onDone?.();
          },
        });
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          setHidden(true);
          onDone?.();
        },
      });
      if (metaRef.current) {
        timeline.to(metaRef.current, { autoAlpha: 0, y: -12, duration: 0.4, ease: EASE.in }, 0);
      }
      timeline.to(
        root,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: EASE.custom },
        0.15
      );
    };

    const update = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const timeProgress = Math.min(1, elapsed / 1.8);
      const done = (tasks.fonts ? 1 : 0) + (tasks.room ? 1 : 0) + (tasks.min ? 1 : 0);
      const taskProgress = done / 3;
      progress = Math.max(progress, Math.min(timeProgress, taskProgress) * 100);

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress)).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`;
      }

      const ready = timeProgress >= 1 && (taskProgress >= 1 || elapsed > 3);
      if (ready) {
        finish();
        return;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(minTimer);
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden="true">
      <div className={styles.preloaderInner}>
        <span className={styles.preloaderName}>{name}</span>
        <div ref={metaRef} className={styles.preloaderMeta}>
          <span>{loadingLabel}</span>
          <span ref={counterRef} className={styles.preloaderCounter}>
            000
          </span>
        </div>
        <div className={styles.preloaderBar}>
          <div ref={barRef} className={styles.preloaderBarFill} />
        </div>
      </div>
    </div>
  );
}
