// Fase 0 - Scarica gli asset reali del sito attuale di Matteo dentro public/assets.
// Enumerazione: regex su app.js + esecuzione in sandbox di personal-galleries.js.
import { mkdir, writeFile, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import vm from "node:vm";

const ORIGIN = "https://matteo-portfolio.piragna2003.chatgpt.site";
const OUT_ROOT = path.resolve(process.cwd(), "public");
const CONCURRENCY = 8;

const MANUAL = [
  "/assets/branding/logowhite.png",
  "/assets/branding/favicon-demone.png",
];

function collectAssetsFromText(text) {
  const found = new Set();
  const re = /\/assets\/[A-Za-z0-9._@/\-]+/g;
  for (const match of text.matchAll(re)) found.add(match[0]);
  return found;
}

function collectAssetsFromGallery(gallery) {
  const found = new Set();
  const visit = (value) => {
    if (typeof value === "string") {
      if (value.startsWith("/assets/")) found.add(value);
      return;
    }
    if (Array.isArray(value)) return value.forEach(visit);
    if (value && typeof value === "object") return Object.values(value).forEach(visit);
  };
  visit(gallery);
  return found;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function download(assetPath) {
  const clean = assetPath.split("?")[0];
  const dest = path.join(OUT_ROOT, ...clean.split("/").filter(Boolean));
  if (await exists(dest)) return { assetPath, status: "skip" };
  await mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(ORIGIN + clean);
  if (!res.ok || !res.body) return { assetPath, status: `http ${res.status}` };
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return { assetPath, status: "ok" };
}

async function pool(items, size, worker) {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: size }, async () => {
    while (index < items.length) {
      const current = items[index++];
      try {
        results.push(await worker(current));
      } catch (error) {
        results.push({ assetPath: current, status: `err ${error.message}` });
      }
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  console.log("Fetch app.js + personal-galleries.js ...");
  const [appJs, galleriesJs] = await Promise.all([
    fetchText(`${ORIGIN}/app.js`),
    fetchText(`${ORIGIN}/personal-galleries.js`),
  ]);

  const fromApp = collectAssetsFromText(appJs);

  const sandbox = { window: {} };
  vm.runInNewContext(galleriesJs, sandbox, { timeout: 15000 });
  const fromGallery = collectAssetsFromGallery(sandbox.window.PERSONAL_GALLERIES || {});

  const all = new Set([...fromApp, ...fromGallery, ...MANUAL]);
  const list = [...all].sort();
  console.log(`Asset unici trovati: ${list.length}`);

  const results = await pool(list, CONCURRENCY, download);
  const ok = results.filter((r) => r.status === "ok").length;
  const skip = results.filter((r) => r.status === "skip").length;
  const failed = results.filter((r) => !["ok", "skip"].includes(r.status));

  console.log(`Scaricati: ${ok} | già presenti: ${skip} | falliti: ${failed.length}`);
  for (const f of failed) console.log(`  FAIL ${f.status}  ${f.assetPath}`);

  await mkdir(path.join(OUT_ROOT, "assets"), { recursive: true });
  await writeFile(
    path.join(OUT_ROOT, "assets", "_manifest.json"),
    JSON.stringify({ origin: ORIGIN, total: list.length, downloaded: ok, failed: failed.length, failedList: failed }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
