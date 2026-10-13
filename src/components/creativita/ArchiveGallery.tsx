"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { GalleryItem } from "@/lib/gallery";
import { useDialog } from "@/lib/useDialog";
import { Slideshow } from "@/components/gallery/Slideshow";
import styles from "./Creativita.module.css";

export function ArchiveGallery({ lang, items }: { lang: Locale; items: GalleryItem[] }) {
  const dict = getDictionary(lang);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIndex(null), []);
  useDialog(index !== null, close, dialogRef);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, go]);

  const current = index === null ? null : items[index];

  return (
    <>
      <Slideshow
        label={dict.progetto.gallery}
        prevLabel={dict.creativita.previous}
        nextLabel={dict.creativita.next}
        items={items.map((item, i) => ({
          id: item.id,
          image: item.image,
          alt: item.title,
          title: item.title,
          meta: item.meta,
          onOpen: () => setIndex(i),
        }))}
      />

      {current && index !== null && (
        <div
          ref={dialogRef}
          className={styles.viewer}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          tabIndex={-1}
        >
          <div className={styles.viewerHead}>
            <span className="mono">{dict.creativita.image}</span>
            <span className="mono">
              {String(index + 1).padStart(2, "0")} {String(items.length).padStart(2, "0")}
            </span>
            <button type="button" className={styles.viewerClose} onClick={close}>
              {dict.common.close}
            </button>
          </div>

          <div className={styles.viewerMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.title} />
          </div>

          <div className={styles.viewerBar}>
            <button type="button" className={styles.viewerNav} onClick={() => go(-1)}>
              {dict.creativita.previous}
            </button>
            <div className={styles.viewerMeta}>
              <strong>{current.title}</strong>
              {current.meta && <span className="mono">{current.meta}</span>}
            </div>
            <button type="button" className={styles.viewerNav} onClick={() => go(1)}>
              {dict.creativita.next}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
