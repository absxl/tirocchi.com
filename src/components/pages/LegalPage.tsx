import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./SimplePages.module.css";

export interface LegalSection {
  title: string;
  body: string;
}

export function LegalPage({
  title,
  sections,
  updated,
  disclaimer,
}: {
  title: string;
  sections: LegalSection[];
  updated: string;
  disclaimer: string;
}) {
  return (
    <PageTransition>
      <div className={`container ${styles.wrap} ${styles.legal}`}>
        <header className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
          <p className={`mono ${styles.updated}`}>{updated}</p>
        </header>

        <ol className={styles.legalList}>
          {sections.map((section, index) => (
            <Reveal as="li" key={section.title} className={styles.legalItem}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNo}>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <p className={styles.legalBody}>{section.body}</p>
            </Reveal>
          ))}
        </ol>

        <p className={styles.disclaimer}>{disclaimer}</p>
      </div>
    </PageTransition>
  );
}
