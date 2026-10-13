import type { Metadata } from "next";
import { AboutView } from "@/components/pages/SimplePages";
import { getSite } from "@/lib/content";
import { getGallery } from "@/lib/gallery";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.about.title,
  alternates: pageAlternates(routes.en.about, routes.it.about, routes.en.about),
};

export default function Page() {
  const strip = getGallery()
    .items.filter((item) => ["photography", "cover-art", "experiments", "ai-art"].includes(item.category))
    .slice(0, 12)
    .map((item) => ({ image: item.image, title: item.title }));
  return <AboutView lang="en" site={getSite()} strip={strip} />;
}
