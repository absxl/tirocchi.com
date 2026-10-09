# Report finale

## 1. Cosa è stato costruito

Portfolio statico di Matteo Tirocchi (Next.js 16 + TypeScript, `output: "export"`), bilingue IT/EN,
con: **home cinematografica** — **preloader** a progresso, **stanze WebGL** pseudo-360 con
**dissolvenza** randomizzata, **hotspot** e **menu capitoli** (ispirate a The Uncensored Library,
tecniche reimplementate); pager GSAP un gesto = una pagina; griglia lavori con filtri e vista Lista
con anteprima al cursore; pagine progetto editoriali; archivio CREATIVITÀ con viewer; il platformer
"Portfolio Rush" portato dal sito attuale; About/Contatti; **pagine legali** e footer con dati legali
+ credit. Tipografia **Bricolage Grotesque** (display) + **Space Mono** (testo). 50 pagine statiche.
Come avviarlo: `npm install` → `npm run dev` (sviluppo) oppure `npm run build` (statico in `out/`).

## 2. Decisioni di design

Vedi `docs/decisioni.md`. In sintesi: palette scura ad **alto contrasto** `#090b0e` con accento blu
`#3b82f6`; display **Bricolage Grotesque** + **Space Mono**; motion **GSAP + ScrollTrigger + SplitText
+ Lenis**, reveal allo scroll e **transizioni di pagina** (View Transitions), cursore custom, grana;
home **scroll-driven** (scena sticky, stanze in crossfade con parallasse verticale), **preloader** e
**stanze WebGL** con shader pseudo-360 e cover mapping, **pannello sezione** a sinistra (titolo,
descrizione, CTA) e menu capitoli (tecniche riprese da The Uncensored Library e reimplementate);
header a comparsa graduale; toggle Griglia/Lista con hover-preview; footer con note legali e credit;
immagini AVIF/WebP via `sharp` + `<SmartImage>`. **Forma e materiali**: linguaggio arrotondato
(12px, vetro 20px) e fluido (easing morbido) con superfici in **liquid glass** (blur + rim speculare
+ sheen, rifrazione SVG su header/pannello home in Chromium, fallback opachi) — dettagli in
`docs/decisioni.md`.

## 3. Cosa è stato verificato dal vivo

- Ispezione via HTTP di HTML/CSS/JS dei 4 siti di riferimento (Bovi, Barissever, Amoretti, sito
  attuale di Matteo): font, colori, struttura, interazioni e — per Matteo — **tutti i contenuti**
  (8 progetti ADV, archivio creatività, gioco). Dettagli in `docs/ispezione-riferimenti.md`.
- Asset reali scaricati dal sito attuale: **347 file (~249 MB)** in `public/assets`.

**Non verificato:** rendering visivo (screenshot/DevTools non disponibili), valori CSS calcolati,
comportamento esatto delle animazioni dei riferimenti, test su dispositivi reali iOS/Android e
audit Lighthouse automatico (non eseguibile in questo ambiente).

## 4. Elenco `[DA COMPILARE]` (da chiedere a Matteo)

- Email, location, bio, competenze complete, formazione, riconoscimenti (`src/content/site.json`).
- Conferma diritti di riuso di logo/favicon e di tutte le immagini/video.
- Eventuale ritratto per `/about` e immagine OG dedicata (attuale `public/og.png` è generata da un
  asset).
- Titoli/descrizioni/anno definitivi per gli elementi dell'archivio creatività (oggi generici).
- Revisione delle **bozze EN** (marcate `[DA REVISIONARE]`).
- Dominio: impostato a **https://tirocchi.com** (fallback nel codice + `.env.local`).

Dettaglio completo in `docs/da-compilare.md`.

## 5. Punti aperti

- **Licenze**: diritti di immagini/video/logo da confermare; font già open source (Fontsource).
- **Peso asset**: i video MP4 originali sono pesanti; valutare transcodifica/streaming se necessario.
- **Contenuti archivio**: i titoli generici dell'archivio andrebbero sostituiti con dati reali.
- **Deploy**: configurato per **Cloudflare Workers static assets** (`wrangler.jsonc` + `npm run deploy`,
  `not_found_handling: "404-page"`). Essendo un export statico, **non** va usato OpenNext
  (`npx opennextjs-cloudflare build` fallisce con `output: "export"`). Alternativa: Cloudflare Pages
  con build `npm run build` e output `out`.
- **Audit finale**: eseguire Lighthouse/axe e test tastiera su un ambiente con browser.
