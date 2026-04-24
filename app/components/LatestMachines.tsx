import Link from "next/link";
import styles from "./HomeSections.module.css";
import FadeIn from "./FadeIn";

type MachineImage = { url: string; alt: string };
type Machine = {
  id: number; slug: string; title: string;
  brand?: string; year?: string | number;
  format?: string; location?: string;
  price?: string | number; machine_status?: string;
  cardImage?: MachineImage; images: MachineImage[];
};
type Props = { machines: Machine[]; dict: any; lang: string };

export default function LatestMachines({ machines, dict, lang }: Props) {
  if (!machines || machines.length === 0) return null;
  const h = dict.home;

  return (
    <section className={styles.latestSection}>
      <div className="container">
        <h2 className={styles.latestTitle}>{h.latestTitle}</h2>
        <div className={styles.latestGrid}>
          {machines.map((machine, index) => {
            const img = machine.cardImage || machine.images?.[0];
            const meta = [machine.year, machine.format, machine.location]
              .filter(Boolean).join(' · ');
            return (
              <FadeIn key={machine.id} delay={index * 80}>
                <Link
                  href={`/${lang}/machine/${machine.slug}`}
                  className={styles.machineCard}
                >
                  <div className={styles.machineThumb}>
                    {machine.machine_status && (
                      <span className={`${styles.machineBadge} ${styles[`machineBadge__${machine.machine_status}`]}`}>
                        {machine.machine_status.toUpperCase()}
                      </span>
                    )}
                    {img
                      ? <img src={img.url} alt={img.alt} />
                      : <div className={styles.machineThumbEmpty} />}
                  </div>
                  <div className={styles.machineBody}>
                    {machine.brand && (
                      <p className={styles.machineBrand}>{machine.brand}</p>
                    )}
                    <h3 className={styles.machineName}>{machine.title}</h3>
                    {meta && <p className={styles.machineMeta}>{meta}</p>}
                    <span className={styles.machineLink}>see more →</span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
        <div className={styles.latestButtonRow}>
          <Link href={`/${lang}/stock-list`} className={styles.latestButton}>
            {h.seeFullStock}
          </Link>
        </div>
      </div>
    </section>
  );
}
