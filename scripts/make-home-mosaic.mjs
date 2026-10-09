// Fase redesign - Genera il mosaico quadrato usato come sfondo tiled della home.
// Un'unica immagine composta da tanti riquadri con immagini random del sito.
// La casualità "ad ogni visita" è gestita lato client con un background-position casuale.
import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const CONTENT = path.resolve("src/content");
const OUT = path.join(PUBLIC, "home-mosaic.webp");

const TILE = 128;
const GRID = 16; // 16 x 16 = 256 riquadri -> 2048 x 2048
const SIZE = TILE * GRID;

const EXTRA = [
  "/assets/home-console.png",
  "/assets/level-01-sheet.png",
  "/assets/adv-portfolio.png",
  "/assets/personal-works.png",
  "/assets/home-background-v2.png",
  "/assets/home-cards/home-card-adv-room.png",
  "/assets/home-cards/home-card-play-room.png",
  "/assets/home-cards/home-card-personal-room.png",
];

function collectPool() {
  const pool = new Set();

  const personal = JSON.parse(readFileSync(path.join(CONTENT, "personal.json"), "utf8"));
  for (const category of personal.categories) pool.add(category.cover);
  for (const item of personal.items) pool.add(item.thumb || item.image);

  const projectsDir = path.join(CONTENT, "projects");
  for (const file of readdirSync(projectsDir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(path.join(projectsDir, file), "utf8");
    for (const match of raw.matchAll(/^(?:cover|hero):\s*(\/assets\/[^\s]+)$/gm)) {
      pool.add(match[1]);
    }
  }

  for (const extra of EXTRA) pool.add(extra);

  return [...pool].filter((src) => {
    if (!src || !/\.(jpe?g|png|webp)$/i.test(src)) return false;
    if (src.includes(".opt-")) return false;
    const abs = path.join(PUBLIC, ...src.split("/").filter(Boolean));
    try {
      readFileSync(abs);
      return true;
    } catch {
      return false;
    }
  });
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function run() {
  const pool = collectPool();
  if (pool.length === 0) throw new Error("Nessuna immagine trovata per il mosaico");
  console.log(`Pool immagini: ${pool.length}`);

  const picked = shuffle(pool);
  const composites = [];
  const total = GRID * GRID;

  for (let i = 0; i < total; i++) {
    const src = picked[i % picked.length];
    const abs = path.join(PUBLIC, ...src.split("/").filter(Boolean));
    let tile;
    try {
      tile = await sharp(abs)
        .resize(TILE, TILE, { fit: "cover", position: "attention" })
        .toBuffer();
    } catch {
      tile = await sharp({
        create: { width: TILE, height: TILE, channels: 3, background: { r: 20, g: 24, b: 30 } },
      })
        .png()
        .toBuffer();
    }
    const col = i % GRID;
    const row = Math.floor(i / GRID);
    composites.push({ input: tile, top: row * TILE, left: col * TILE });
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: { r: 9, g: 11, b: 14 },
    },
  })
    .composite(composites)
    .webp({ quality: 52 })
    .toFile(OUT);

  const { size } = await import("node:fs").then((fs) => fs.promises.stat(OUT));
  console.log(`Mosaico creato: ${SIZE}x${SIZE}, ${(size / 1024).toFixed(0)} KB`);
  await writeFile(path.join(PUBLIC, "home-mosaic.meta.json"), JSON.stringify({ size: SIZE, tile: TILE, grid: GRID }));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
