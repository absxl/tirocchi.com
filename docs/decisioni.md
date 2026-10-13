# Decisioni di design

Sintesi delle scelte fatte e del perché, in coerenza con i file 03 (landing), 04 (layout) e
05 (stile). Quando in conflitto, ha vinto l'ordine stile → layout → landing.

## Colore

- **Palette per sezione**: l'intero schema (sfondo, superfici, linee, testo secondario) **deriva da
  `--accent`** con `color-mix` in `tokens.css`. Cambiando solo l'accento cambia tutto il sito.
  - `--bg` 7% accento · `--bg-elev` 11% · `--bg-elev-2` 15% · `--line` 20% · `--line-strong` 28% ·
    `--fg-dim` 26% · `--fg-faint` 18% (miscelati su neutri scuri).
  - Accenti: intro `#3b82f6` · ADV Portfolio `#ff6a3d` · Creatività `#a78bfa` ·
    About `#22d3ee` · Contatti `#ff5c8a`; `--accent-ink` scuro per il testo su accento.
  - Contrasti verificati: secondario su sfondo tinto 7.6–9.3:1, ink su accento 5.4–13.9:1 (AA).
- **Transizione fluida** del colore: `@property --accent { syntax: "<color>" }` + `transition` su
  `:root` (0.6s); disattivata con `prefers-reduced-motion`.
- **Applicazione**: sulla home l'accento segue la stanza attiva (`RoomScene`); nelle pagine interne
  un `AccentController` mappa il percorso → accento della sezione.
- **Scrollbar di sistema nascosta** su tutto il sito (lo scroll resta con rotella/touch/tastiera).

## Tema pagine interne (dal vecchio sito di Matteo)

- Attivo solo sulle pagine interne via `html[data-theme="inner"]` (impostato da `ThemeController`);
  **la home resta invariata**.
- Token ripresi dal vecchio sito: `--bg #080a0d`, `--bg-elev #14181d`, `--bg-elev-2 #1a1f25`,
  `--fg #eef1f4`, `--fg-dim #8e99a8`, `--fg-faint #6b7683`, `--line rgba(219,226,235,.22)`,
  `--line-strong rgba(219,226,235,.38)`.
- **Font**: sulle pagine interne il testo passa a **Inter** (Fontsource variable, stesso Inter di
  Google) mentre le etichette restano Space Mono; in home restano Bricolage + Space Mono.
- **Accenti per sezione** (famiglia del vecchio sito, con ink scuro): ADV Portfolio `#abc8ee` ·
  Creatività `#9b8cd6` · About `#6b8fbf` · Contatti `#d4695e`.
  Contrasti verificati: ink su accento 5.4–13.7:1, secondario su sfondo 6.9:1 (AA).
- **Motivi**: overlay **noise a puntini** (4px, `mix-blend-mode: screen`) e **vignette** fissa
  (radial + linear) come nel vecchio sito.
- Header e footer si adattano automaticamente ai token interni.

## Tipografia

- **Display**: **Bricolage Grotesque** (variable, self-hosted via Fontsource) per nome e titoli,
  con kinetic reveal per-carattere.
- **Testo/etichette**: **Space Mono** per corpo, metadati e navigazione (mono/editoriale).
- Peso display 700–800 con tracking negativo; testo a peso 400. Dimensioni fluide con `clamp()`.
  Nome home `clamp(2rem, 9vw, 7.5rem)`, `white-space: nowrap` (tarato per stare su una riga a 360px).

## Linguaggio grafico

- **Nessuna icona a freccia** (`↗ ↓ ← → × ↑`) e **nessuno slash `/` decorativo**: prec/succ e link
  esterni usano solo parole; la chiusura è "Chiudi"; i separatori editoriali usano `—` e `·`.
- Layout **compatto**: scala di spaziatura ridotta e **nessun divisore decorativo** (`border`
  orizzontali rimossi); restano solo le righe della lista lavori.
- Frecce/simboli solo dove realmente utili; righe `1px` solo funzionali; etichette editoriali
  (`01 —`) mantenute.

## Home page

- **Preloader cinematografico**: progresso reale (font + prima texture della stanza + tempo minimo),
  **tendina** con `clip-path` che scopre la scena. Mostrato una volta per sessione; nascosto senza JS.
- **Home a "stanze" (WebGL)**: canvas full-screen con shader **pseudo-360** (pan verticale + cover
  mapping, niente distorsione) e **crossfade** tra stanze. Una stanza per sezione (intro, ADV
  Portfolio, Creatività, About, Contatti). Per ogni sezione, a **sinistra**, un **pannello** con numero,
  titolo, descrizione e **box CTA** che porta alla pagina (testo centrato, titolo grande).
  **Menu capitoli** centrato in basso, frecce e tastiera. Fallback senza WebGL/JS/reduced-motion:
  immagine statica + lista di link.
