import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type {
  ArchiveCategory,
  ArchiveItem,
  MediaItem,
  PersonalArchive,
  Project,
  SiteInfo,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string;
}

function toMedia(value: unknown): MediaItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const item = entry as Record<string, unknown>;
    return {
      type: item.type === "video" ? "video" : "image",
      src: String(item.src ?? ""),
      poster: item.poster ? String(item.poster) : undefined,
      alt: String(item.alt ?? ""),
      group: item.group ? String(item.group) : undefined,
    };
  });
}

function loadProjects(): Project[] {
  const files = readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".md"));
  const projects = files.map((file) => {
    const raw = readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const title = String(data.title ?? "");
    return {
      slug,
      no: String(data.no ?? "").padStart(2, "0"),
      order: Number(data.order ?? 0),
      featured: Boolean(data.featured),
      client: String(data.client ?? ""),
      title,
      titleLines: String(data.title ?? "").split("\n"),
      year: String(data.year ?? ""),
      category: String(data.category ?? ""),
      group: String(data.group ?? "ADV"),
      role: String(data.role ?? ""),
      formats: String(data.formats ?? ""),
      contextType: String(data.contextType ?? ""),
      roleNote: String(data.roleNote ?? ""),
      credits: Array.isArray(data.credits) ? data.credits.map(String) : [],
      cover: String(data.cover ?? ""),
      coverAlt: String(data.coverAlt ?? title),
      hero: String(data.hero ?? data.cover ?? ""),
      position: String(data.position ?? "center"),
      intro: String(data.intro ?? ""),
      context: String(data.context ?? ""),
      insight: String(data.insight ?? ""),
      idea: String(data.idea ?? ""),
      execution: String(data.execution ?? ""),
      media: toMedia(data.media),
      bodyHtml: renderMarkdown(content),
    } satisfies Project;
  });

  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return Number(b.year) - Number(a.year);
  });
}

function loadJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(CONTENT_DIR, file), "utf8")) as T;
}

let projectsCache: Project[] | null = null;

export function getProjects(): Project[] {
  if (!projectsCache) projectsCache = loadProjects();
  return projectsCache;
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getProjectNeighbours(slug: string): {
  previous: Project;
  next: Project;
} {
  const projects = getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { previous, next };
}

export function getSite(): SiteInfo {
  return loadJson<SiteInfo>("site.json");
}

export function getPersonal(): PersonalArchive {
  return loadJson<PersonalArchive>("personal.json");
}

export function getArchiveCategory(slug: string): ArchiveCategory | undefined {
  return getPersonal().categories.find((category) => category.slug === slug);
}

export function getArchiveItems(category: string): ArchiveItem[] {
  return getPersonal().items.filter((item) => item.category === category);
}
