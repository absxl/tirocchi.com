// Fase 0 - Estrae i contenuti reali dal sito attuale e li scrive in src/content.
// - src/content/projects/<slug>.md  (frontmatter + corpo Markdown)
// - src/content/personal.json       (archivio CREATIVITÀ)
// - src/content/site.json           (dati generali, con placeholder [DA COMPILARE])
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { dump as yamlDump } from "js-yaml";

const ORIGIN = "https://matteo-portfolio.piragna2003.chatgpt.site";
const OUT = path.resolve(process.cwd(), "src", "content");

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function main() {
  return Promise.all([
    fetchText(`${ORIGIN}/app.js`),
    fetchText(`${ORIGIN}/personal-galleries.js`),
  ]).then(([appJs, galleriesJs]) => ({ appJs, galleriesJs }));
}

function parseProjects(appJs) {
  const start = appJs.indexOf("const assets =");
  const end = appJs.indexOf("const personalArchive =");
  const code = appJs.slice(start, end);
  const sandbox = {};
  return vm.runInNewContext(
    `(() => { ${code}; return { assets, projects, personalCategories, aiSeries }; })()`,
    sandbox,
    { timeout: 15000 }
  );
}

function parseGallery(galleriesJs) {
  const sandbox = { window: {} };
  vm.runInNewContext(galleriesJs, sandbox, { timeout: 15000 });
  return sandbox.window.PERSONAL_GALLERIES || {};
}

function buildProjects(data) {
  const projects = data.projects.filter(Boolean);
  return projects.map((p, index) => {
    const titlePlain = String(p.title).replace(/\n/g, " ");
    const titleLines = String(p.title).split("\n");
    const slug = slugify(`${p.brand} ${titlePlain}`);
    const media = (p.media || []).map((m) => ({
      type: m.type,
      src: m.src,
      poster: m.poster || undefined,
      alt: m.alt,
      group: m.group || undefined,
    }));
    return {
      slug,
      no: p.no,
      order: index + 1,
      featured: true,
      client: p.brand,
      title: titlePlain,
      titleLines,
      year: p.year,
      category: p.category,
      group: "ADV",
      role: p.roleSummary,
      formats: p.formats,
      contextType: p.contextType,
      roleNote: p.roleNote,
      credits: p.credits || [],
      cover: p.thumb,
      coverAlt: `Copertina del progetto ${p.brand} — ${titlePlain}`,
      hero: p.hero || p.thumb,
      position: p.position || "center",
      intro: p.intro || "",
      context: p.context || "",
      insight: p.insight || "",
      idea: p.idea || "",
      execution: p.execution || "",
      media,
    };
  });
}

function buildArchive(archive) {
  const ai = archive["ai-art"] || [];
  const coverArt = archive["cover-art"] || [];
  const photography = archive["photography"] || [];
  const experiments = archive["experiments"] || [];
  const video = archive["music-videos"] || [];
  const aiVideo = [
    ...ai.filter((i) => i.type === "video"),
    ...(archive["ai-videos"] || []),
  ];

  const categories = [
    { slug: "ai-art", title: "AI ART", description: "Ricerca visiva con AI tra materia, figure e mondi sintetici.", cover: "/assets/personal-cover-ai-shooting.jpg" },
    { slug: "cover-art", title: "COVER ART", description: "Cover e identità visive per la musica.", cover: "/assets/personal-gallery/cover-art/00002.jpg" },
    { slug: "photography", title: "FOTO", description: "Osservazione fotografica, luce e composizione.", cover: "/assets/personal-cover-photography.png" },
    { slug: "video", title: "VIDEO", description: "Regia, montaggio e immaginari musicali.", cover: "/assets/personal-video/posters/video-category-cover.png" },
    { slug: "video-ai", title: "VIDEO AI", description: "Video generativi e studi in movimento sviluppati con AI.", cover: "/assets/personal-video/posters/video-ai-category.jpg" },
    { slug: "experiments", title: "ESPERIMENTI", description: "Motion e prove visive fuori formato.", cover: "/assets/personal-experiments/experiment-01.webp" },
  ];

  const make = (items, categorySlug) =>
    items.map((item, i) => ({
      id: `${categorySlug}-${i + 1}`,
      category: categorySlug,
      type: item.type || "image",
      image: item.image || undefined,
      thumb: item.thumb || item.image || undefined,
      video: item.video || undefined,
      title: item.title,
      year: item.year || "2026",
      role: item.role || "",
    }));

  const items = [
    ...make(ai, "ai-art"),
    ...make(coverArt, "cover-art"),
    ...make(photography, "photography"),
    ...make(experiments, "experiments"),
    ...make(video, "video"),
    ...make(aiVideo, "video-ai"),
  ];

  const withCounts = categories.map((c) => ({
    ...c,
    count: items.filter((i) => i.category === c.slug).length,
  }));

  return { categories: withCounts, items };
}

const FALLBACK = "[DA COMPILARE]";

const site = {
  name: "Matteo Tirocchi",
  role: "Art Director",
  tagline: "ADV Portfolio",
  location: FALLBACK,
  email: FALLBACK,
  bio: FALLBACK,
  social: {
    instagram: "https://www.instagram.com/shinji.pdn/",
    behance: "https://www.behance.net/matteoshinji",
    linkedin: "https://www.linkedin.com/in/matteo-tirocchi-663528273/",
  },
  skills: ["Art Direction", "Advertising", FALLBACK],
  awards: [],
};

function frontmatter(project) {
  return yamlDump(
    {
      client: project.client,
      title: project.title,
      year: project.year,
      role: project.role,
      category: project.category,
      group: project.group,
      cover: project.cover,
      coverAlt: project.coverAlt,
      hero: project.hero,
      position: project.position,
      featured: project.featured,
      order: project.order,
      formats: project.formats,
      contextType: project.contextType,
      credits: project.credits,
      media: project.media,
    },
    { lineWidth: 120, noRefs: true }
  );
}

function body(project) {
  const sections = [
    project.intro,
    project.context ? `## Contesto\n\n${project.context}` : "",
    project.insight ? `## Insight\n\n${project.insight}` : "",
    project.idea ? `## Idea\n\n${project.idea}` : "",
    project.execution ? `## Sviluppo\n\n${project.execution}` : "",
    project.roleNote ? `## Il mio ruolo\n\n${project.roleNote}` : "",
  ];
  return sections.filter(Boolean).join("\n\n") + "\n";
}

async function run() {
  const { appJs, galleriesJs } = await main();
  const data = parseProjects(appJs);
  const archive = parseGallery(galleriesJs);
  const projects = buildProjects(data);
  const personal = buildArchive(archive);

  const projectsDir = path.join(OUT, "projects");
  await mkdir(projectsDir, { recursive: true });

  for (const project of projects) {
    const file = path.join(projectsDir, `${project.slug}.md`);
    const content = `---\n${frontmatter(project)}---\n\n${body(project)}`;
    await writeFile(file, content, "utf8");
  }

  await writeFile(path.join(OUT, "personal.json"), JSON.stringify(personal, null, 2), "utf8");
  await writeFile(path.join(OUT, "site.json"), JSON.stringify(site, null, 2), "utf8");

  console.log(`Progetti scritti: ${projects.length}`);
  projects.forEach((p) => console.log(`  - ${p.slug} (${p.no})`));
  console.log(`Archivio: ${personal.categories.length} categorie, ${personal.items.length} elementi`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
