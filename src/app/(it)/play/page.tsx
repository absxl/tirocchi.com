import type { Metadata } from "next";
import { PortfolioRush } from "@/components/play/PortfolioRush";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.play.title,
  description: dict.play.intro,
  alternates: pageAlternates(routes.it.play, routes.it.play, routes.en.play),
};

export default function Page() {
  return <PortfolioRush lang="it" />;
}
