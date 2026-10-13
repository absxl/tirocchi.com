import type { Metadata } from "next";
import { CreativitaIndex } from "@/components/creativita/CreativitaIndex";
import { getGallery } from "@/lib/gallery";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.creativita.title,
  description: dict.creativita.intro,
  alternates: pageAlternates(routes.en.creativita, routes.it.creativita, routes.en.creativita),
};

export default function Page() {
  const { categories, items } = getGallery();
  const reel = items.filter((item) => item.category === "cover-art");
  return <CreativitaIndex lang="en" categories={categories} reel={reel} />;
}
