import Link from 'next/link'
import styles from './Layout.module.css'

type Props = {
  dict: any
  lang: string
}

export default function Footer({ dict, lang }: Props) {
  const f = dict.footer

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>

        {/* LEFT */}
        <div className={styles.left}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-wingsgm-w.png"
            alt="WingsGM"
            className={styles.logo}
          />
          <p className={styles.desc}>{f.desc}</p>
        </div>

        {/* CENTER */}
        <div className={styles.center}>
          <h4 className={styles.columnTitle}>{f.navTitle}</h4>
          <Link href={`/${lang}/stock-list`} className={styles.link}>{f.stockList}</Link>
          <Link href={`/${lang}/about`} className={styles.link}>{f.about}</Link>
          <Link href={`/${lang}/contact`} className={styles.link}>{f.contact}</Link>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h4 className={styles.columnTitle}>{f.contactsTitle}</h4>
          <div className={styles.contactsBox}>
            <a
              href="mailto:office@wingsgm.com"
              className={styles.contactLink}
            >
              {f.email}
            </a>
            <a
              href="tel:+4367764759508"
              className={styles.contactLink}
            >
              {f.phone}
            </a>
            <p>{f.location}</p>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} WingsGM. {f.rights}
      </div>
    </footer>
  )
}
