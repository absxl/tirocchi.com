export const ACCENT = {
  default: "#3b82f6",
  lavori: "#ff6a3d",
  creativita: "#a78bfa",
  about: "#22d3ee",
  contatti: "#ff5c8a",
} as const;

export type AccentKey = keyof typeof ACCENT;

export interface InnerAccent {
  accent: string;
  ink: string;
}

/** Accents for inner pages, taken from Matteo's old site palette. */
export const INNER_ACCENT = {
  lavori: { accent: "#abc8ee", ink: "#0a1017" },
  creativita: { accent: "#9b8cd6", ink: "#0a1017" },
  about: { accent: "#6b8fbf", ink: "#0a1017" },
  contatti: { accent: "#d4695e", ink: "#0a1017" },
} as const;

/** Inner accent for a route. Returns null on the home (handled per room)
 *  and for routes without a dedicated section. */
export function innerAccentForPath(pathname: string): InnerAccent | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "/en") return null;
  if (clean.startsWith("/lavori") || clean.startsWith("/en/work")) return INNER_ACCENT.lavori;
  if (clean.startsWith("/creativita") || clean.startsWith("/en/creativity")) {
    return INNER_ACCENT.creativita;
  }
  if (clean.startsWith("/about") || clean.startsWith("/en/about")) return INNER_ACCENT.about;
  if (clean.startsWith("/contatti") || clean.startsWith("/en/contact")) return INNER_ACCENT.contatti;
  return null;
}
