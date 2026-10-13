"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary, projectHref } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { Slideshow } from "@/components/gallery/Slideshow";
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

type ViewKey = "gallery" | "list";

export function LavoriView({ lang, projects }: { lang: Locale; projects: LavoriProject[] }) {
  const dict = getDictionary(lang);
  const [view, setView] = useState<ViewKey>("gallery");
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const finePointer = useRef(false);

  useEffect(() => {
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const v = new URLSearchParams(window.location.search).get("view");
    // One-time sync from the URL query into React state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v === "list" || v === "gallery") setView(v);
  }, []);

  const changeView = (key: ViewKey) => {
    setView(key);
    const params = new URLSearchParams();
    if (key !== "gallery") params.set("view", key);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
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
            {(["gallery", "list"] as ViewKey[]).map((key) => (
              <button
                key={key}
                type="button"
                className={styles.view}
                aria-pressed={view === key}
                onClick={() => changeView(key)}
              >
                {key === "gallery" ? dict.lavori.viewGrid : dict.lavori.viewList}
              </button>
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          <p className={styles.empty}>{dict.lavori.empty}</p>
        ) : view === "gallery" ? (
          <Slideshow
            label={dict.lavori.title}
            prevLabel={dict.progetto.previous}
            nextLabel={dict.progetto.next}
            sizes="(min-width: 768px) 46vw, 92vw"
            items={projects.map((project) => ({
              id: project.slug,
              image: project.cover,
              alt: project.coverAlt,
              title: project.title,
              meta: `${project.client} · ${project.year}`,
              href: projectHref(lang, project.slug),
            }))}
          />
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
