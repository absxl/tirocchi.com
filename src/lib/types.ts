export type Locale = "it" | "en";

export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  src: string;
  poster?: string;
  alt: string;
  group?: string;
}

export interface Project {
  slug: string;
  no: string;
  order: number;
  featured: boolean;
  client: string;
  title: string;
  titleLines: string[];
  year: string;
  category: string;
  group: string;
  role: string;
  formats: string;
  contextType: string;
  roleNote: string;
  credits: string[];
  cover: string;
  coverAlt: string;
  hero: string;
  position: string;
  intro: string;
  context: string;
  insight: string;
  idea: string;
  execution: string;
  media: MediaItem[];
  bodyHtml: string;
}

export interface SocialLinks {
  instagram: string;
  behance: string;
  linkedin: string;
}

export interface SiteInfo {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  phone?: string;
  bio: string;
  social: SocialLinks;
  skills: string[];
  softSkills: string[];
  experience: { period: string; role: string; detail: string }[];
  education: { year: string; title: string; institution: string }[];
  awards: { year: string; title: string; detail: string; url?: string }[];
}

export interface ArchiveItem {
  id: string;
  category: string;
  type: MediaType;
  image?: string;
  thumb?: string;
  video?: string;
  title: string;
  year: string;
  role: string;
}

export interface ArchiveCategory {
  slug: string;
  title: string;
  description: string;
  cover: string;
  count: number;
}

export interface PersonalArchive {
  categories: ArchiveCategory[];
  items: ArchiveItem[];
}
