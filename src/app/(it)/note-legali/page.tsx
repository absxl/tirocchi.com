import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.legal.notes.title,
  alternates: pageAlternates(routes.it.noteLegali, routes.it.noteLegali, routes.en.noteLegali),
};

export default function Page() {
  return (
    <LegalPage
      title={dict.legal.notes.title}
      sections={dict.legal.notes.sections}
      updated={dict.legal.updated}
      disclaimer={dict.legal.disclaimer}
    />
  );
}
