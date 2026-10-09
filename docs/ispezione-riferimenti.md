# Ispezione dei riferimenti (Fase 0)

**Metodo.** Ispezione effettuata via HTTP (HTML, CSS inline/esterno, JS) dei siti di riferimento.
**Limite dichiarato:** non è stato possibile usare un browser reale, screenshot o DevTools, quindi
non sono disponibili i valori *visualizzati* (dimensioni calcolate, media query attive, timeline di
animazione). Dove i file [DEDOTTO] ipotizzavano un comportamento, ho verificato solo ciò che è
leggibile nel sorgente. Tutto ciò che segue è **osservato nel codice** dei siti, non copiato.

## 1. Fonte contenuti — sito attuale di Matteo (`matteo-portfolio.piragna2003.chatgpt.site`)

- `theme-color`: `#090b0e`. Lingua `it`. Favicon `favicon-demone.png`.
- App a viste (`home`, `portfolio`, `personal`, `case`, `play`) gestite via `history` + hash.
- **Landing**: header con wordmark `MATTEO TIROCCHI` + logo `logowhite.png`, nav `ADV PORTFOLIO` /
  `PLAY` / `CREATIVITÀ`, CTA `SCRIVIMI ↗`, eyebrow `/ MENU PRINCIPALE`, h1 `SELEZIONA UN'AREA`,
  3 card area, footer social (Instagram/Behance/LinkedIn).
- **8 progetti ADV** con dati completi (vedi `src/content/projects/`).
- **Archivio CREATIVITÀ** in 6 categorie (AI ART, COVER ART, FOTO, VIDEO, VIDEO AI, ESPERIMENTI).
- **PLAY**: platformer canvas "Portfolio Rush" (10 collectible "idee", livelli, controlli touch stile GBA).
- Asset totali scaricati: **347 file / ~249 MB** in `public/assets` (immagini, webp, poster, mp4).

## 2. Landing — `alessandrobovi.com` [osservato]

- Font: **Manrope** (display/testo) + **Nunito Sans** (titoli case). Palette `--black:#050505`,
  `--white:#f4f4f2`, `--grey:#969696`, `--line:#252525`.
- `html,body{overflow:hidden}` → landing a **una schermata**, nessuno scroll.
- Nome centrale `ALESSANDRO BOVI`, `font-size:clamp(3.2rem,10vw,10.8rem)`, `letter-spacing:-.075em`,
  con effetto tipo **CRT/scanline**: `background:repeating-linear-gradient` + `background-clip:text`
  e glitch su hover (`clip-path` animato, `steps()`), disattivato con `prefers-reduced-motion`.
- Etichetta `Passa sul nome` (`hint`), che svanisce quando `.identity` è `.open`/`:hover`.
- Menu che appare su hover/focus: 3 voci `About me`, `Works`, `Awards`, con underline animata.
- **Pannelli overlay** a tutta pagina (`.panel`) con transizione `opacity/translateY`, header
  sticky con `Close ×`, kicker `01 — About me`, `02 — Selected works`, `03 — Recognition`, `h1` con
  glitch `data-text`. Chiusura con ESC e via `history.replaceState('#id')`.
- **Reel copertine** (`.cover-reel`): flex orizzontale, `scroll-snap`, JS che su `pointermove`
  calcola la distanza dal centro di ogni card e applica `--dock-scale/--dock-lift/--dock-z`
  (parallasse "dock" macOS). Su touch disattivato (`matchMedia('(hover:hover) and (pointer:fine)')`).
- Video: `<iframe youtube-nocookie>` lazy; `<video controls preload="metadata" poster="...">`.

## 3. Layout — `selmico76.myportfolio.com` [osservato]

- Piattaforma **Adobe Portfolio** (tema "marta/marina"), font da **Typekit**, `transition-enabled`.
- Home = `splash`: immagine/visual centrata (max 600px) + **un solo bottone** `View my Portfolio` → `/work`.
- Header sottile con nome; archivio lavori ampio; About/Contact con social e una sola email.
- Immagini servite con `data-srcset`/`sizes` e lazy (`js-lazy`), lightbox abilitato.

## 4. Stile — `nicparanoia.it` [osservato]

- `theme-color:#000`; title `NIC.PARANOIA — PORTFOLIO`; lang `en`.
- Home: `h1.header` con `NIC` / `PARANOIA` in classi `.mega`, con **parallasse** (`data-speed`
  negativo, tipo Locomotive/scroll listener). Sotto, lista `header__social` con nome, ruolo,
  `Based in Milan`, `Instagram ↗`, `Email @`, `Works ↓` (frecce testuali come linguaggio).
- `h2.portfolio` = `port` / `folio` su due righe (minuscolo, spostata).
- **Lista lavori**: `<li>` con `.work__trigger` (`data-key`, `data-src` = immagine anteprima),
  caption titolo + `.kilo` cliente. Hover = anteprima immagine (probabilmente cursore/overlay).
- **Dettaglio**: `.overlay` per opera con `.detail__head` (sottotitolo + titolo), `.detail__body`
  con righe "da crediti" (Art direction…, Shot by…, Styling…), link `INFO ↗`.
- `close__work`: `BACK` / `TAP ANYWHERE TO GO BACK` + `←`. Footer `BACK TO TOP ↑`.
- JS: `bootstrap.js`, `vendors.js`, `main.js` (probabile smooth-scroll + cursore). Analytics GA
  presente (da NON replicare: niente tracker).

## Sintesi operativa

- **Stile governa** (file 05): nero `#090b0e`, un solo accento, type grotesque+mono, frecce
  testuali, righe `1px`, numero/etichette editoriali.
- **Landing** (file 03): una schermata, nome gigante + interazione firma, menu che apre pannelli
  overlay accessibili (focus trap, ESC, URL).
- **Layout** (file 04): griglia `auto-fill`, card a rapporto fisso, pagina progetto a colonna,
  navigazione prec/succ.

## Cosa NON ho potuto verificare

- Valori visivi calcolati e comportamento esatto delle animazioni al rendering.
- Presenza/assenza di smooth-scroll (Lenis/Locomotive) e dettagli del cursore custom su nicparanoia.
- Gestione mobile reale dei tre siti.
