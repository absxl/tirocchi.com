import { href, type Dictionary } from "@/lib/i18n";
import { ACCENT } from "@/lib/palette";
import type { Locale } from "@/lib/types";

export interface Room {
  id: string;
  label: string;
  desc: string;
  href: string;
  image: string;
  accent: string;
}

/**
 * Home chapters. Each section uses a distinct background image so no photo is
 * repeated: intro = black, Portfolio = portrait 2, Creatività = portrait 3,
 * About = portrait 1, Contatti = off-theme project image (2560×1440) shown last.
 */
export function buildRooms({ lang, dict }: { lang: Locale; dict: Dictionary }): Room[] {
  return [
    {
      id: "intro",
      label: dict.landing.name,
      desc: dict.landing.roleLine,
      href: href(lang, "home"),
      image: "/assets/sfondi/black.webp",
      accent: ACCENT.default,
    },
    {
      id: "lavori",
      label: dict.nav.lavori,
      desc: dict.landing.sectionDesc.lavori,
      href: href(lang, "lavori"),
      image: "/assets/sfondi/2.png",
      accent: ACCENT.lavori,
    },
    {
      id: "creativita",
      label: dict.nav.creativita,
      desc: dict.landing.sectionDesc.creativita,
      href: href(lang, "creativita"),
      image: "/assets/sfondi/3.png",
      accent: ACCENT.creativita,
    },
    {
      id: "about",
      label: dict.nav.about,
      desc: dict.landing.sectionDesc.about,
      href: href(lang, "about"),
      image: "/assets/sfondi/1.png",
      accent: ACCENT.about,
    },
    {
      id: "contatti",
      label: dict.nav.contatti,
      desc: dict.landing.sectionDesc.contatti,
      href: href(lang, "contatti"),
      image: "/assets/sfondi/black.webp",
      accent: ACCENT.contatti,
    },
  ];
}
