// Fase 3 - Genera varianti AVIF/WebP delle immagini usate in griglie/card
// e un manifest usato dal componente <SmartImage>.
import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const CONTENT = path.resolve("src/content");
const MANIFEST = path.join(CONTENT, "images.json");
const WIDTHS = [480, 960, 1600];

function collectSources() {
  const sources = new Set();

  const projectsDir = path.join(CONTENT, "projects");
  for (const file of readdirSync(projectsDir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(path.join(projectsDir, file), "utf8");
    for (const match of raw.matchAll(/^(?:cover|hero):\s*(\/assets\/[^\s]+)$/gm)) {
      sources.add(match[1]);
    }
  }

  const personal = JSON.parse(readFileSync(path.join(CONTENT, "personal.json"), "utf8"));
  for (const category of personal.categories) sources.add(category.cover);
  for (const item of personal.items) {
    if (item.thumb) sources.add(item.thumb);
    else if (item.image) sources.add(item.image);
  }

  return [...sources].filter((src) => /\.(jpe?g|png|webp)$/i.test(src));
}

function localPath(src) {
  return path.join(PUBLIC, ...src.split("/").filter(Boolean));
}

async function variantPath(src, width, format) {
  const dir = path.dirname(src);
  const base = path.basename(src).replace(/\.[^.]+$/, "");
  return `${dir}/${base}.opt-${width}.${format}`;
}

async function run() {
  const sources = collectSources();
  console.log(`Immagini da ottimizzare: ${sources.length}`);
  const manifest = {};

  for (const src of sources) {
    const abs = localPath(src);
    let meta;
    try {
      meta = await sharp(abs).metadata();
    } catch {
      continue;
    }
    if (!meta.width || !meta.height) continue;

    const variants = { avif: [], webp: [] };
    for (const width of WIDTHS) {
      if (width > meta.width * 1.05) continue;
      for (const format of ["avif", "webp"]) {
        const outRel = await variantPath(src, width, format);
        const outAbs = path.join(PUBLIC, ...outRel.split("/").filter(Boolean));
        mkdirSync(path.dirname(outAbs), { recursive: true });
        await sharp(abs)
          .resize({ width })
          .toFormat(format, { quality: format === "avif" ? 52 : 76 })
          .toFile(outAbs);
        variants[format].push({ src: outRel, width });
      }
    }

    if (variants.avif.length || variants.webp.length) {
      manifest[src] = {
        width: meta.width,
        height: meta.height,
        avif: variants.avif,
        webp: variants.webp,
      };
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Manifest scritto: ${Object.keys(manifest).length} immagini`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
