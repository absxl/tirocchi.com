import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.legal.privacy.title,
  alternates: pageAlternates(routes.en.privacy, routes.it.privacy, routes.en.privacy),
};

export default function Page() {
  return (
    <LegalPage
      title={dict.legal.privacy.title}
      sections={dict.legal.privacy.sections}
      updated={dict.legal.updated}
      disclaimer={dict.legal.disclaimer}
    />
  );
}
