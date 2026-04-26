import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/lib/i18n';
import ContactForm from './ContactForm';
import styles from './ContactPage.module.css';
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params as { lang: Locale }
  const isDE = lang === 'de'

  const title = isDE
    ? 'Kontakt – Wings Graphic Machinery | WingsGM'
    : 'Contact – Wings Graphic Machinery | WingsGM'

  const description = isDE
    ? 'Kontaktieren Sie WingsGM für gebrauchte Druckmaschinen – Kauf, Verkauf und Projektbegleitung in Europa. Wir antworten persönlich auf Englisch und Deutsch.'
    : 'Contact WingsGM for used printing machinery – buying, selling and project support across Europe. We respond personally in English and Deutsch.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wingsgm.com/${lang}/contact`,
    },
    alternates: {
      canonical: `https://wingsgm.com/${lang}/contact`,
      languages: {
        'en': 'https://wingsgm.com/en/contact',
        'de': 'https://wingsgm.com/de/contact',
      },
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };
  const dict = await getDictionary(lang);
  const p = dict.contact_page;

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow}>{p.heroEyebrow}</p>
              <h1 className={styles.heroTitle}>{p.heroTitle}</h1>
              <p className={styles.heroSubtitle}>{p.heroSubtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.contentGrid}>
            {/* INFO */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>{p.infoTitle}</h2>
                <p className={styles.infoText}>{p.infoText}</p>

                <div className={styles.contactRow}>
                  <div className={`${styles.contactIcon} ${styles.iconRed}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                    </svg>
                  </div>
                  <a href="tel:+4367764759508" className={styles.contactValue}>+43 677 647 595 08</a>
                </div>

                <div className={styles.contactRow}>
                  <div className={`${styles.contactIcon} ${styles.iconRed}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <polyline points="2,4 12,13 22,4"/>
                    </svg>
                  </div>
                  <a href="mailto:office@wingsgm.com" className={styles.contactValue}>office@wingsgm.com</a>
                </div>

                <div className={styles.contactRow}>
                  <div className={`${styles.contactIcon} ${styles.iconBlue}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <span className={styles.contactValue}>Vienna, Austria</span>
                </div>

                <div className={styles.infoNotice}>
                  <p>{p.infoNote}</p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className={styles.formCol}>
              <ContactForm dict={p} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
