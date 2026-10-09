import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.legal.notes.title,
  alternates: pageAlternates(routes.en.noteLegali, routes.it.noteLegali, routes.en.noteLegali),
};

export default function Page() {
  return (
    <LegalPage
      title={dict.legal.notes.title}
      body={dict.legal.notes.body}
      note={dict.legal.draftNote}
    />
  );
}
