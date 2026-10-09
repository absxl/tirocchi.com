import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/creativita/CategoryView";
import { getArchiveCategory, getArchiveItems, getPersonal } from "@/lib/content";
import { pageAlternates } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPersonal().categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getArchiveCategory(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: pageAlternates(
      `/en/creativity/${slug}`,
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
  const category = getArchiveCategory(slug);
  if (!category) notFound();
  return <CategoryView lang="en" category={category} items={getArchiveItems(slug)} />;
}
