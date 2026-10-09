import type { MetadataRoute } from "next";
import { locales, routes } from "@/lib/i18n";
import { getPersonal, getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

function withSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  const push = (itPath: string, enPath: string) => {
    entries.push({
      url: `${SITE_URL}${withSlash(itPath)}`,
      lastModified: now,
      alternates: {
        languages: {
          it: `${SITE_URL}${withSlash(itPath)}`,
          en: `${SITE_URL}${withSlash(enPath)}`,
        },
      },
    });
    entries.push({
      url: `${SITE_URL}${withSlash(enPath)}`,
      lastModified: now,
    });
  };

  push(routes.it.home, routes.en.home);
  push(routes.it.lavori, routes.en.lavori);
  push(routes.it.creativita, routes.en.creativita);
  push(routes.it.play, routes.en.play);
  push(routes.it.about, routes.en.about);
  push(routes.it.contatti, routes.en.contatti);
  push(routes.it.privacy, routes.en.privacy);
  push(routes.it.cookie, routes.en.cookie);
  push(routes.it.noteLegali, routes.en.noteLegali);

  for (const project of getProjects()) {
    push(`${routes.it.lavori}/${project.slug}`, `${routes.en.lavori}/${project.slug}`);
  }
  for (const category of getPersonal().categories) {
    push(
      `${routes.it.creativita}/${category.slug}`,
      `${routes.en.creativita}/${category.slug}`
    );
  }

  void locales;
  return entries;
}
