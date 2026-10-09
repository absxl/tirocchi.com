import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/space-mono/latin-400.css";
import "@fontsource/space-mono/latin-700.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/glass.css";
import "@/styles/global-components.css";
import "@/styles/motion.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassFilter } from "@/components/GlassFilter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { ThemeController } from "@/components/motion/ThemeController";
import { getSite } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Matteo Tirocchi — Art Director",
    template: "%s — Matteo Tirocchi",
  },
  description:
    "Matteo Tirocchi — Art Director. Advertising projects, personal experiments and a playable creative process.",
  applicationName: "Matteo Tirocchi",
  authors: [{ name: "Matteo Tirocchi" }],
  creator: "Matteo Tirocchi",
  icons: {
    icon: [{ url: "/assets/branding/favicon-demone.png", type: "image/png" }],
    apple: [{ url: "/assets/branding/favicon-demone.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Matteo Tirocchi",
    title: "Matteo Tirocchi — Art Director",
    description:
      "Advertising projects, personal experiments and a playable creative process.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Matteo Tirocchi — Art Director" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matteo Tirocchi — Art Director",
    description:
      "Advertising projects, personal experiments and a playable creative process.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#090b0e",
  colorScheme: "dark",
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <SmoothScroll />
        <Cursor />
        <ThemeController />
        <GlassFilter />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header lang="en" />
        <main id="main">{children}</main>
        <Footer lang="en" site={site} />
      </body>
    </html>
  );
}
