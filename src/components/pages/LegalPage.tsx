import { PageTransition } from "@/components/motion/PageTransition";
import styles from "./SimplePages.module.css";

export function LegalPage({
  title,
  body,
  note,
}: {
  title: string;
  body: string;
  note: string;
}) {
  return (
    <PageTransition>
      <div className={`container ${styles.wrap}`}>
        <header className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
        </header>
        <section className={styles.section}>
          <p className={styles.lead}>{body}</p>
          <p className={styles.placeholder}>{note}</p>
        </section>
      </div>
    </PageTransition>
  );
}
