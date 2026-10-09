import type { Metadata } from "next";
import { ContactView } from "@/components/pages/SimplePages";
import { getSite } from "@/lib/content";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.contatti.title,
  description: dict.contatti.intro,
  alternates: pageAlternates(routes.it.contatti, routes.it.contatti, routes.en.contatti),
};

export default function Page() {
  return <ContactView lang="it" site={getSite()} />;
}
