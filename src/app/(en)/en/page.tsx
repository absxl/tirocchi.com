import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { routes } from "@/lib/i18n";
import { pageAlternates } from "@/lib/site-url";
import { getLandingData } from "@/lib/view";

export const metadata: Metadata = {
  alternates: pageAlternates(routes.en.home, routes.it.home, routes.en.home),
};

export default function Page() {
  const { social } = getLandingData();
  return <Landing lang="en" social={social} />;
}
