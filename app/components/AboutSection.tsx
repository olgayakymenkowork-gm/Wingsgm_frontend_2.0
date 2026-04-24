import styles from "./HomeSections.module.css";

type Props = { dict: any };

export default function AboutSection({ dict }: Props) {
  const a = dict.about;
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className={styles.aboutInner}>
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutTitle}>{a.title}</h2>
            <p className={styles.aboutBody}>{a.p1}</p>
          </div>
          <div className={styles.aboutRight}>
            <p className={styles.aboutBody}>{a.p2}</p>
            <div className={styles.aboutChips}>
              <span>{a.chip1}</span>
              <span>{a.chip2}</span>
              <span>{a.chip3}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
