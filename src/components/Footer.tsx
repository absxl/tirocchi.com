"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, href } from "@/lib/i18n";
import type { Locale, SiteInfo } from "@/lib/types";
import styles from "./Footer.module.css";

const isPlaceholder = (value: string) => /\[.*\]/.test(value) || value.trim() === "";

export function Footer({ lang, site }: { lang: Locale; site: SiteInfo }) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const emailValid = !isPlaceholder(site.email);
  const isHome = pathname === href(lang, "home");

  const socials = [
    { label: "Instagram", url: site.social.instagram },
    { label: "Behance", url: site.social.behance },
    { label: "LinkedIn", url: site.social.linkedin },
  ].filter((item) => item.url && !isPlaceholder(item.url));

  const legalRows = [
    { label: dict.footer.vat, value: site.legal.vat },
    { label: dict.footer.taxCode, value: site.legal.taxCode },
    { label: dict.footer.address, value: site.legal.address },
    { label: dict.footer.pec, value: site.legal.pec },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.block}>
          <span className="eyebrow">{dict.contatti.email}</span>
          {emailValid ? (
            <a className={styles.email} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : (
            <span className={styles.placeholder}>{site.email}</span>
          )}
        </div>

        {!isHome && (
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
        )}

        <section className={styles.legal} aria-label={dict.footer.legalTitle}>
          <span className="eyebrow">{dict.footer.legalTitle}</span>
          <ul className={styles.legalList}>
            {legalRows.map((row) => (
              <li key={row.label}>
                <span className="mono">{row.label}</span>
                <span className={isPlaceholder(row.value) ? styles.placeholder : undefined}>
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
          <nav className={styles.legalLinks}>
            <Link href={href(lang, "privacy")}>{dict.footer.privacy}</Link>
            <Link href={href(lang, "cookie")}>{dict.footer.cookie}</Link>
            <Link href={href(lang, "noteLegali")}>{dict.footer.legalNotes}</Link>
          </nav>
        </section>

        <p className={styles.credit}>
          {dict.footer.creditLabel}{" "}
          <a href="https://carletti.work" target="_blank" rel="noopener noreferrer">
            Marcello Carletti
          </a>{" "}
          ·{" "}
          <a href="https://carletti.work" target="_blank" rel="noopener noreferrer">
            carletti.work
          </a>{" "}
          ·{" "}
          <a href="mailto:marcello@carletti.work">marcello@carletti.work</a>
        </p>

        <div className={styles.meta}>
          <span className="mono">
            © {year} {site.name}. {dict.footer.rights}
          </span>
          <Link href={href(lang, "home")} className={`mono ${styles.top}`}>
            {dict.common.backToTop}
          </Link>
        </div>
      </div>
    </footer>
  );
}
