import Link from "next/link";
import { getDictionary, href } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery";
import { CategoryGallery } from "./CategoryGallery";
import { PageTransition } from "@/components/motion/PageTransition";
import styles from "./Creativita.module.css";

export function CategoryView({
  lang,
  category,
  items,
}: {
  lang: Locale;
  category: GalleryCategory;
  items: GalleryItem[];
}) {
  const dict = getDictionary(lang);

  return (
    <PageTransition>
      <div className="container">
      <header className={styles.categoryHead}>
        <Link href={href(lang, "creativita")} className={styles.categoryBack}>
          {dict.creativita.backToCategories}
        </Link>
        <span className="eyebrow">{dict.creativita.collection}</span>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.intro}>{category.description}</p>
        <span className="mono">
          {String(items.length).padStart(2, "0")} {dict.creativita.works}
        </span>
      </header>

      {items.length > 0 ? (
        <CategoryGallery lang={lang} items={items} />
      ) : (
        <p className={styles.intro}>{dict.creativita.empty}</p>
      )}
      </div>
    </PageTransition>
  );
}
