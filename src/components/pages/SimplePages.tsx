import Link from "next/link";
import { getDictionary, href } from "@/lib/i18n";
import type { Locale, SiteInfo } from "@/lib/types";
import { PageTransition } from "@/components/motion/PageTransition";
import styles from "./SimplePages.module.css";

const isPlaceholder = (value: string) => /\[.*\]/.test(value) || value.trim() === "";

function SocialList({ lang, site }: { lang: Locale; site: SiteInfo }) {
  const dict = getDictionary(lang);
  const socials = [
    { label: "Instagram", url: site.social.instagram },
    { label: "Behance", url: site.social.behance },
    { label: "LinkedIn", url: site.social.linkedin },
  ].filter((item) => item.url);
  return (
    <nav className={styles.social} aria-label={dict.contatti.social}>
      {socials.map((item) => (
        <a
          key={item.label}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`link-underline ${styles.socialLink}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function EmailBlock({ lang, site }: { lang: Locale; site: SiteInfo }) {
  const dict = getDictionary(lang);
  return (
    <div className={styles.block}>
      <span className="eyebrow">{dict.contatti.email}</span>
      {isPlaceholder(site.email) ? (
        <span className={styles.placeholder}>{site.email}</span>
      ) : (
        <a className={styles.email} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      )}
    </div>
  );
}

export function AboutView({ lang, site }: { lang: Locale; site: SiteInfo }) {
  const dict = getDictionary(lang);

  return (
    <PageTransition>
      <div className={`container ${styles.wrap}`}>
        <header className={styles.head}>
          <span className="eyebrow">{dict.about.eyebrow}</span>
          <h1 className={styles.title}>{dict.about.title}</h1>
          <p className={styles.role}>
            {site.role} — {site.location}
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.profile}</h2>
          <p className={styles.lead}>{site.bio}</p>
        </section>

        {site.experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.about.experience}</h2>
            <ul className={styles.entries}>
              {site.experience.map((entry) => (
                <li key={`${entry.period}-${entry.role}`} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <span className="mono">{entry.period}</span>
                    <strong>{entry.role}</strong>
                  </div>
                  {entry.detail && <p className={styles.entryDetail}>{entry.detail}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {site.education.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.about.education}</h2>
            <ul className={styles.entries}>
              {site.education.map((entry) => (
                <li key={`${entry.year}-${entry.title}`} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <span className="mono">{entry.year}</span>
                    <strong>{entry.title}</strong>
                  </div>
                  {entry.institution && <p className={styles.entryDetail}>{entry.institution}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.skills}</h2>
          <ul className={styles.tags}>
            {site.skills.map((skill) => (
              <li key={skill} className={isPlaceholder(skill) ? styles.placeholder : undefined}>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {site.softSkills.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.about.softSkills}</h2>
            <ul className={styles.tags}>
              {site.softSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {site.awards.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{dict.about.awards}</h2>
            <ul className={styles.awards}>
              {site.awards.map((award) => (
                <li key={`${award.year}-${award.title}`}>
                  <span className="mono">{award.year}</span>
                  <strong>{award.title}</strong>
                  <span>{award.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.contact}</h2>
          <EmailBlock lang={lang} site={site} />
        </section>
      </div>
    </PageTransition>
  );
}

export function ContactView({ lang, site }: { lang: Locale; site: SiteInfo }) {
  const dict = getDictionary(lang);
  return (
    <PageTransition>
      <div className={`container ${styles.wrap} ${styles.contact}`}>
        <header className={styles.head}>
          <span className="eyebrow">{dict.contatti.eyebrow}</span>
          <h1 className={styles.title}>{dict.contatti.title}</h1>
          <p className={styles.lead}>{dict.contatti.intro}</p>
        </header>

        <EmailBlock lang={lang} site={site} />
        <SocialList lang={lang} site={site} />

        <Link href={href(lang, "lavori")} className={styles.backLink}>
          {dict.lavori.title}
        </Link>
      </div>
    </PageTransition>
  );
}
