"use client";

import { useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { SmartImage } from "@/components/SmartImage";

interface ReelItem {
  title: string;
  image: string;
}

export function CoverReel({ items, hint }: { items: ReelItem[]; hint: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const reset = () => {
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll<HTMLElement>("[data-reel-card]").forEach((card) => {
      card.style.setProperty("--dock-scale", "1");
      card.style.setProperty("--dock-lift", "0px");
      card.style.setProperty("--dock-z", "1");
      card.classList.remove("is-active");
    });
  };

  const onMove = (event: React.PointerEvent<HTMLUListElement>) => {
    if (!fine) return;
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll<HTMLElement>("[data-reel-card]").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
      const influence = Math.max(0, 1 - distance / 200);
      card.style.setProperty("--dock-scale", (1 + influence * 0.32).toFixed(3));
      card.style.setProperty("--dock-lift", `${(-influence * 26).toFixed(1)}px`);
      card.style.setProperty("--dock-z", String(Math.round(1 + influence * 10)));
      card.classList.toggle("is-active", influence > 0.55);
    });
  };

  return (
    <div className="reel-wrap">
      <ul
        ref={trackRef}
        className="reel"
        onPointerMove={onMove}
        onPointerLeave={reset}
        onWheel={(event) => {
          if (!fine) return;
          if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
          event.preventDefault();
          if (trackRef.current) trackRef.current.scrollLeft += event.deltaY;
        }}
      >
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} data-reel-card className="reel-card">
            <SmartImage src={item.image} alt={item.title} sizes="210px" />
            <span className="reel-caption">{item.title}</span>
          </li>
        ))}
      </ul>
      <p className="reel-hint">{hint}</p>
    </div>
  );
}