- **Stanze guidate dallo scroll (sticky)**: la home è una sezione alta `N stanze × 100svh` con la
  scena WebGL **`position: sticky`**. Il progresso di scroll sceglie la stanza con un **crossfade
  scroll-linked** (banda stretta + leggero dip-to-dark) e muove la panoramica in **parallasse
  verticale** (damped, senza drag). Lo scroll è **nativo** (nessun wheel-hijack): non può bloccarsi.
  Menu capitoli, frecce e tastiera **portano lo scroll** alla stanza con un **fly-through**
  proporzionale alla distanza; il footer segue naturalmente. Lenis disattivato in home.
- **Adattamento allo schermo**: shader con **UV "cover"** (nessuna distorsione a qualsiasi aspect
  ratio), texture scelte per breakpoint (960/1600), UI scena responsive (menu capitoli a riga su
  mobile).
- **Easing** coerenti: Power2/Power3/Expo + `CustomEase` `matteoInOut`.

## Layout (file 04)

- `/lavori`: **griglia** `auto-fill` (min 16rem), card con cover + cliente · anno + titolo e **tilt
  al cursore**. **Nessun filtro** (ci sono solo progetti ADV). **Toggle Griglia/Lista**
  (stato in `?view=`).
- Vista **Lista** = righe testuali (titolo + cliente) con **anteprima immagine quadrata che segue il
  cursore** su desktop (equivalente dello stile nicparanoia), disattivata su touch.
- `/lavori/[slug]`: header con cliente/anno/ruolo/formati, intro, sezioni Contesto/Insight/Idea/
  Sviluppo, **galleria a colonna unica**: immagini a piena larghezza, rapporto naturale e
  **attaccate (gap 0), senza divisori** (come il vecchio sito); hero separato; crediti, navigazione
  precedente/successivo + "Tutti i lavori". Video con `poster` e `preload="metadata"`.
