import { getAboutPage, getMediaUrl } from '@/lib/strapi';
import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/lib/i18n';
import styles from './AboutPage.module.css';
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params as { lang: Locale }
  const isDE = lang === 'de'

  const title = isDE
    ? 'Über uns – Wings Graphic Machinery | WingsGM'
    : 'About Us – Wings Graphic Machinery | WingsGM'

  const description = isDE
    ? 'WingsGM handelt mit gebrauchten Maschinen für Druckereien und Verpackungshersteller in Europa. Persönlicher Service auf Englisch und Deutsch.'
    : 'WingsGM works with used equipment for print shops and packaging producers across Europe. Personal service in English and Deutsch.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wingsgm.com/${lang}/about`,
    },
    alternates: {
      canonical: `https://wingsgm.com/${lang}/about`,
      languages: {
        'en': 'https://wingsgm.com/en/about',
        'de': 'https://wingsgm.com/de/about',
      },
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };
  const [about, dict] = await Promise.all([
    getAboutPage().then((r) => r || {}),
    getDictionary(lang),
  ]);

  const p = dict.about_page;

  const heroTitle = (about as any)?.hero_title || p.heroFallbackTitle;
  const heroSubtitle = (about as any)?.hero_subtitle || p.heroFallbackSubtitle;
  const heroImageUrl = getMediaUrl((about as any)?.hero_image);

  const heroStyle = heroImageUrl
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.97) 32%, rgba(255,255,255,0.72) 56%, rgba(255,255,255,0.0) 82%), url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
      }
    : { backgroundColor: '#f9fafb' };

  return (
    <main>
      {/* HERO */}
      <section className={styles.hero} style={heroStyle}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow}>{p.heroEyebrow}</p>
              <h1 className={styles.heroTitle}>{heroTitle}</h1>
              <div className={styles.heroSubtitleCard}>
                <p className={styles.heroSubtitle}>{heroSubtitle}</p>
              </div>
              <div className={styles.heroHighlights}>
                <span>{p.highlight1}</span>
                <span>{p.highlight2}</span>
                <span>{p.highlight3}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className={styles.manifestoSection}>
        <div className="container">
          <div className={styles.manifestoInner}>
            <div className={styles.manifestoLeft}>
              <h2 className={styles.manifestoTitle}>
                Clear information.<br />
                Realistic pricing.<br />
                <em>Personal service.</em>
              </h2>
              <div className={styles.manifestoStats}>
                <div className={styles.manifestoStat}>
                  <div className={styles.manifestoStatVal}>EU<span>+</span></div>
                  <div className={styles.manifestoStatLabel}>Export</div>
                </div>
                <div className={styles.manifestoStat}>
                  <div className={styles.manifestoStatVal}>EN<span>·</span>DE</div>
                  <div className={styles.manifestoStatLabel}>Languages</div>
                </div>
                <div className={styles.manifestoStat}>
                  <div className={styles.manifestoStatVal}>B<span>2</span>B</div>
                  <div className={styles.manifestoStatLabel}>Direct</div>
                </div>
              </div>
            </div>
            <p className={styles.manifestoText}>{p.introLead}</p>
          </div>
        </div>
      </section>

      {/* SELLING */}
      <section className={styles.sellingSection}>
        <div className="container">
          <div className={styles.sectionEyebrow}>{p.sellingEyebrow}</div>
          <h2 className={styles.sectionTitle}>{p.sellingTitle}</h2>
          <span className={styles.sectionTag}>{p.sellingTag}</span>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>{p.sellingText}</p>
            <div className={styles.sectionList}>
              {[p.sellingList1, p.sellingList2, p.sellingList3, p.sellingList4].map((item, i) => (
                <div key={i} className={styles.sectionItem}>
                  <div className={`${styles.sectionItemDot} ${i >= 2 ? styles.sectionItemDotRed : ''}`} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BUYING */}
      <section className={styles.buyingSection}>
        <div className="container">
          <div className={styles.sectionEyebrow}>
            {p.buyingEyebrow}
          </div>
          <h2 className={styles.sectionTitle}>
            {p.buyingTitle}
          </h2>
          <div className={styles.sectionBody}>
            <p className={styles.sectionText}>
              {p.buyingText}
            </p>
            <div className={styles.sectionList}>
              <div className={styles.sectionItem}>
                <div className={styles.sectionItemDot} />
                {p.buyingList1}
              </div>
              <div className={styles.sectionItem}>
                <div className={styles.sectionItemDot} />
                {p.buyingList2}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.sectionEyebrow}>{p.servicesEyebrow}</div>
          <h2 className={styles.sectionTitle}>{p.servicesTitle}</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceCardTitle}>{p.service1Title}</h3>
              <p className={styles.serviceCardText}>{p.service1Text}</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceCardTitle}>{p.service2Title}</h3>
              <p className={styles.serviceCardText}>{p.service2Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className={styles.languagesSection}>
        <div className="container">
          <div className={styles.languagesInner}>
            <div>
              <h2 className={styles.languagesTitle}>{p.langsTitle}</h2>
              <p className={styles.languagesSubtitle}>{p.langsSubtitle}</p>
            </div>
            <div className={styles.languagesCards}>
              <div className={styles.languageCard}>
                <div className={`${styles.languageBadge} ${styles.langEN}`}>EN</div>
                <div>
                  <div className={styles.languageName}>{p.lang1Label}</div>
                  <div className={styles.languageDesc}>{p.lang1Desc}</div>
                </div>
              </div>
              <div className={styles.languageCard}>
                <div className={`${styles.languageBadge} ${styles.langDE}`}>DE</div>
                <div>
                  <div className={styles.languageName}>{p.lang2Label}</div>
                  <div className={styles.languageDesc}>{p.lang2Desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
