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
  const isHome = pathname === href(lang, "home");
  const isContact = pathname === href(lang, "contatti");
  const isAbout = pathname === href(lang, "about");
  const hideSocial = isHome || isContact || isAbout;

  const socials = [
    { label: "Instagram", url: site.social.instagram },
    { label: "Behance", url: site.social.behance },
    { label: "LinkedIn", url: site.social.linkedin },
  ].filter((item) => item.url && !isPlaceholder(item.url));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {!hideSocial && (
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

        <nav className={styles.legalLinks} aria-label={dict.footer.legalTitle}>
          <Link href={href(lang, "privacy")}>{dict.footer.privacy}</Link>
          <Link href={href(lang, "cookie")}>{dict.footer.cookie}</Link>
          <Link href={href(lang, "noteLegali")}>{dict.footer.legalNotes}</Link>
        </nav>

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
