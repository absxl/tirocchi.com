import type { Locale } from "./types";

export const locales = ["it", "en"] as const;
export const defaultLocale: Locale = "it";

export const localeName: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
};

export const routes = {
  it: {
    home: "/",
    lavori: "/lavori",
    creativita: "/creativita",
    about: "/about",
    contatti: "/contatti",
    privacy: "/privacy",
    cookie: "/cookie-policy",
    noteLegali: "/note-legali",
  },
  en: {
    home: "/en",
    lavori: "/en/work",
    creativita: "/en/creativity",
    about: "/en/about",
    contatti: "/en/contact",
    privacy: "/en/privacy",
    cookie: "/en/cookie-policy",
    noteLegali: "/en/legal-notes",
  },
} as const;

export type RouteKey = keyof (typeof routes)["it"];
export type NavKey = "lavori" | "creativita" | "about" | "contatti";

export function href(lang: Locale, key: RouteKey): string {
  return routes[lang][key];
}

export function projectHref(lang: Locale, slug: string): string {
  return `${routes[lang].lavori}/${slug}`;
}

export function categoryHref(lang: Locale, slug: string): string {
  return `${routes[lang].creativita}/${slug}`;
}

const it = {
  code: "it",
  htmlLang: "it",
  nav: {
    lavori: "ADV Portfolio",
    creativita: "Creatività",
    about: "Chi sono",
    contatti: "Contact Me",
  },
  common: {
    menu: "Menu",
    close: "Chiudi",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    backToTop: "Torna su",
    language: "Lingua",
  },
  landing: {
    name: "MATTEO TIROCCHI",
    roleLine: "Art Director — ADV Portfolio",
    scrollHint: "Scorri",
    chapters: "Capitoli",
    explore: "Esplora",
    sectionDesc: {
      lavori: "Campagne e progetti di art direction per brand e agenzie.",
      creativita: "Archivio personale tra AI art, cover, fotografia e video.",
      about: "Chi sono, cosa faccio e con chi ho lavorato.",
      contatti: "Email e social per progetti e collaborazioni.",
    },
  },
  lavori: {
    title: "ADV Portfolio",
    intro: "Campagne e progetti di art direction.",
    viewGrid: "Griglia",
    viewList: "Lista",
    empty: "Nessun progetto in questa categoria.",
  },
  progetto: {
    role: "Il mio ruolo",
    formats: "Formati",
    context: "Contesto",
    insight: "Insight",
    idea: "Idea",
    execution: "Sviluppo",
    credits: "Crediti",
    year: "Anno",
    client: "Cliente",
    type: "Tipo",
    previous: "Precedente",
    next: "Successivo",
    allProjects: "Tutti i progetti",
    gallery: "Galleria",
  },
  creativita: {
    eyebrow: "Archivio visivo",
    title: "Creatività",
    intro: "Ricerca personale tra AI, cover, fotografia e video.",
    categoriesLabel: "Categorie",
    collection: "Collezione",
    reelHint: "Muovi il cursore per esplorare",
    works: "opere",
    openWork: "Apri",
    previous: "Precedente",
    next: "Successiva",
    backToCategories: "Categorie",
    image: "Immagine",
    empty: "Nessuna opera.",
  },
  about: {
    eyebrow: "Chi sono",
    title: "Chi sono",
    manifesto: "Comunicazione visiva, dal concept alla produzione finale.",
    profile: "Profilo",
    experience: "Esperienza professionale",
    education: "Istruzione e formazione",
    skills: "Competenze tecniche",
    softSkills: "Competenze trasversali",
    awards: "Riconoscimenti",
    contact: "Contatti",
  },
  contatti: {
    eyebrow: "Contatti",
    title: "Contatti",
    intro: "Scrivimi per progetti, collaborazioni e art direction.",
    email: "Email",
    social: "Social",
  },
  footer: {
    rights: "Tutti i diritti riservati",
    legalTitle: "Informazioni legali",
    vat: "P. IVA",
    taxCode: "C.F.",
    address: "Sede legale",
    pec: "PEC",
    privacy: "Privacy Policy",
    cookie: "Cookie Policy",
    legalNotes: "Note legali",
    creditLabel: "Sito realizzato da",
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      body: "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).",
    },
    cookie: {
      title: "Cookie Policy",
      body: "Il sito non utilizza cookie di profilazione né tracker di terze parti.",
    },
    notes: {
      title: "Note legali",
      body: "Informazioni legali sul titolare del sito, sui contenuti e sulla proprietà intellettuale.",
    },
  },
  notFound: {
    title: "Pagina non trovata",
    body: "La pagina che cerchi non esiste o è stata spostata.",
    home: "Torna alla home",
  },
};

