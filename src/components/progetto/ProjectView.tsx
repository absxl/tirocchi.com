import Link from "next/link";
import { getDictionary, href, projectHref } from "@/lib/i18n";
import type { Locale, MediaItem, Project } from "@/lib/types";
import { SmartImage } from "@/components/SmartImage";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./ProjectView.module.css";

interface Neighbour {
  slug: string;
  client: string;
  title: string;
}

export function ProjectView({
  lang,
  project,
  previous,
  next,
}: {
  lang: Locale;
  project: Project;
  previous: Neighbour;
  next: Neighbour;
}) {
  const dict = getDictionary(lang);
  const facts = [
    { label: dict.progetto.year, value: project.year },
    { label: dict.progetto.client, value: project.client },
    { label: dict.progetto.type, value: project.category },
    { label: dict.progetto.role, value: project.role },
    { label: dict.progetto.formats, value: project.formats },
  ].filter((item) => item.value);

  return (
    <PageTransition>
      <article className={styles.project}>
      <header className={`container ${styles.head}`}>
        <span className="eyebrow">
          {project.client} — {project.category}
        </span>
        <h1 className={styles.title}>
          {project.titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < project.titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        {project.intro && <p className={styles.lead}>{project.intro}</p>}
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className="mono">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className={`container ${styles.hero}`}>
        <SmartImage
          src={project.hero}
          alt={project.coverAlt}
          sizes="100vw"
          priority
        />
      </figure>

      <Reveal className={`container ${styles.body}`}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.progetto.context}</h2>
          <p>{project.context}</p>
        </section>
        {project.insight && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.progetto.insight}</h2>
            <p>{project.insight}</p>
          </section>
        )}
        {project.idea && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.progetto.idea}</h2>
            <p>{project.idea}</p>
          </section>
        )}

        <div className={styles.gallery}>
          {project.media.map((item, index) => (
            <Media key={index} item={item} />
          ))}
        </div>

        {project.execution && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.progetto.execution}</h2>
            <p>{project.execution}</p>
          </section>
        )}

        {project.credits.length > 0 && (
          <section className={styles.credits}>
            <h2 className={styles.sectionTitle}>{dict.progetto.credits}</h2>
            <ul>
              {project.credits.map((credit) => (
                <li key={credit}>{credit}</li>
              ))}
            </ul>
          </section>
        )}
      </Reveal>

      <nav className={`container ${styles.nav}`} aria-label={dict.lavori.title}>
        <Link href={projectHref(lang, previous.slug)} className={styles.navItem}>
          <span className="mono">
            {dict.progetto.previous}
          </span>
          <strong>{previous.client}</strong>
          <span>{previous.title}</span>
        </Link>
        <Link href={href(lang, "lavori")} className={styles.navAll}>
          {dict.progetto.allProjects}
        </Link>
        <Link href={projectHref(lang, next.slug)} className={`${styles.navItem} ${styles.navNext}`}>
          <span className="mono">{dict.progetto.next}</span>
          <strong>{next.client}</strong>
          <span>{next.title}</span>
        </Link>
      </nav>
      </article>
    </PageTransition>
  );
}

function Media({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <figure className={styles.media}>
        <video controls playsInline preload="metadata" poster={item.poster} aria-label={item.alt}>
          <source src={item.src} type="video/mp4" />
          {item.alt}
        </video>
      </figure>
    );
  }
  return (
    <figure className={styles.media}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
    </figure>
  );
}
