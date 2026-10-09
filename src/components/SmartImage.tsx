"use client";

import manifest from "@/content/images.json";

interface Variant {
  src: string;
  width: number;
}

interface ImageMeta {
  width: number;
  height: number;
  avif: Variant[];
  webp: Variant[];
}

const DATA = manifest as Record<string, ImageMeta>;

function toSrcSet(variants: Variant[]): string {
  return variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}

export function SmartImage({
  src,
  alt,
  sizes = "100vw",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const meta = DATA[src];
  const loading = priority ? "eager" : "lazy";

  if (!meta || (meta.avif.length === 0 && meta.webp.length === 0)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  return (
    <picture>
      {meta.avif.length > 0 && (
        <source type="image/avif" srcSet={toSrcSet(meta.avif)} sizes={sizes} />
      )}
      {meta.webp.length > 0 && (
        <source type="image/webp" srcSet={toSrcSet(meta.webp)} sizes={sizes} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        width={meta.width}
        height={meta.height}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
