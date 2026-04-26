import Link from "next/link";
import { getLatestMachines } from "@/lib/strapi";
import { getDictionary } from "@/lib/getDictionary";
import { Locale } from "@/lib/i18n";
import StockFilters from "@/app/components/StockFilters";
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params as { lang: Locale }
  const isDE = lang === 'de'

  const title = isDE
    ? 'Maschinenbestand – Gebrauchte Druckmaschinen | WingsGM'
    : 'Machinery Stock List – Used Printing Equipment | WingsGM'

  const description = isDE
    ? 'Durchsuchen Sie unseren aktuellen Bestand an gebrauchten Druckmaschinen, Weiterverarbeitungsanlagen und Vorstufen-Equipment. Filterbar nach Marke, Kategorie und Standort.'
    : 'Browse our current stock of used printing presses, finishing equipment and prepress systems. Filter by brand, category and location.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wingsgm.com/${lang}/stock-list`,
    },
    alternates: {
      canonical: `https://wingsgm.com/${lang}/stock-list`,
      languages: {
        'en': 'https://wingsgm.com/en/stock-list',
        'de': 'https://wingsgm.com/de/stock-list',
      },
    },
  }
}

type SearchParams = { [key: string]: string | string[] | undefined };

type MachineImage = {
  url: string;
  alt: string;
};

type Machine = {
  id: number;
  slug: string;
  title: string;
  brand?: string;
  year?: string | number;
  format?: string;
  location?: string;
  price?: string | number;
  machine_status?: string;
  description?: string;
  cardImage?: MachineImage;
  images: MachineImage[];
  categoryName?: string | null;
};

interface StockListPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

export default async function StockListPage(props: StockListPageProps) {
  const [{ lang: langStr }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const lang = langStr as Locale;

  const dict = await getDictionary(lang);
  const p = dict.stock_page;

  const rawCategory = searchParams.category;
  const selectedCategories = Array.isArray(rawCategory)
    ? rawCategory
    : rawCategory ? [rawCategory] : [];

  const rawBrand = searchParams.brand;
  const selectedBrands = Array.isArray(rawBrand)
    ? rawBrand
    : rawBrand ? [rawBrand] : [];

  const rawFormat = searchParams.format;
  const selectedFormats = Array.isArray(rawFormat)
    ? rawFormat
    : rawFormat ? [rawFormat] : [];

  const rawStatus = searchParams.status;
  const selectedStatuses = Array.isArray(rawStatus)
    ? rawStatus
    : rawStatus ? [rawStatus] : [];

  const rawLocation = searchParams.location;
  const selectedLocations = Array.isArray(rawLocation)
    ? rawLocation
    : rawLocation ? [rawLocation] : [];

  const allMachines = (await getLatestMachines(500)) as Machine[];

  const categoriesSet = new Set<string>();
  const brandsSet = new Set<string>();
  const formatsSet = new Set<string>();
  const locationsSet = new Set<string>();
  const statusesSet = new Set<string>();

  for (const m of allMachines) {
    if (m.categoryName) categoriesSet.add(m.categoryName);
    if (m.brand) brandsSet.add(m.brand);
    if (m.format) formatsSet.add(m.format);
    if (m.location) locationsSet.add(m.location);
    if (m.machine_status) statusesSet.add(m.machine_status);
  }

  const filterOptions = {
    categories: Array.from(categoriesSet).sort(),
    brands: Array.from(brandsSet).sort(),
    formats: Array.from(formatsSet).sort(),
    locations: Array.from(locationsSet).sort(),
    statuses: Array.from(statusesSet).sort(),
  };

  const filteredMachines = allMachines.filter((m) => {
    const cat = m.categoryName || "";
    const brand = m.brand || "";
    const format = m.format || "";
    const status = m.machine_status || "";
    const location = m.location || "";

    if (selectedCategories.length && !selectedCategories.includes(cat)) return false;
    if (selectedBrands.length && !selectedBrands.includes(brand)) return false;
    if (selectedFormats.length && !selectedFormats.includes(format)) return false;
    if (selectedStatuses.length && !selectedStatuses.includes(status)) return false;
    if (selectedLocations.length && !selectedLocations.includes(location)) return false;

    return true;
  });

  const filterLabels = {
    all: p.filterAll,
    reset: p.resetFilters,
    category: p.filterCategory,
    brand: p.filterBrand,
    location: p.filterLocation,
    status: p.filterStatus,
  };

  return (
    <main className="stock-page">
      <div className="stock-header-bar">
        <div className="container">
          <div className="stock-header-inner">
            <div className="stock-header-text">
              <p className="stock-header-kicker">{p.kicker}</p>
              <h1 className="stock-header-title">{p.title}</h1>
              <p className="stock-header-subtitle">{p.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container stock-layout">
        <div className="stock-content">
          <aside className="stock-filters-col">
            <StockFilters
              options={filterOptions}
              selected={{
                category: selectedCategories,
                brand: selectedBrands,
                format: selectedFormats,
                status: selectedStatuses,
                location: selectedLocations,
              }}
              labels={filterLabels}
              lang={lang}
            />
          </aside>

          <section className="stock-list-col">
            <div className="stock-results-info">
              {p.found} {filteredMachines.length} {
                filteredMachines.length === 1
                  ? p.foundMachine
                  : p.foundMachines
              }
            </div>

            <div className="stock-list">
              {filteredMachines.length === 0 && (
                <p>{p.noResults}</p>
              )}

              {filteredMachines.map((m) => {
                const img = m.cardImage || m.images?.[0];
                const shortDesc =
                  typeof m.description === "string"
                    ? m.description.length > 220
                      ? m.description.slice(0, 220) + "…"
                      : m.description
                    : "";

                return (
                  <Link
                    key={m.id}
                    href={`/${lang}/machine/${m.slug}`}
                    className="stock-card"
                  >
                    <div className="stock-card-image">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.url}
                          alt={img.alt}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>

                    <div className="stock-card-body">
                      <div className="stock-card-top">
                        <div className="stock-card-header">
                          {m.machine_status && (
                            <span className={`stock-card-badge stock-card-badge--${m.machine_status}`}>
                              {m.machine_status.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <h2 className="stock-card-title">
                          {m.brand && (
                            <span className="stock-card-brand-prefix">
                              {m.brand}{' '}
                            </span>
                          )}
                          {m.title}
                        </h2>
                        <div className="stock-card-specs">
                          {m.year && <span className="stock-card-spec">{m.year}</span>}
                          {m.location && <span className="stock-card-spec">{m.location}</span>}
                        </div>
                        {shortDesc && <p className="stock-card-desc">{shortDesc}</p>}
                      </div>
                      <div className="stock-card-bottom">
                        <span className="stock-card-link">{p.seeMore}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <div style={{ paddingTop: '120px' }}>
        <section className="stock-cta">
          <div className="container">
            <div className="stock-cta-inner">
              <div>
                <p className="stock-cta-eyebrow">{dict.home.ctaEyebrow}</p>
                <p className="stock-cta-main">{dict.home.ctaText}</p>
                <p className="stock-cta-sub">{dict.home.ctaTextStrong}</p>
              </div>
              <a href={`/${lang}/contact`} className="stock-cta-btn">
                {dict.home.ctaButton}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
