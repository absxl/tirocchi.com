import { getPersonal, getProjects } from "./content";

export interface GalleryItem {
  id: string;
  category: string;
  image: string;
  title: string;
  meta?: string;
}

export interface GalleryCategory {
  slug: string;
  title: string;
  description: string;
  cover: string;
  count: number;
}

/**
 * Builds the Creatività gallery procedurally from the site's images, grouped by
 * category: project images (ADV) and the personal archive image categories.
 * Videos are excluded.
 */
export function getGallery(): { categories: GalleryCategory[]; items: GalleryItem[] } {
  const categories: GalleryCategory[] = [];
  const items: GalleryItem[] = [];

  // ADV — project covers + project images.
  const projects = getProjects();
  const adv: GalleryItem[] = [];
  for (const project of projects) {
    if (project.cover) {
      adv.push({
        id: `adv-${project.slug}`,
        category: "adv",
        image: project.cover,
        title: project.title,
        meta: `${project.client} · ${project.year}`,
      });
    }
    project.media
      .filter((media) => media.type === "image")
      .forEach((media, i) => {
        adv.push({
          id: `adv-${project.slug}-${i}`,
          category: "adv",
          image: media.src,
          title: project.title,
          meta: project.client,
        });
      });
  }
  if (adv.length) {
    items.push(...adv);
    categories.push({
      slug: "adv",
      title: "ADV",
      description: "Cover e visual dei progetti pubblicitari.",
      cover: projects[0]?.cover ?? adv[0].image,
      count: adv.length,
    });
  }

  // Personal archive — image categories only (videos excluded).
  const personal = getPersonal();
  for (const category of personal.categories) {
    const images = personal.items.filter(
      (item) => item.category === category.slug && item.type === "image" && (item.image || item.thumb)
    );
    if (!images.length) continue;
    images.forEach((item, i) => {
      items.push({
        id: `${category.slug}-${i}`,
        category: category.slug,
        image: item.image ?? item.thumb ?? "",
        title: item.title,
        meta: item.role,
      });
    });
    categories.push({
      slug: category.slug,
      title: category.title,
      description: category.description,
      cover: category.cover,
      count: images.length,
    });
  }

  return { categories, items };
}

export function getGalleryCategory(slug: string): GalleryCategory | undefined {
  return getGallery().categories.find((category) => category.slug === slug);
}

export function getGalleryItems(slug: string): GalleryItem[] {
  return getGallery().items.filter((item) => item.category === slug);
}
