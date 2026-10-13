"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  getDictionary,
  href,
  locales,
  switchLocaleHref,
  type NavKey,
  type RouteKey,
} from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useDialog } from "@/lib/useDialog";
import { useScrolledPast } from "@/lib/useScrolledPast";
import { useScrollProgress } from "@/lib/useScrollProgress";
import styles from "./Header.module.css";

const NAV_KEYS: NavKey[] = ["lavori", "creativita", "about", "contatti"];

export function Header({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === href(lang, "home");
  const revealed = useScrolledPast(0.12);

  useScrollProgress(headerRef, isHome && !menuOpen);
  useDialog(menuOpen, () => setMenuOpen(false), panelRef);

  const hidden = isHome && !revealed && !menuOpen;

  const isActive = (key: RouteKey) => {
    const target = href(lang, key);
    if (key === "home") return pathname === target;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isHome ? styles.fixed : ""}`}
      style={{ viewTransitionName: "site-header" }}
      inert={hidden}
      aria-hidden={hidden || undefined}
    >
      <div className={styles.inner}>
        <Link href={href(lang, "home")} className={styles.brand}>
          <span className={styles.brandName}>{dict.landing.name}</span>
          <span className={styles.brandRole}>{dict.landing.roleLine}</span>
        </Link>

        <nav className={styles.nav} aria-label={dict.common.menu}>
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={href(lang, key)}
              className={styles.navLink}
              aria-current={isActive(key) ? "page" : undefined}
              transitionTypes={["nav-forward"]}
            >
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.lang} role="group" aria-label={dict.common.language}>
            {locales.map((code) => (
              <Link
                key={code}
                href={switchLocaleHref(pathname, lang, code)}
                className={styles.langLink}
                aria-current={code === lang ? "true" : undefined}
                lang={code}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>

          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? dict.common.closeMenu : dict.common.menu}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="site-menu"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.menu}
          tabIndex={-1}
        >
          <nav className={styles.panelNav} aria-label={dict.common.menu}>
            {NAV_KEYS.map((key, index) => (
              <Link
                key={key}
                href={href(lang, key)}
                className={styles.panelLink}
                aria-current={isActive(key) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                transitionTypes={["nav-forward"]}
              >
                <span className={`mono ${styles.panelIndex}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {dict.nav[key]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
