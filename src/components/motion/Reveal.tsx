"use client";

/* createElement is used so the wrapper element is configurable; the React
   compiler's refs rule does not understand createElement with a ref prop. */
/* eslint-disable react-hooks/refs */

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

type As = "div" | "section" | "ul" | "ol" | "li" | "article" | "figure" | "header" | "footer";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: As;
  y?: number;
  delay?: number;
  stagger?: boolean;
  style?: CSSProperties;
}

/**
 * Scroll reveal. Initial hidden state lives in CSS (only when `html.js` is set),
 * so the content stays visible with JS disabled or reduced motion.
 * createElement is used so the wrapper element is configurable.
 */
export function Reveal({
  children,
  className,
  as = "div",
  y = 26,
  delay = 0,
  stagger = false,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const targets = stagger ? Array.from(element.children) : element;
    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: MOTION.dur.base,
      ease: MOTION.ease,
      delay,
      stagger: stagger ? MOTION.stagger : 0,
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger, y]);

  return createElement(
    as,
    {
      ref,
      className,
      style: { ["--reveal-y" as string]: `${y}px`, ...style },
      ...(stagger ? { "data-reveal-stagger": "" } : { "data-reveal": "" }),
    },
    children
  );
}
