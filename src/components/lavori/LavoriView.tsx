"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary, projectHref } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { SmartImage } from "@/components/SmartImage";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./LavoriView.module.css";

export interface LavoriProject {
  slug: string;
  no: string;
  client: string;
  title: string;
  year: string;
  category: string;
  group: string;
  cover: string;
  coverAlt: string;
  role: string;
}

type ViewKey = "grid" | "list";

export function LavoriView({ lang, projects }: { lang: Locale; projects: LavoriProject[] }) {
  const dict = getDictionary(lang);
  const [view, setView] = useState<ViewKey>("grid");
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const finePointer = useRef(false);

  useEffect(() => {
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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

  const onCardMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!finePointer.current) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    element.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    element.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
    element.style.setProperty("--ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
  };

  const onCardLeave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
  };

  return (
    <PageTransition>
      <div className={`container ${styles.wrap}`}>
        <Reveal as="header" className={styles.head}>
          <h1 className={styles.title}>{dict.lavori.title}</h1>
          <p className={styles.intro}>{dict.lavori.intro}</p>
        </Reveal>

        <div className={styles.toolbar}>
          <div className={styles.views} role="group" aria-label={dict.lavori.title}>
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

        {projects.length === 0 ? (
          <p className={styles.empty}>{dict.lavori.empty}</p>
        ) : view === "grid" ? (
          <Reveal as="ul" className={styles.grid} stagger>
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={projectHref(lang, project.slug)}
                  className={styles.card}
                  onPointerMove={onCardMove}
                  onPointerLeave={onCardLeave}
                >
                  <span className={styles.cardMedia}>
                    <SmartImage
                      src={project.cover}
                      alt={project.coverAlt}
                      sizes="(min-width: 1200px) 20rem, (min-width: 640px) 45vw, 90vw"
                    />
                  </span>
                  <span className={`mono ${styles.cardMeta}`}>
                    {project.client} · {project.year}
                  </span>
                  <span className={styles.cardTitle}>{project.title}</span>
                </Link>
              </li>
            ))}
          </Reveal>
        ) : (
          <ul
            className={styles.list}
            onMouseMove={(event) => {
              if (!finePointer.current) return;
              setPointer({ x: event.clientX, y: event.clientY });
            }}
          >
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={projectHref(lang, project.slug)}
                  className={styles.row}
                  onMouseEnter={() =>
                    finePointer.current && setPreview({ src: project.cover, alt: project.coverAlt })
                  }
                  onMouseLeave={() => setPreview(null)}
                  onFocus={() => finePointer.current && setPreview({ src: project.cover, alt: project.coverAlt })}
                  onBlur={() => setPreview(null)}
                >
                  <span className={`mono ${styles.rowNo}`}>{project.no}</span>
                  <span className={styles.rowClient}>{project.client}</span>
                  <span className={styles.rowTitle}>{project.title}</span>
                  <span className={`mono ${styles.rowYear}`}>{project.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {view === "list" && preview && (
          <div
            className={styles.preview}
            aria-hidden="true"
            style={{ transform: `translate3d(${pointer.x + 24}px, ${pointer.y + 24}px, 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.src} alt="" />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
