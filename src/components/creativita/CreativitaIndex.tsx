import Link from "next/link";
import { categoryHref, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery";
import { SmartImage } from "@/components/SmartImage";
import { Slideshow } from "@/components/gallery/Slideshow";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Creativita.module.css";

export function CreativitaIndex({
  lang,
  categories,
  reel,
}: {
  lang: Locale;
  categories: GalleryCategory[];
  reel: GalleryItem[];
}) {
  const dict = getDictionary(lang);

  return (
    <PageTransition>
      <div className={`container ${styles.index}`}>
      <header className={styles.head}>
        <span className="eyebrow">{dict.creativita.eyebrow}</span>
        <h1 className={styles.title}>{dict.creativita.title}</h1>
        <p className={styles.intro}>{dict.creativita.intro}</p>
      </header>

      <section aria-label={dict.creativita.categoriesLabel}>
        <Reveal as="ul" className={styles.categories} stagger>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={categoryHref(lang, category.slug)} className={styles.categoryCard}>
                <span className={styles.categoryMedia}>
                  <SmartImage
                    src={category.cover}
                    alt={category.title}
                    sizes="(min-width: 1200px) 18rem, 45vw"
                  />
                </span>
                <span className={`mono ${styles.categoryCount}`}>
                  {String(category.count).padStart(2, "0")} {dict.creativita.works}
                </span>
                <span className={styles.categoryTitle}>{category.title}</span>
                <span className={styles.categoryDesc}>{category.description}</span>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>

      {reel.length > 0 && (
        <section className={styles.reelSection} aria-label={dict.progetto.gallery}>
          <span className="eyebrow">{dict.progetto.gallery}</span>
          <Slideshow
            label={dict.progetto.gallery}
            prevLabel={dict.creativita.previous}
            nextLabel={dict.creativita.next}
            sizes="(min-width: 768px) 46vw, 92vw"
            items={reel.map((item) => ({
              id: item.id,
              image: item.image,
              alt: item.title,
              title: item.title,
              meta: item.meta,
              href: categoryHref(lang, "cover-art"),
            }))}
          />
        </section>
      )}
      </div>
    </PageTransition>
  );
}
