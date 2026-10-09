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

interface ProjectLike {
  slug: string;
  client: string;
  title: string;
  cover: string;
  hero?: string;
}

interface CategoryLike {
  slug: string;
  title: string;
  cover: string;
}

export function buildRooms({
  lang,
  projects,
  categories,
  dict,
}: {
  lang: Locale;
  projects: ProjectLike[];
  categories: CategoryLike[];
  dict: Dictionary;
}): Room[] {
  const introImage =
    projects[0]?.hero ??
    projects[0]?.cover ??
    categories[0]?.cover ??
    "/assets/personal-cover-ai-shooting.jpg";

  return [
    {
      id: "intro",
      label: dict.landing.name,
      desc: dict.landing.roleLine,
      href: href(lang, "home"),
      image: introImage,
      accent: ACCENT.default,
    },
    {
      id: "lavori",
      label: dict.nav.lavori,
      desc: dict.landing.sectionDesc.lavori,
      href: href(lang, "lavori"),
      image: projects[0]?.hero ?? projects[0]?.cover ?? introImage,
      accent: ACCENT.lavori,
    },
    {
      id: "play",
      label: dict.nav.play,
      desc: dict.landing.sectionDesc.play,
      href: href(lang, "play"),
      image: "/assets/level-01-sheet.png",
      accent: ACCENT.play,
    },
    {
      id: "creativita",
      label: dict.nav.creativita,
      desc: dict.landing.sectionDesc.creativita,
      href: href(lang, "creativita"),
      image: categories[0]?.cover ?? introImage,
      accent: ACCENT.creativita,
    },
    {
      id: "about",
      label: dict.nav.about,
      desc: dict.landing.sectionDesc.about,
      href: href(lang, "about"),
      image: "/assets/personal-cover-photography.png",
      accent: ACCENT.about,
    },
    {
      id: "contatti",
      label: dict.nav.contatti,
      desc: dict.landing.sectionDesc.contatti,
      href: href(lang, "contatti"),
      image: "/assets/personal-cover-ai-shooting.jpg",
      accent: ACCENT.contatti,
    },
  ];
}
