// Genera un contact sheet (SVG autonomo) con tutte le foto usate nel sito,
// per rivederle in anteprima. Apri docs/anteprima-immagini.svg nel browser.
import { existsSync, readdirSync, readFileSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const CONTENT = path.join(ROOT, "src", "content");
const OUT = path.join(ROOT, "docs", "anteprima-immagini.svg");

// Section backgrounds (must match src/lib/rooms.ts).
const SECTIONS = [
  { label: "Intro (nero)", src: "/assets/sfondi/black.webp" },
  { label: "ADV Portfolio", src: "/assets/sfondi/2.png" },
  { label: "Creatività", src: "/assets/sfondi/3.png" },
  { label: "About", src: "/assets/sfondi/1.png" },
  { label: "Contatti", src: "/assets/sfondi/portfolio.webp" },
];

function projectCovers() {
  const dir = path.join(CONTENT, "projects");
  const out = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(path.join(dir, file), "utf8");
    const client = /^client:\s*(.+)$/m.exec(raw)?.[1]?.trim() ?? "";
    const title = /^title:\s*(.+)$/m.exec(raw)?.[1]?.trim() ?? "";
    const cover = /^cover:\s*(\/assets\/[^\s]+)$/m.exec(raw)?.[1]?.trim();
    if (cover) out.push({ label: `${client} — ${title}`, src: cover });
  }
  return out;
}

function categoryCovers() {
  const personal = JSON.parse(readFileSync(path.join(CONTENT, "personal.json"), "utf8"));
  return personal.categories.map((c) => ({ label: c.title, src: c.cover }));
}

const MIME = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
};

function localFile(src) {
  const base = src.replace(/^\/+/, "");
  const candidates = [
    base.replace(/\.[^.]+$/, ".opt-480.webp"),
    base.replace(/\.[^.]+$/, ".opt-960.webp"),
    base,
  ];
  for (const rel of candidates) {
    const abs = path.join(PUBLIC, ...rel.split("/"));
    if (existsSync(abs)) return abs;
  }
  return null;
}

function dataUri(abs) {
  const mime = MIME[path.extname(abs).toLowerCase()] ?? "image/png";
  return `data:${mime};base64,${readFileSync(abs).toString("base64")}`;
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]
  );
}

const groups = [
  { title: "SFONDI DELLE SEZIONI", items: SECTIONS },
  { title: "COVER PROGETTI", items: projectCovers() },
  { title: "COVER CATEGORIE", items: categoryCovers() },
];

const COLS = 4;
const TILE_W = 360;
const IMG_H = 220;
const LABEL_H = 46;
const GAP = 18;
const PAD = 40;
const HEADER_H = 70;
const GROUP_TITLE_H = 56;

const width = PAD * 2 + COLS * TILE_W + (COLS - 1) * GAP;
const body = [];
body.push(
  `<text x="${PAD}" y="${PAD}" font-family="monospace" font-size="26" font-weight="700" fill="#ffffff">MATTEO TIROCCHI — CONTACT SHEET</text>`
);

let col = 0;
let rowTop = PAD + HEADER_H;

function tileMarkup(item) {
  const x = PAD + col * (TILE_W + GAP);
  const abs = localFile(item.src);
  const parts = [];
  if (abs) {
    parts.push(
      `<image x="${x}" y="${rowTop}" width="${TILE_W}" height="${IMG_H}" preserveAspectRatio="xMidYMid slice" href="${dataUri(abs)}"/>`
    );
  } else {
    parts.push(`<rect x="${x}" y="${rowTop}" width="${TILE_W}" height="${IMG_H}" fill="#1a1f26"/>`);
    parts.push(
      `<text x="${x + 12}" y="${rowTop + IMG_H / 2}" font-family="monospace" font-size="13" fill="#ff6a6a">file mancante</text>`
    );
  }
  parts.push(
    `<text x="${x}" y="${rowTop + IMG_H + 22}" font-family="monospace" font-size="14" fill="#e8ecf1">${escapeXml(item.label)}</text>`
  );
  parts.push(
    `<text x="${x}" y="${rowTop + IMG_H + 40}" font-family="monospace" font-size="12" fill="#8b95a3">${escapeXml(item.src)}</text>`
  );
  return parts.join("\n");
}

for (const group of groups) {
  if (col !== 0) {
    col = 0;
    rowTop += IMG_H + LABEL_H + GAP;
  }
  body.push(
    `<text x="${PAD}" y="${rowTop + 24}" font-family="monospace" font-size="18" fill="#3b82f6">${escapeXml(group.title)}</text>`
  );
  rowTop += GROUP_TITLE_H;
  for (const item of group.items) {
    body.push(tileMarkup(item));
    col += 1;
    if (col >= COLS) {
      col = 0;
      rowTop += IMG_H + LABEL_H + GAP;
    }
  }
}

const height = (col === 0 ? rowTop : rowTop + IMG_H + LABEL_H + GAP) + PAD;
const total = groups.reduce((n, g) => n + g.items.length, 0);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="#090b0e"/>
${body.join("\n")}
</svg>
`;

mkdirSync(path.dirname(OUT), { recursive: true });
await writeFile(OUT, svg, "utf8");
// Also served at /anteprima-immagini.svg for quick review while the site runs.
const PUBLIC_OUT = path.join(PUBLIC, "anteprima-immagini.svg");
await writeFile(PUBLIC_OUT, svg, "utf8");
console.log(`Contact sheet: ${OUT} + ${PUBLIC_OUT} (${width}x${height}, ${total} foto)`);
