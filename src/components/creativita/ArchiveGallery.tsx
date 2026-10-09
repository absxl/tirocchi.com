"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { ArchiveItem, Locale } from "@/lib/types";
import { useDialog } from "@/lib/useDialog";
import { SmartImage } from "@/components/SmartImage";
import styles from "./Creativita.module.css";

export function ArchiveGallery({
  lang,
  items,
}: {
  lang: Locale;
  items: ArchiveItem[];
}) {
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
      <ul className={styles.gallery}>
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className={styles.galleryItem}
              onClick={() => setIndex(i)}
              aria-label={`${dict.creativita.openWork}: ${item.title}`}
            >
              <SmartImage
                src={item.thumb ?? item.image ?? ""}
                alt={item.title}
                sizes="(min-width: 1200px) 13rem, 45vw"
              />
              {item.type === "video" && (
                <span className={styles.playMark} aria-hidden="true">
                  ▶
                </span>
              )}
              <span className={styles.galleryTitle}>{item.title}</span>
            </button>
          </li>
        ))}
      </ul>

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
            <span className="mono">
              {current.type === "video" ? dict.creativita.video : dict.creativita.image}
            </span>
            <span className="mono">
              {String(index + 1).padStart(2, "0")} {String(items.length).padStart(2, "0")}
            </span>
            <button type="button" className={styles.viewerClose} onClick={close}>
              {dict.common.close}
            </button>
          </div>

          <div className={styles.viewerMedia}>
            {current.type === "video" && current.video ? (
              <video
                src={current.video}
                poster={current.thumb ?? current.image}
                controls
                playsInline
                preload="metadata"
                aria-label={current.title}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.image} alt={current.title} />
            )}
          </div>

          <div className={styles.viewerBar}>
            <button type="button" className={styles.viewerNav} onClick={() => go(-1)}>
              {dict.creativita.previous}
            </button>
            <div className={styles.viewerMeta}>
              <strong>{current.title}</strong>
              <span className="mono">
                {current.year} · {current.role}
              </span>
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
