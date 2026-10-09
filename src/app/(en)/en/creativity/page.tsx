import type { Metadata } from "next";
import { CreativitaIndex } from "@/components/creativita/CreativitaIndex";
import { getArchiveItems, getPersonal } from "@/lib/content";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.creativita.title,
  description: dict.creativita.intro,
  alternates: pageAlternates(routes.en.creativita, routes.it.creativita, routes.en.creativita),
};

export default function Page() {
  const { categories } = getPersonal();
  const reel = getArchiveItems("cover-art");
  return <CreativitaIndex lang="en" categories={categories} reel={reel} />;
}
