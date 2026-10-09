import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource/space-mono/latin-400.css";
import "@fontsource/space-mono/latin-700.css";
import "@/styles/tokens.css";
import "@/styles/base.css";

export const metadata: Metadata = {
  title: "404 — Pagina non trovata",
  description: "La pagina che cerchi non esiste o è stata spostata.",
};

export default function GlobalNotFound() {
  return (
    <html lang="it">
      <body>
        <main
          className="container"
          style={{ minHeight: "100svh", display: "grid", alignContent: "center", gap: "1.5rem" }}
        >
          <span className="eyebrow">404</span>
          <h1 style={{ fontSize: "var(--display-s)", textTransform: "uppercase" }}>
            Pagina non trovata
          </h1>
          <p style={{ color: "var(--fg-dim)", maxWidth: "48ch" }}>
            La pagina che cerchi non esiste o è stata spostata.
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mono"
            style={{ justifySelf: "start", borderBottom: "1px solid var(--line-strong)", paddingBottom: "0.3rem" }}
          >
            Torna alla home
          </a>
        </main>
      </body>
    </html>
  );
}
