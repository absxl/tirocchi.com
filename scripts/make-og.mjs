// Fase 3 - Genera l'immagine Open Graph (1200x630) a partire da un asset reale.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("public/assets/personal-cover-ai-shooting.jpg");
const OUT = path.resolve("public/og.png");

const WIDTH = 1200;
const HEIGHT = 630;

async function run() {
  const input = await readFile(SOURCE);
  const base = await sharp(input)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.62, saturation: 0.9 })
    .png()
    .toBuffer();

  const overlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#090b0e" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#090b0e" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
      <rect x="0" y="0" width="14" height="${HEIGHT}" fill="#d7ff3a"/>
    </svg>`
  );

  await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toFile(OUT);
  const stat = await sharp(OUT).metadata();
  console.log(`og.png creato: ${stat.width}x${stat.height}`);
  await writeFile(OUT.replace("og.png", "og.size.txt"), `${stat.width}x${stat.height}\n`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
