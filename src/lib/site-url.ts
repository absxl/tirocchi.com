export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tirocchi.com").replace(
  /\/$/,
  ""
);

export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageAlternates(canonical: string, itPath: string, enPath: string) {
  return {
    canonical,
    languages: {
      it: itPath,
      en: enPath,
    },
  };
}