- `/creativita`: indice a **griglia di card-categoria** + **slideshow** della galleria cover-art
  (2/1, autoplay + manuale); `/creativita/[categoria]`: **griglia/lista** (come l'ADV Portfolio) con
  **tutte le immagini della categoria** e **viewer** al click (dialog, ESC, tastiera ← →).
- **Immagini a rapporto originale** (nessun crop 4:5) in griglia, lista e slideshow.
- **Viewer a schermo**: `grid-template-rows: auto minmax(0, 1fr) auto` così l'immagine **entra
  sempre** nello spazio tra header e barra.
- **Galleria procedurale**: le categorie e le immagini di Creatività sono generate dal sito
  (`src/lib/gallery.ts`) — progetti ADV (cover + immagini) e categorie dell'archivio personale;
  **video esclusi**; la categoria "SFONDI" è stata rimossa.
- Header sticky con nome + menu; su mobile menu a pannello full-screen.

## Stile e movimento (file 05)

- **Niente frecce/simboli testuali** né slash: testo piano, righe `1px` solo funzionali, etichette
  editoriali (`01 —`).
- **Sistema di movimento**: GSAP + ScrollTrigger + SplitText + Observer + ScrollToPlugin, e **Lenis**
  (smooth scroll sulle pagine interne, `duration 1.2`, easing expo-out, `wheelMultiplier 0.9`).
  Reveal allo scroll (`Reveal`), solo `transform/opacity`. In home il pager sostituisce Lenis.
- **Transizioni di pagina**: React `<ViewTransition>` (View Transitions API) con tipi
  `nav-forward`/`nav-back`; header ancorato (`view-transition-name: site-header`).
- **Cursore custom** su desktop (dot + etichetta, `data-cursor-label`); **grana** leggerissima.
- `prefers-reduced-motion`: Lenis, reveal, campo canvas e cursore disattivati; contenuto statico e
  leggibile. **No-JS**: contenuti e navigazione funzionano (nessun elemento nascosto).

## Forma, fluidità e liquid glass

- **Raggi**: `--radius-s 8px`, `--radius 12px` (card, media, bottoni, chip), `--radius-l 20px`
  (superfici in vetro). **Eccezioni nette**: il mosaico archivio di Creatività e la sequenza
  immagini dei progetti restano senza raggio (stile vecchio sito).
- **Movimento fluido**: easing morbido `cubic-bezier(0.22,1,0.36,1)`, `--dur 0.25s`,
  `--dur-slow 0.6s`; transizioni aggiunte a bottoni, filtri, link e barre (solo `transform/opacity/color`).
- **Liquid glass** (riferimento Apple): materiale in `styles/glass.css` con tinta bassa + `blur(16px)
  saturate(180%) brightness(1.06)`, **rim 1px** con specifica interna (top chiaro, lati/basso deboli),
  **sheen** diagonale in `mix-blend-mode: screen` e ombra esterna.
  - Superfici: **header** (barra a tutta larghezza, tinta più densa per leggibilità), **menu mobile**,
    **barre del viewer** Creatività; chip/bottoni in vetro leggero (`glass-lite`, blur 8px).
  - **Rifrazione reale** del backdrop solo su header e pannello home, via filtro SVG nascosto
    (`feTurbulence` + `feGaussianBlur` + `feDisplacementMap`) montato dai layout e richiamato dentro
    `@supports (backdrop-filter: url(#lg-refract))` — Chromium; altrove resta il blur.
  - **Morph** fluido della forma (`border-radius`, 9s) solo sulle superfici in vetro, disattivato con
    `prefers-reduced-motion`.
  - **Fallback**: senza `backdrop-filter` o con `prefers-reduced-transparency` la superficie diventa
    quasi opaca (`--glass-tint-strong`).
  - **Performance**: max ~3 superfici in vetro per viewport, niente vetro sulle card ripetute.

## Revisione recente

- **Sezione “Play” rimossa** del tutto (voce di menu, stanza, rotta `/play`, gioco `PortfolioRush`,
  accento e filtro). I capitoli della home ora sono: intro, ADV Portfolio, Creatività, About, Contatti.
- **“Lavori” rinominato “ADV Portfolio”** (menu, titolo pagina, stanza, metadata). La rotta resta
  `/lavori` (EN `/en/work`).
- **Nome reattivo** (intro): componente `ReactiveName` — le lettere vicine al cursore si alzano e
  scalano; su touch un tap invia un’onda; statico con `prefers-reduced-motion`.
- **Copertine tipografiche di sezione** (`SectionCover`): titolo grande + indice + descrizione + CTA,
  che **reagiscono al mouse** (parallasse del titolo, glow dell’accento che segue il cursore). Le card
  progetto in `/lavori` hanno un tilt/glow reattivo al puntatore.
- **Sfondi delle sezioni (nessuna immagine ripetuta)**: intro = **nero** (`sfondi/black.webp`);
  ADV Portfolio = ritratto `sfondi/2.png`; Creatività = ritratto `sfondi/3.png`; About = ritratto
  `sfondi/1.png`; Contatti = immagine di progetto fuori tema `sfondi/portfolio.webp` (2560×1440),
  messa per ultima così l’utente la vede alla fine.
- **Preloader rimosso**: nessuna schermata di caricamento; l'ingresso in home è un **zoom fluido
  tipo Netflix** (scala 1.3 → 1, opacity, ~1s, `cubic-bezier(.22,1,.36,1)`), disattivato con
  `prefers-reduced-motion`.
- **Nav a destra** con la voce **"Contact Me"** evidenziata da un **box** (pill con bordo accento),
  sia IT sia EN, in header e come etichetta della sezione in home.
- **Dati CV di Matteo** inseriti in `src/content/site.json` (profilo, competenze tecniche, soft
  skills, esperienza, istruzione, location) e mostrati in `/about`; contatto **matteo@tirocchi.com**
  (cellulare rimosso dal sito).
- **Pulizia "vibe coded"**: rimossi testi segnaposto (`[DA COMPILARE]`, note legali "da completare",
  "Categoria in arrivo"), chiavi i18n inutilizzate e il blocco legale; IT reso coerente ("Chi sono",
  "Competenze trasversali"). Social **deduplicati** in About/Contatti (footer nascosto lì).
- **Mobile**: header/menu raggiungibile in cima alla home, scrim più leggero, `100dvh` per coprire
  il fondo (niente "box colorato"), fondo meno affollato (frecce nascoste, social sopra i capitoli).

## Lingue

- **Italiano predefinito senza prefisso**; **inglese** sotto `/en/...`. Due **root layout** separati
  (`app/(it)` e `app/(en)`) così ogni lingua ha il proprio `<html lang>`.
- Testi IT reali; bozze EN tradotte e marcate `[TO REVIEW]`/`[DA REVISIONARE]`.

## Immagini e performance

- Nessun `next/image` (incompatibile con l'export statico senza loader): invece uno script `sharp`
  genera varianti **AVIF/WebP** e un manifest; il componente `SmartImage` emette `<picture>` con
  `srcset`/`sizes` e `width`/`height` espliciti (CLS ≈ 0). Fallback all'immagine originale se non
  ottimizzata.
- Font self-hosted, video con poster, lazy-loading sotto la piega.

## Footer e note legali

- Il footer **non** mostra più il blocco "Informazioni legali" (P. IVA, C.F., sede legale, PEC),
  rimosso perché sito personale; restano i link a **Privacy Policy**, **Cookie Policy**, **Note legali**.
  Anche l'email è stata tolta dal footer (compariva due volte in Contatti).
- Pagine legali create: `/privacy`, `/cookie-policy`, `/note-legali` (EN: `/en/privacy`,
  `/en/cookie-policy`, `/en/legal-notes`) con contenuti **segnaposto** da far validare a un
  professionista.
- **Credit**: "Sito realizzato da Marcello Carletti" con link a `carletti.work` e
  `marcello@carletti.work`.

## Cosa ho evitato di copiare

- Nessun testo, immagine, logo o codice dei siti di riferimento (Bovi, Barissever, Amoretti).
- Nessun progetto/cliente/premio inventato: i dati mancanti sono `[DA COMPILARE]`.
