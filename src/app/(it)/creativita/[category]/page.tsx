import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/creativita/CategoryView";
import { getGallery, getGalleryCategory, getGalleryItems } from "@/lib/gallery";
import { pageAlternates } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGallery().categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getGalleryCategory(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: pageAlternates(
      `/creativita/${slug}`,
      `/creativita/${slug}`,
      `/en/creativity/${slug}`
    ),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getGalleryCategory(slug);
  if (!category) notFound();
  return <CategoryView lang="it" category={category} items={getGalleryItems(slug)} />;
}
