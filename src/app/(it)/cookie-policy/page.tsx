import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { getDictionary, routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";

const dict = getDictionary("it");

export const metadata: Metadata = {
  title: dict.legal.cookie.title,
  alternates: pageAlternates(routes.it.cookie, routes.it.cookie, routes.en.cookie),
};

export default function Page() {
  return (
    <LegalPage
      title={dict.legal.cookie.title}
      body={dict.legal.cookie.body}
      note={dict.legal.draftNote}
    />
  );
}
