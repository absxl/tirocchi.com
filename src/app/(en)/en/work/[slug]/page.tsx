import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/progetto/ProjectView";
import { getProject, getProjectNeighbours, getProjects } from "@/lib/content";
import { pageAlternates } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = project.intro || project.coverAlt;
  return {
    title: `${project.client} — ${project.title}`,
    description,
    alternates: pageAlternates(`/en/work/${slug}`, `/lavori/${slug}`, `/en/work/${slug}`),
    openGraph: {
      title: `${project.client} — ${project.title}`,
      description,
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { previous, next } = getProjectNeighbours(slug);

  return <ProjectView lang="en" project={project} previous={previous} next={next} />;
}
