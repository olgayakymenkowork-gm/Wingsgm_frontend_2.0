import { notFound } from "next/navigation";
import { getMachineBySlug } from "@/lib/strapi";
import { getDictionary } from "@/lib/getDictionary";
import { Locale } from "@/lib/i18n";
import MachineGallery from "./MachineGallery";
import MachineRequestForm from "./MachineRequestForm";
import BackButton from "./BackButton";
import styles from "./MachinePage.module.css";
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const m = await getMachineBySlug(slug)

  if (!m) return { title: 'Machine not found | WingsGM' }

  const isDE = lang === 'de'

  const parts = [m.title]
  if (m.brand) parts.push(m.brand)
  if (m.year) parts.push(String(m.year))
  if (m.format) parts.push(m.format)

  const title = `${parts.join(' · ')} | WingsGM`

  const description = isDE
    ? `${m.title}${m.brand ? ` von ${m.brand}` : ''}${m.year ? `, Baujahr ${m.year}` : ''}${m.location ? `, Standort ${m.location}` : ''}. Gebrauchte Druckmaschine kaufen bei WingsGM.`
    : `${m.title}${m.brand ? ` by ${m.brand}` : ''}${m.year ? `, year ${m.year}` : ''}${m.location ? `, located in ${m.location}` : ''}. Buy used printing equipment at WingsGM.`

  const images = m.cardImage
    ? [{ url: m.cardImage.url, width: 1200, height: 630, alt: m.title }]
    : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'WingsGM' }]

  return {
    title,
    description,
    keywords: [
      m.title,
      m.brand || '',
      'used printing machinery',
      'gebrauchte Druckmaschinen',
      'buy printing press',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `https://wingsgm.com/${lang}/machine/${slug}`,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://wingsgm.com/${lang}/machine/${slug}`,
      languages: {
        'en': `https://wingsgm.com/en/machine/${slug}`,
        'de': `https://wingsgm.com/de/machine/${slug}`,
      },
    },
  }
}

export default async function MachinePage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;

  const [m, dict] = await Promise.all([
    getMachineBySlug(slug),
    getDictionary(lang),
  ]);

  if (!m) {
    notFound();
  }

  const p = dict.machine_page;

  const {
    documentId,
    title,
    brand,
    year,
    price,
    machine_status,
    location,
    format,
    description,
    images = [],
  } = m;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: typeof description === 'string'
      ? description.slice(0, 200)
      : Array.isArray(description)
      ? description
          .map((b: any) =>
            (b.children || [])
              .map((c: any) => c.text || '')
              .join('')
          )
          .join(' ')
          .slice(0, 200)
      : '',
    brand: brand ? {
      '@type': 'Brand',
      name: brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: price && Number(price) !== 0
        ? Number(price)
        : undefined,
      availability: machine_status === 'available'
        ? 'https://schema.org/InStock'
        : machine_status === 'sold'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/LimitedAvailability',
      url: `https://wingsgm.com/${lang}/machine/${m.slug}`,
    },
    image: images[0]?.url || undefined,
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="container">
        <div className={styles.topBar}>
          <BackButton
            fallback={`/${lang}/stock-list`}
            label={p.back}
          />
        </div>

        <div className={styles.mainLayout}>

          {/* Заголовок — десктоп: правая колонка row 1 / мобайл: первый */}
          <header className={`${styles.header} ${styles.blockHeader}`}>
            {machine_status && (
              <span className={`${styles.statusBadge} ${styles[`status__${machine_status}`]}`}>
                {machine_status.toUpperCase()}
              </span>
            )}
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>
              {brand && <span>{brand}</span>}
              {year && <span> · {year}</span>}
              {format && <span> · {format}</span>}
            </p>
          </header>

          {/* Галерея — десктоп: левая колонка rows 1-2 / мобайл: второй */}
          <div className={styles.blockGallery}>
            <MachineGallery images={images} title={title} />
          </div>

          {/* Детали — десктоп: правая колонка row 2 / мобайл: третий */}
          <section className={`${styles.detailsCard} ${styles.blockDetails}`}>
            <h2 className={styles.sectionTitle}>{p.details}</h2>
            <ul className={styles.detailsList}>
              {brand && (
                <li><span>{p.labelBrand}</span><strong>{brand}</strong></li>
              )}
              {year && (
                <li><span>{p.labelYear}</span><strong>{year}</strong></li>
              )}
              {format && (
                <li><span>{p.labelFormat}</span><strong>{format}</strong></li>
              )}
              {location && (
                <li><span>{p.labelLocation}</span><strong>{location}</strong></li>
              )}
              {machine_status && (
                <li><span>{p.labelStatus}</span><strong>{machine_status}</strong></li>
              )}
              {price && Number(price) !== 0 ? (
                <li>
                  <span>{p.labelPrice}</span>
                  <strong>
                    {Number(price).toLocaleString('de-DE')} €
                  </strong>
                </li>
              ) : (
                <li>
                  <span>{p.labelPrice}</span>
                  <strong style={{ color: '#6b7280' }}>
                    {lang === 'de' ? 'Auf Anfrage' : 'On request'}
                  </strong>
                </li>
              )}
            </ul>
          </section>

          {/* Описание — десктоп: левая колонка row 3 / мобайл: четвёртый */}
          {description && (
            <section className={`${styles.descriptionSection} ${styles.blockDescription}`}>
              <h2 className={styles.sectionTitle}>{p.description}</h2>
              <div className={styles.descriptionBody}>
                {(Array.isArray(description)
                  ? description
                      .map((block: any) =>
                        (block.children || [])
                          .map((child: any) => child.text || "")
                          .join("")
                      )
                      .join("\n\n")
                  : description
                ).split("\n").map((line: string, i: number) =>
                  line.trim() === ""
                    ? <br key={i} />
                    : <p key={i}>{line}</p>
                )}
              </div>
            </section>
          )}

          {/* Форма — десктоп: правая колонка row 3 / мобайл: пятый */}
          <div className={styles.blockForm}>
            <MachineRequestForm
              machineId={documentId}
              machineTitle={title}
              dict={p}
              lang={lang}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
