import manifest from "@/content/images.json";

interface Variant {
  src: string;
  width: number;
}

const DATA = manifest as Record<string, { webp: Variant[]; avif: Variant[] }>;

/** Smallest optimized WebP variant for a source image (falls back to the source). */
export function smallVariant(src: string): string {
  const meta = DATA[src];
  if (meta && meta.webp.length > 0) {
    const smallest = [...meta.webp].sort((a, b) => a.width - b.width)[0];
    return smallest.src;
  }
  return src;
}

/** Largest optimized WebP variant up to `max` width (falls back to the source). */
export function largeVariant(src: string, max = 1600): string {
  const meta = DATA[src];
  if (meta && meta.webp.length > 0) {
    const sorted = [...meta.webp].sort((a, b) => b.width - a.width);
    const pick = sorted.find((variant) => variant.width <= max) ?? sorted[sorted.length - 1];
    if (pick) return pick.src;
  }
  return src;
}
