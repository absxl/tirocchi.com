import Link from "next/link";
import { categoryHref, getDictionary } from "@/lib/i18n";
import type { ArchiveCategory, ArchiveItem, Locale } from "@/lib/types";
import { SmartImage } from "@/components/SmartImage";
import { CoverReel } from "./CoverReel";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Creativita.module.css";

export function CreativitaIndex({
  lang,
  categories,
  reel,
}: {
  lang: Locale;
  categories: ArchiveCategory[];
  reel: ArchiveItem[];
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
          <CoverReel
            items={reel.map((item) => ({ title: item.title, image: item.thumb ?? item.image ?? "" }))}
            hint={dict.landing.hintPointer}
          />
        </section>
      )}
      </div>
    </PageTransition>
  );
}
