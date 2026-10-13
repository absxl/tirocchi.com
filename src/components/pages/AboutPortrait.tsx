"use client";

import { useRandomIndex } from "@/lib/useRandomIndex";
import { SmartImage } from "@/components/SmartImage";

/** Portrait of Matteo — one of the three backgrounds, random per visit. */
export function AboutPortrait({ alt }: { alt: string }) {
  const index = useRandomIndex(3, "about-portrait");
  const src = `/assets/sfondi/${index + 1}.png`;
  return <SmartImage src={src} alt={alt} sizes="(min-width: 900px) 40vw, 92vw" priority />;
}
