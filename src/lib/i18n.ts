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
    updated: "Ultimo aggiornamento: 13 ottobre 2026",
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          title: "Titolare del trattamento",
          body: "Il titolare del trattamento è Matteo Tirocchi. Per qualsiasi richiesta relativa ai dati personali puoi scrivere a matteo@tirocchi.com.",
        },
        {
          title: "Dati trattati",
          body: "Questo sito non utilizza form di contatto, cookie di profilazione o strumenti di tracciamento. I dati personali possono essere trattati in due casi: dati di navigazione (indirizzo IP, tipo di browser e dispositivo, data e ora della visita) registrati automaticamente dai log del servizio di hosting per finalità di sicurezza e funzionamento; dati forniti volontariamente, se ci scrivi via email (indirizzo e contenuto del messaggio).",
        },
        {
          title: "Finalità e base giuridica",
          body: "I dati di navigazione sono trattati per garantire sicurezza e corretto funzionamento del sito (legittimo interesse, art. 6.1.f GDPR). I dati inviati via email sono trattati per rispondere alla richiesta (esecuzione di un contratto o di misure precontrattuali, art. 6.1.b, o legittimo interesse, art. 6.1.f).",
        },
        {
          title: "Modalità e hosting",
          body: "Il sito è statico ed è ospitato su Cloudflare Pages (Cloudflare, Inc.). Il provider può trattare i dati di log per erogare il servizio e garantirne la sicurezza. Il trattamento avviene con strumenti informatici e misure di sicurezza adeguate.",
        },
        {
          title: "Cookie",
          body: "Il sito non utilizza cookie di profilazione né tracker di terze parti; sono utilizzabili solo eventuali cookie tecnici necessari. Per i dettagli vedi la Cookie Policy.",
        },
        {
          title: "Conservazione",
          body: "I dati di navigazione sono conservati per il tempo previsto dal provider di hosting e comunque per il tempo necessario alle finalità di sicurezza. I messaggi email sono conservati fino alla gestione della richiesta e per il tempo necessario a tutelare i diritti.",
        },
        {
          title: "Destinatari",
          body: "I dati possono essere trattati dal provider di hosting (Cloudflare) e, per le email, dal fornitore del servizio di posta. Non sono utilizzati servizi di analytics o pubblicità e i dati non sono ceduti a terzi per finalità di marketing.",
        },
        {
          title: "Trasferimenti extra-UE",
          body: "Eventuali trasferimenti di dati al di fuori dello Spazio Economico Europeo avvengono nel rispetto del GDPR e con garanzie adeguate adottate dal provider (ad esempio clausole contrattuali standard).",
        },
        {
          title: "Diritti dell’interessato",
          body: "Puoi esercitare i diritti previsti dagli artt. 15–22 del GDPR (accesso, rettifica, cancellazione, limitazione, opposizione, portabilità) scrivendo a matteo@tirocchi.com. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).",
        },
        {
          title: "Link a siti terzi",
          body: "Il sito contiene link a piattaforme esterne (Instagram, Behance, LinkedIn). Non siamo responsabili dei loro contenuti né dei trattamenti di dati che effettuano; ti invitiamo a consultare le loro informative.",
        },
        {
          title: "Modifiche",
          body: "Questa informativa può essere aggiornata nel tempo; la versione vigente è quella pubblicata su questa pagina.",
        },
      ],
    },
    cookie: {
      title: "Cookie Policy",
      sections: [
        {
          title: "Cosa sono i cookie",
          body: "I cookie sono piccoli file di testo che i siti visitati inviano al browser dell’utente.",
        },
        {
          title: "Cookie utilizzati",
          body: "Questo sito non utilizza cookie di profilazione né cookie di terze parti per il tracciamento. Possono essere utilizzati solo cookie tecnici necessari al corretto funzionamento.",
        },
        {
          title: "Gestione",
          body: "Puoi gestire o disabilitare i cookie dalle impostazioni del tuo browser.",
        },
      ],
    },
    notes: {
      title: "Note legali",
      sections: [
        {
          title: "Titolare del sito",
          body: "Il sito tirocchi.com è un portfolio personale di Matteo Tirocchi.",
        },
        {
          title: "Copyright",
          body: "Tutti i contenuti del sito — testi, immagini, grafica, progetti e marchi — sono protetti dal diritto d’autore e appartengono a Matteo Tirocchi o ai rispettivi titolari. È vietata la riproduzione, distribuzione o riutilizzo senza autorizzazione scritta.",
        },
        {
          title: "Proprietà intellettuale dei progetti",
          body: "I progetti e le campagne presentati appartengono ai clienti e ai committenti per cui sono stati realizzati. I marchi e i loghi citati appartengono ai rispettivi proprietari e sono mostrati solo a fini illustrativi e di portfolio.",
        },
        {
          title: "Esclusione di responsabilità",
          body: "I contenuti sono forniti «così come sono», senza garanzie di completezza o aggiornamento. Il sito non è responsabile di eventuali danni derivanti dall’uso delle informazioni contenute. I link esterni non sono controllati e non ne garantiamo contenuti o disponibilità.",
        },
        {
          title: "Uso consentito",
          body: "Il sito è destinato alla consultazione personale. Non è consentito l’uso dei contenuti per finalità commerciali senza autorizzazione.",
        },
        {
          title: "Legge applicabile",
          body: "Il sito è regolato dalla legge italiana. Per ogni controversia è competente il foro di Roma.",
        },
      ],
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
    updated: "Last updated: 13 October 2026",
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          title: "Data controller",
          body: "The data controller is Matteo Tirocchi. For any request concerning personal data you can write to matteo@tirocchi.com.",
        },
        {
          title: "Data processed",
          body: "This site does not use contact forms, profiling cookies or tracking tools. Personal data may be processed in two cases: navigation data (IP address, browser and device type, date and time of the visit) automatically recorded in the hosting service logs for security and operation purposes; data provided voluntarily, if you write to us by email (address and message content).",
        },
        {
          title: "Purposes and legal basis",
          body: "Navigation data is processed to ensure the security and correct operation of the site (legitimate interest, Art. 6.1.f GDPR). Data sent by email is processed to answer the request (performance of a contract or pre-contractual measures, Art. 6.1.b, or legitimate interest, Art. 6.1.f).",
        },
        {
          title: "Processing and hosting",
          body: "The site is static and hosted on Cloudflare Pages (Cloudflare, Inc.). The provider may process log data to deliver the service and ensure its security. Processing is carried out with IT tools and appropriate security measures.",
        },
        {
          title: "Cookies",
          body: "The site does not use profiling cookies or third-party trackers; only any necessary technical cookies may be used. For details see the Cookie Policy.",
        },
        {
          title: "Retention",
          body: "Navigation data is retained for the period set by the hosting provider and in any case for the time necessary for security purposes. Email messages are retained until the request is handled and for the time necessary to protect rights.",
        },
        {
          title: "Recipients",
          body: "Data may be processed by the hosting provider (Cloudflare) and, for emails, by the email service provider. No analytics or advertising services are used and data is not transferred to third parties for marketing purposes.",
        },
        {
          title: "Transfers outside the EU",
          body: "Any transfers of data outside the European Economic Area take place in compliance with the GDPR and with adequate safeguards adopted by the provider (e.g. standard contractual clauses).",
        },
        {
          title: "Data subject rights",
          body: "You can exercise the rights under Articles 15–22 of the GDPR (access, rectification, erasure, restriction, objection, portability) by writing to matteo@tirocchi.com. You may also lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).",
        },
        {
          title: "Links to third-party sites",
          body: "The site contains links to external platforms (Instagram, Behance, LinkedIn). We are not responsible for their content or the data processing they carry out; we invite you to consult their notices.",
        },
        {
          title: "Changes",
          body: "This notice may be updated over time; the current version is the one published on this page.",
        },
      ],
    },
    cookie: {
      title: "Cookie Policy",
      sections: [
        {
          title: "What cookies are",
          body: "Cookies are small text files that visited sites send to the user’s browser.",
        },
        {
          title: "Cookies used",
          body: "This site does not use profiling cookies or third-party tracking cookies. Only technical cookies necessary for correct operation may be used.",
        },
        {
          title: "Management",
          body: "You can manage or disable cookies in your browser settings.",
        },
      ],
    },
    notes: {
      title: "Legal notes",
      sections: [
        {
          title: "Site owner",
          body: "The site tirocchi.com is a personal portfolio of Matteo Tirocchi.",
        },
        {
          title: "Copyright",
          body: "All content on the site — texts, images, graphics, projects and trademarks — is protected by copyright and belongs to Matteo Tirocchi or the respective owners. Reproduction, distribution or reuse without written authorisation is prohibited.",
        },
        {
          title: "Intellectual property of projects",
          body: "The projects and campaigns shown belong to the clients and companies they were made for. Trademarks and logos mentioned belong to their respective owners and are shown for illustrative and portfolio purposes only.",
        },
        {
          title: "Disclaimer",
          body: "The content is provided «as is», without guarantees of completeness or being up to date. The site is not liable for any damage arising from the use of the information contained. External links are not controlled and we do not guarantee their content or availability.",
        },
        {
          title: "Permitted use",
          body: "The site is intended for personal viewing. Use of the content for commercial purposes without authorisation is not permitted.",
        },
        {
          title: "Applicable law",
          body: "The site is governed by Italian law. The court of Rome has jurisdiction over any dispute.",
        },
      ],
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
