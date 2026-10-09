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
    play: "/play",
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
    play: "/en/play",
    about: "/en/about",
    contatti: "/en/contact",
    privacy: "/en/privacy",
    cookie: "/en/cookie-policy",
    noteLegali: "/en/legal-notes",
  },
} as const;

export type RouteKey = keyof (typeof routes)["it"];
export type NavKey = "lavori" | "creativita" | "play" | "about" | "contatti";

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
    lavori: "Lavori",
    creativita: "Creatività",
    play: "Play",
    about: "About",
    contatti: "Contatti",
  },
  common: {
    menu: "Menu",
    close: "Chiudi",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    back: "Indietro",
    backToTop: "Torna su",
    scrivimi: "Scrivimi",
    language: "Lingua",
    draft: "[DA REVISIONARE]",
  },
  landing: {
    sectionsLabel: "Sezioni",
    name: "MATTEO TIROCCHI",
    roleLine: "Art Director — ADV Portfolio",
    hintPointer: "Passa sul nome",
    hintTouch: "Tocca il nome",
    scrollHint: "Scorri",
    loading: "Caricamento",
    chapters: "Capitoli",
    sectionDesc: {
      lavori: "Campagne e progetti di art direction per brand e agenzie.",
      play: "Un piccolo videogioco: il processo creativo reso giocabile.",
      creativita: "Archivio personale tra AI art, cover, fotografia e video.",
      about: "Chi sono, cosa faccio e con chi ho lavorato.",
      contatti: "Email e social per progetti e collaborazioni.",
    },
    areas: {
      lavori: { no: "01", title: "Lavori", label: "Lavoro professionale" },
      play: { no: "02", title: "Play", label: "Un processo creativo" },
      creativita: { no: "03", title: "Creatività", label: "Archivio" },
    },
    panels: {
      lavori: "Lavori selezionati",
      play: "Play",
      creativita: "Creatività",
      about: "About",
      contatti: "Contatti",
    },
  },
  lavori: {
    eyebrow: "Selezione",
    title: "Lavori",
    intro: "Campagne e progetti di art direction. Filtra per categoria o cambia vista.",
    filters: { all: "Tutti", adv: "ADV", personal: "Personal", play: "Play" },
    viewGrid: "Griglia",
    viewList: "Lista",
    empty: "Nessun progetto in questa categoria.",
    openProject: "Vedi progetto",
    resultCount: (n: number) => `${n} ${n === 1 ? "progetto" : "progetti"}`,
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
    allProjects: "Tutti i lavori",
    gallery: "Galleria",
  },
  creativita: {
    eyebrow: "Archivio visivo",
    title: "Creatività",
    intro: "Ricerca personale tra AI, cover, fotografia, video ed esperimenti.",
    categoriesLabel: "Categorie",
    collection: "Collezione",
    works: "opere",
    openWork: "Apri",
    previous: "Precedente",
    next: "Successiva",
    backToCategories: "Categorie",
    image: "Immagine",
    video: "Video",
    empty: "Categoria in arrivo.",
  },
  play: {
    eyebrow: "Play",
    title: "Portfolio Rush",
    intro:
      "Un piccolo platformer: raccogli le idee e attraversa il livello. Un modo giocoso di entrare nel portfolio.",
    start: "Inizia",
    skip: "Vai ai lavori",
    exit: "Esci",
    restart: "Riprova",
    move: "A e D per muovere",
    jump: "Spazio Salta",
    ideas: "Idee",
    time: "Tempo",
    level: "Livello 01 — Brief",
    complete: "Obiettivo completato",
    completeBody: "Hai raccolto le idee del brief. Il prossimo progetto potremmo farlo insieme.",
    discover: "Scopri i lavori",
    statusReady:
      "Livello pronto. Muoviti con sinistra e destra; premi A o spazio per saltare.",
    touchHint: "Su touch usa i controlli in basso.",
  },
  about: {
    eyebrow: "Chi sono",
    title: "About",
    bio: "Bio",
    skills: "Competenze",
    awards: "Riconoscimenti",
    contact: "Contatti",
    draftNote: "Questa sezione è in attesa dei contenuti definitivi.",
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
    draftNote:
      "Testo segnaposto: da completare con i dati reali e far validare a un professionista.",
    privacy: {
      title: "Privacy Policy",
      body: "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR). Titolare del trattamento, finalità, base giuridica, destinatari, tempi di conservazione e diritti dell’interessato. [DA COMPILARE]",
    },
    cookie: {
      title: "Cookie Policy",
      body: "Informativa sull’uso dei cookie. Il sito non utilizza cookie di profilazione né tracker di terze parti. [DA COMPILARE]",
    },
    notes: {
      title: "Note legali",
      body: "Informazioni legali sul titolare del sito, sui contenuti e sulla proprietà intellettuale. [DA COMPILARE]",
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
    lavori: "Work",
    creativita: "Creativity",
    play: "Play",
    about: "About",
    contatti: "Contact",
  },
  common: {
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    back: "Back",
    backToTop: "Back to top",
    scrivimi: "Get in touch",
    language: "Language",
    draft: "[TO REVIEW]",
  },
  landing: {
    sectionsLabel: "Sections",
    name: "MATTEO TIROCCHI",
    roleLine: "Art Director — ADV Portfolio",
    hintPointer: "Hover the name",
    hintTouch: "Tap the name",
    scrollHint: "Scroll",
    loading: "Loading",
    chapters: "Chapters",
    sectionDesc: {
      lavori: "Advertising campaigns and art direction projects for brands and agencies.",
      play: "A small game: the creative process made playable.",
      creativita: "Personal archive across AI art, covers, photography and video.",
      about: "Who I am, what I do and who I worked with.",
      contatti: "Email and socials for projects and collaborations.",
    },
    areas: {
      lavori: { no: "01", title: "Work", label: "Professional work" },
      play: { no: "02", title: "Play", label: "A creative process" },
      creativita: { no: "03", title: "Creativity", label: "Archive" },
    },
    panels: {
      lavori: "Selected work",
      play: "Play",
      creativita: "Creativity",
      about: "About",
      contatti: "Contact",
    },
  },
  lavori: {
    eyebrow: "Selection",
    title: "Work",
    intro: "Advertising campaigns and art direction projects. Filter by category or switch view.",
    filters: { all: "All", adv: "ADV", personal: "Personal", play: "Play" },
    viewGrid: "Grid",
    viewList: "List",
    empty: "No projects in this category.",
    openProject: "View project",
    resultCount: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
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
    allProjects: "All work",
    gallery: "Gallery",
  },
  creativita: {
    eyebrow: "Visual archive",
    title: "Creativity",
    intro: "Personal research across AI, covers, photography, video and experiments.",
    categoriesLabel: "Categories",
    collection: "Collection",
    works: "works",
    openWork: "Open",
    previous: "Previous",
    next: "Next",
    backToCategories: "Categories",
    image: "Image",
    video: "Video",
    empty: "Category coming soon.",
  },
  play: {
    eyebrow: "Play",
    title: "Portfolio Rush",
    intro:
      "A small platformer: collect the ideas and cross the level. A playful way into the portfolio.",
    start: "Start",
    skip: "Go to work",
    exit: "Exit",
    restart: "Retry",
    move: "A and D to move",
    jump: "Space Jump",
    ideas: "Ideas",
    time: "Time",
    level: "Level 01 — Brief",
    complete: "Objective complete",
    completeBody: "You collected the brief’s ideas. The next project we could make together.",
    discover: "Discover the work",
    statusReady: "Level ready. Move with left and right; press A or space to jump.",
    touchHint: "On touch use the controls below.",
  },
  about: {
    eyebrow: "Who I am",
    title: "About",
    bio: "Bio",
    skills: "Skills",
    awards: "Awards",
    contact: "Contact",
    draftNote: "This section is waiting for final content.",
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
    draftNote:
      "Placeholder text: to be completed with real data and reviewed by a professional.",
    privacy: {
      title: "Privacy Policy",
      body: "Information on the processing of personal data under Regulation (EU) 2016/679 (GDPR). Data controller, purposes, legal basis, recipients, retention and data subject rights. [TO REVIEW]",
    },
    cookie: {
      title: "Cookie Policy",
      body: "Information on the use of cookies. This site does not use profiling cookies or third-party trackers. [TO REVIEW]",
    },
    notes: {
      title: "Legal notes",
      body: "Legal information about the site owner, the content and intellectual property. [TO REVIEW]",
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
  play: "play",
  about: "about",
  contatti: "contatti",
  privacy: "privacy",
  "cookie-policy": "cookie",
  "note-legali": "noteLegali",
};

const enSegmentToKey: Record<string, RouteKey> = {
  work: "lavori",
  creativity: "creativita",
  play: "play",
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
      /^\/(lavori|creativita|play|about|contatti|privacy|cookie-policy|note-legali)(?:\/(.+))?$/
    );
    if (!match) return routes[to].home;
    const key = itSegmentToKey[match[1]];
    const rest = match[2];
    return rest ? `${routes[to][key]}/${rest}` : routes[to][key];
  }
  const match = clean.match(
    /^\/en(?:\/(work|creativity|play|about|contact|privacy|cookie-policy|legal-notes)(?:\/(.+))?)?$/
  );
  if (!match) return routes[to].home;
  const key = match[1] ? enSegmentToKey[match[1]] : "home";
  const rest = match[2];
  if (key === "home") return routes[to].home;
  return rest ? `${routes[to][key]}/${rest}` : routes[to][key];
}
