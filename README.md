# Matteo Tirocchi — Portfolio

Sito portfolio personale di **Matteo Tirocchi, Art Director**.
Stack: **Next.js 16 (App Router) + TypeScript**, output **statico** (`output: "export"`).
Stile scuro editoriale ad **alto contrasto**, con tipografia **Bricolage Grotesque** (display) +
**Space Mono** (testo) e motion **GSAP + Lenis**. La **home è cinematografica e scroll-driven**:
**preloader** a progresso e **stanze WebGL** pseudo-360 con dissolvenza, **hotspot** e menu capitoli.
Sezione Play giocabile, archivio creativo, contenuti bilingue IT/EN.

## Requisiti

- Node.js 20+ (testato con Node 22)
- npm

## Comandi

```bash
npm install        # installa le dipendenze
npm run dev        # server di sviluppo su http://localhost:3000
npm run build      # build statica nella cartella out/
npm run preview    # anteprima della build statica
npm run lint       # controllo ESLint
```

La build statica genera la cartella `out/`: può essere pubblicata su qualsiasi hosting statico
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, Nginx…).

Imposta il dominio reale prima della build:

```bash
# .env.local (vedi .env.example)
NEXT_PUBLIC_SITE_URL=https://tuo-dominio.com
```

`NEXT_PUBLIC_SITE_URL` alimenta `metadataBase`, `sitemap.xml`, `robots.txt` e i tag Open Graph.

## Aggiungere un progetto in 3 passi

1. **Crea il file** `src/content/projects/mio-progetto.md` (copia un file esistente come modello).
2. **Compila il frontmatter** (i campi principali):

   ```yaml
   ---
   client: NOME CLIENTE
   title: TITOLO PROGETTO
   year: "2026"
   role: ART DIRECTION / VIDEO
   category: CAMPAGNA          # testo descrittivo
   group: ADV                  # ADV | Personal | Play (usato dai filtri)
   cover: /assets/adv/mio-progetto/cover.webp
   coverAlt: Descrizione dell'immagine di copertina
   hero: /assets/adv/mio-progetto/cover.webp
   featured: true              # appare in landing
   order: 9
   formats: SPOT · OOH
   contextType: CAMPAGNA INTEGRATA
   credits:
     - Matteo Tirocchi — Art Direction
   media:
     - type: video
       src: /assets/adv/mio-progetto/spot.mp4
       poster: /assets/adv/mio-progetto/poster.webp
       alt: Spot del progetto
   ---

   Testo introduttivo del progetto.
   ```

3. **Metti le immagini in** `public/assets/...` e lancia `npm run build`.
   Le griglie, i filtri e la navigazione precedente/successiva si aggiornano da soli.

## Aggiornare i dati generali

- `src/content/site.json` — nome, ruolo, bio, email, social, competenze, premi.
- `src/content/personal.json` — archivio CREATIVITÀ (categorie e opere).

I testi segnaposto sono marcati `[DA COMPILARE]` (vedi `docs/da-compilare.md`).

## Lingue

- Italiano (predefinito, senza prefisso): `/`, `/lavori`, `/creativita`, `/play`, `/about`,
  `/contatti`, `/privacy`, `/cookie-policy`, `/note-legali`
- Inglese: `/en`, `/en/work`, `/en/creativity`, `/en/play`, `/en/about`, `/en/contact`,
  `/en/privacy`, `/en/cookie-policy`, `/en/legal-notes`

Il footer contiene le **informazioni legali** (P. IVA, C.F., sede, PEC — `[DA COMPILARE]`), i link
alle pagine legali e il **credit** di realizzazione (Marcello Carletti).

Le stringhe di interfaccia sono in `src/lib/i18n.ts`. I contenuti IT sono reali; le bozze EN
sono marcate `[TO REVIEW]` / `[DA REVISIONARE]`.

## Script di manutenzione (opzionali)

```bash
npm run assets:download   # riscarica gli asset dal sito attuale (una tantum)
npm run content:extract   # riesegue l'estrazione dei contenuti dal sito attuale
npm run assets:optimize   # rigenera varianti AVIF/WebP + manifest immagini
npm run og:generate       # rigenera public/og.png
npm run home:mosaic       # rigenera public/home-mosaic.webp (sfondo tiled della home)
```

> `assets:download` e `content:extract` interrogano il sito live di Matteo: servono solo per
> rigenerare i contenuti di partenza, non per lo sviluppo quotidiano.

## Struttura

```
src/
  app/            route (route group (it) e (en) con root layout separati)
  components/     Header, Footer, SmartImage, landing/, lavori/, progetto/, creativita/, play/, pages/
  content/        progetti (.md), personal.json, site.json, images.json
  lib/            content.ts, i18n.ts, types.ts, useDialog.ts, useMediaQuery.ts
  styles/         tokens.css, base.css, global-components.css
scripts/          download-assets, extract-content, optimize-assets, make-og
docs/             ispezione-riferimenti.md, da-compilare.md, decisioni.md, report-finale.md
public/           asset scaricati, og.png
```

## Accessibilità e performance

- WCAG 2.2 AA: struttura semantica, focus visibile, dialog con focus trap + ESC, skip link.
- `prefers-reduced-motion` rispettato (animazioni e autoplay disattivati).
- Immagini con `width/height`, `srcset` AVIF/WebP e lazy-loading; video con `poster` e
  `preload="metadata"`.
- Il sito funziona (contenuti e navigazione) anche senza JavaScript.

Vedi `docs/decisioni.md` per le scelte di design e `docs/da-compilare.md` per ciò che manca.
