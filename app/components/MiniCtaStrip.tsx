import Link from "next/link";
import styles from "./HomeSections.module.css";

type Props = { dict: any; lang: string };

export default function MiniCtaStrip({ dict, lang }: Props) {
  const h = dict.home;
  return (
    <section className={styles.miniCtaSection}>
      <div className="container">
        <div className={styles.miniCtaInner}>
          <div className={styles.miniCtaText}>
            <p className={styles.miniCtaEyebrow}>Get in touch</p>
            <p className={styles.miniCtaMain}>{h.ctaText}</p>
            <p className={styles.miniCtaSub}>{h.ctaTextStrong}</p>
          </div>
          <Link href={`/${lang}/contact`}
            className={styles.miniCtaButton}>
            {h.ctaButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
