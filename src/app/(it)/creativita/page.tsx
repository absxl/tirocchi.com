import type { Metadata } from "next";
import { CreativitaIndex } from "@/components/creativita/CreativitaIndex";
import { getGallery } from "@/lib/gallery";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.creativita.title,
  description: dict.creativita.intro,
  alternates: pageAlternates(routes.it.creativita, routes.it.creativita, routes.en.creativita),
};

export default function Page() {
  const { categories, items } = getGallery();
  const reel = items.filter((item) => item.category === "cover-art");
  return <CreativitaIndex lang="it" categories={categories} reel={reel} />;
}
