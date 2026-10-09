import type { Metadata } from "next";
import { LavoriView } from "@/components/lavori/LavoriView";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";
import { getLavoriProjects } from "@/lib/view";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.lavori.title,
  description: dict.lavori.intro,
  alternates: pageAlternates(routes.it.lavori, routes.it.lavori, routes.en.lavori),
};

export default function Page() {
  return <LavoriView lang="it" projects={getLavoriProjects()} />;
}
