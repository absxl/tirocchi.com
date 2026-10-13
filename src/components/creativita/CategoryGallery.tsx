"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { GalleryItem } from "@/lib/gallery";
import { useDialog } from "@/lib/useDialog";
import { SmartImage } from "@/components/SmartImage";
import viewerStyles from "./Creativita.module.css";
import styles from "./CategoryGallery.module.css";

type ViewKey = "grid" | "list";

export function CategoryGallery({ lang, items }: { lang: Locale; items: GalleryItem[] }) {
  const dict = getDictionary(lang);
  const [view, setView] = useState<ViewKey>("grid");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    // One-time sync from the URL query into React state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v === "list" || v === "grid") setView(v);
  }, []);

  const changeView = (key: ViewKey) => {
    setView(key);
    const params = new URLSearchParams();
    if (key !== "grid") params.set("view", key);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  };

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
      <div className={styles.toolbar}>
        <div className={styles.views} role="group" aria-label={dict.progetto.gallery}>
          {(["grid", "list"] as ViewKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={styles.view}
              aria-pressed={view === key}
              onClick={() => changeView(key)}
            >
              {key === "grid" ? dict.lavori.viewGrid : dict.lavori.viewList}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={styles.card}
                onClick={() => setIndex(i)}
                aria-label={`${dict.creativita.openWork}: ${item.title}`}
              >
                <span className={styles.media}>
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    sizes="(min-width: 1200px) 20rem, (min-width: 640px) 45vw, 90vw"
                  />
                </span>
                {item.meta && <span className={`mono ${styles.meta}`}>{item.meta}</span>}
                <span className={styles.title}>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <li key={item.id}>
              <button type="button" className={styles.row} onClick={() => setIndex(i)}>
                <span className={`mono ${styles.rowNo}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.rowTitle}>{item.title}</span>
                {item.meta && <span className={`mono ${styles.rowMeta}`}>{item.meta}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {current && index !== null && (
        <div
          ref={dialogRef}
          className={viewerStyles.viewer}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          tabIndex={-1}
        >
          <div className={viewerStyles.viewerHead}>
            <span className="mono">{dict.creativita.image}</span>
            <span className="mono">
              {String(index + 1).padStart(2, "0")} {String(items.length).padStart(2, "0")}
            </span>
            <button type="button" className={viewerStyles.viewerClose} onClick={close}>
              {dict.common.close}
            </button>
          </div>

          <div className={viewerStyles.viewerMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.title} />
          </div>

          <div className={viewerStyles.viewerBar}>
            <button type="button" className={viewerStyles.viewerNav} onClick={() => go(-1)}>
              {dict.creativita.previous}
            </button>
            <div className={viewerStyles.viewerMeta}>
              <strong>{current.title}</strong>
              {current.meta && <span className="mono">{current.meta}</span>}
            </div>
            <button type="button" className={viewerStyles.viewerNav} onClick={() => go(1)}>
              {dict.creativita.next}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
