import { getFeaturedProjects, getPersonal, getProjects, getSite } from "./content";

export function getSocialList() {
  const site = getSite();
  return [
    { label: "Instagram", url: site.social.instagram },
    { label: "Behance", url: site.social.behance },
    { label: "LinkedIn", url: site.social.linkedin },
  ].filter((item) => item.url);
}

export function getLandingData() {
  const projects = getFeaturedProjects().map((project) => ({
    slug: project.slug,
    no: project.no,
    client: project.client,
    title: project.title,
    year: project.year,
    category: project.category,
    cover: project.cover,
    coverAlt: project.coverAlt,
  }));
  const categories = getPersonal().categories.map((category) => ({
    slug: category.slug,
    title: category.title,
    count: category.count,
    cover: category.cover,
    description: category.description,
  }));
  return { projects, categories, social: getSocialList() };
}

export function getLavoriProjects() {
  return getProjects().map((project) => ({
    slug: project.slug,
    no: project.no,
    client: project.client,
    title: project.title,
    year: project.year,
    category: project.category,
    group: project.group,
    cover: project.cover,
    coverAlt: project.coverAlt,
    role: project.role,
  }));
}
