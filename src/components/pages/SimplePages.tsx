import Link from "next/link";
import { getDictionary, href } from "@/lib/i18n";
import type { Locale, SiteInfo } from "@/lib/types";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { SocialIcon } from "@/components/SocialIcon";
import { AboutPortrait } from "./AboutPortrait";
import styles from "./SimplePages.module.css";

const isPlaceholder = (value: string) => /\[.*\]/.test(value) || value.trim() === "";

export interface StripImage {
  image: string;
  title: string;
}

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

function SectionTitle({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <h2 className={styles.sectionTitle}>
      <span className={styles.sectionNo}>{no}</span>
      {children}
    </h2>
  );
}

export function AboutView({
  lang,
  site,
  strip,
}: {
  lang: Locale;
  site: SiteInfo;
  strip: StripImage[];
}) {
  const dict = getDictionary(lang);
  const socials = [
    { label: "Instagram", url: site.social.instagram },
    { label: "Behance", url: site.social.behance },
    { label: "LinkedIn", url: site.social.linkedin },
  ].filter((item) => item.url);

  return (
    <PageTransition>
      <div className={`container ${styles.wrap}`}>
        <Reveal as="header" className={styles.hero}>
          <div className={styles.heroText}>
            <span className="eyebrow">{dict.about.eyebrow}</span>
            <h1 className={styles.title}>{dict.about.title}</h1>
            <p className={styles.role}>
              {site.role} — {site.location}
            </p>
            <p className={styles.manifesto}>{dict.about.manifesto}</p>
          </div>
          <div className={styles.portrait}>
            <AboutPortrait alt={`Ritratto di ${site.name}`} />
          </div>
        </Reveal>

        <Reveal as="section" className={styles.section}>
          <SectionTitle no="01">{dict.about.profile}</SectionTitle>
          <p className={styles.lead}>{site.bio}</p>
        </Reveal>

        {site.experience.length > 0 && (
          <Reveal as="section" className={styles.section}>
            <SectionTitle no="02">{dict.about.experience}</SectionTitle>
            <ul className={styles.timeline}>
              {site.experience.map((entry) => (
                <li key={`${entry.period}-${entry.role}`} className={styles.timelineItem}>
                  <span className={`mono ${styles.period}`}>{entry.period}</span>
                  <div className={styles.timelineBody}>
                    <strong className={styles.timelineRole}>{entry.role}</strong>
                    {entry.detail && <p className={styles.entryDetail}>{entry.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {site.education.length > 0 && (
          <Reveal as="section" className={styles.section}>
            <SectionTitle no="03">{dict.about.education}</SectionTitle>
            <ul className={styles.timeline}>
              {site.education.map((entry) => (
                <li key={`${entry.year}-${entry.title}`} className={styles.timelineItem}>
                  <span className={`mono ${styles.period}`}>{entry.year}</span>
                  <div className={styles.timelineBody}>
                    <strong className={styles.timelineRole}>{entry.title}</strong>
                    {entry.institution && <p className={styles.entryDetail}>{entry.institution}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal as="section" className={styles.section}>
          <SectionTitle no="04">{dict.about.skills}</SectionTitle>
          <ul className={styles.skillCards}>
            {site.skills.map((skill) => (
              <li key={skill} className={styles.skillCard}>
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>

        {site.softSkills.length > 0 && (
          <Reveal as="section" className={styles.section}>
            <SectionTitle no="05">{dict.about.softSkills}</SectionTitle>
            <ul className={styles.softList}>
              {site.softSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal as="section" className={styles.section}>
          <SectionTitle no="06">{dict.about.contact}</SectionTitle>
          <EmailBlock lang={lang} site={site} />
          <nav className={styles.socialBig} aria-label={dict.contatti.social}>
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBigLink}
              >
                <SocialIcon label={item.label} size={26} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </Reveal>

        {strip.length > 0 && (
          <section className={styles.stripSection} aria-hidden="true">
            <div className={styles.strip}>
              {strip.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${item.image}-${i}`} src={item.image} alt="" loading="lazy" />
              ))}
            </div>
          </section>
        )}
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