const en: typeof it = {
  code: "en",
  htmlLang: "en",
  nav: {
    lavori: "ADV Portfolio",
    creativita: "Creativity",
    about: "About",
    contatti: "Contact Me",
  },
  common: {
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "Back to top",
    language: "Language",
  },
  landing: {
    name: "MATTEO TIROCCHI",
    roleLine: "Art Director — ADV Portfolio",
    scrollHint: "Scroll",
    chapters: "Chapters",
    explore: "Explore",
    sectionDesc: {
      lavori: "Advertising campaigns and art direction projects for brands and agencies.",
      creativita: "Personal archive across AI art, covers, photography and video.",
      about: "Who I am, what I do and who I worked with.",
      contatti: "Email and socials for projects and collaborations.",
    },
  },
  lavori: {
    title: "ADV Portfolio",
    intro: "Advertising campaigns and art direction projects.",
    viewGrid: "Grid",
    viewList: "List",
    empty: "No projects in this category.",
  },
  progetto: {
    role: "My role",
    formats: "Formats",
    context: "Context",
    insight: "Insight",
    idea: "Idea",
    execution: "Development",
    credits: "Credits",
    year: "Year",
    client: "Client",
    type: "Type",
    previous: "Previous",
    next: "Next",
    allProjects: "All projects",
    gallery: "Gallery",
  },
  creativita: {
    eyebrow: "Visual archive",
    title: "Creativity",
    intro: "Personal research across AI, covers, photography and video.",
    categoriesLabel: "Categories",
    collection: "Collection",
    reelHint: "Move the cursor to explore",
    works: "works",
    openWork: "Open",
    previous: "Previous",
    next: "Next",
    backToCategories: "Categories",
    image: "Image",
    empty: "No works.",
  },
  about: {
    eyebrow: "Who I am",
    title: "About",
    manifesto: "Visual communication, from concept to final production.",
    profile: "Profile",
    experience: "Professional experience",
    education: "Education and training",
    skills: "Technical skills",
    softSkills: "Soft skills",
    awards: "Awards",
    contact: "Contact",
  },
  contatti: {
    eyebrow: "Contact",
    title: "Contact",
    intro: "Get in touch for projects, collaborations and art direction.",
    email: "Email",
    social: "Social",
  },
  footer: {
    rights: "All rights reserved",
    legalTitle: "Legal information",
    vat: "VAT",
    taxCode: "Tax code",
    address: "Registered office",
    pec: "Certified email",
    privacy: "Privacy Policy",
    cookie: "Cookie Policy",
    legalNotes: "Legal notes",
    creditLabel: "Website by",
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      body: "Information on the processing of personal data under Regulation (EU) 2016/679 (GDPR).",
    },
    cookie: {
      title: "Cookie Policy",
      body: "This site does not use profiling cookies or third-party trackers.",
    },
    notes: {
      title: "Legal notes",
      body: "Legal information about the site owner, the content and intellectual property.",
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    home: "Back to home",
  },
};

export const dictionaries = { it, en } as const;

export type Dictionary = typeof it;

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang] as Dictionary;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const itSegmentToKey: Record<string, RouteKey> = {
  lavori: "lavori",
  creativita: "creativita",
  about: "about",
  contatti: "contatti",
  privacy: "privacy",
  "cookie-policy": "cookie",
  "note-legali": "noteLegali",
};

const enSegmentToKey: Record<string, RouteKey> = {
  work: "lavori",
  creativity: "creativita",
  about: "about",
  contact: "contatti",
  privacy: "privacy",
  "cookie-policy": "cookie",
  "legal-notes": "noteLegali",
};

export function switchLocaleHref(pathname: string, from: Locale, to: Locale): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (from === "it") {
    const match = clean.match(
      /^\/(lavori|creativita|about|contatti|privacy|cookie-policy|note-legali)(?:\/(.+))?$/
    );
    if (!match) return routes[to].home;
    const key = itSegmentToKey[match[1]];
    const rest = match[2];
    return rest ? `${routes[to][key]}/${rest}` : routes[to][key];
  }
  const match = clean.match(
    /^\/en(?:\/(work|creativity|about|contact|privacy|cookie-policy|legal-notes)(?:\/(.+))?)?$/
  );
  if (!match) return routes[to].home;
  const key = match[1] ? enSegmentToKey[match[1]] : "home";
  const rest = match[2];
  if (key === "home") return routes[to].home;
  return rest ? `${routes[to][key]}/${rest}` : routes[to][key];
}
