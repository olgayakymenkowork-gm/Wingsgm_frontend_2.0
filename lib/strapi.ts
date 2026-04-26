// ===========================================
// STRAPI BASE URL
// ===========================================
// === BASE URL ДЛЯ STRAPI ===
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  'http://localhost:1337';

// ===========================================
// UNIVERSAL STRAPI FETCH
// ===========================================
async function strapiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[Strapi Error]", res.status, path);
    throw new Error(`Strapi request failed: ${res.status}`);
  }

  return await res.json();
}

// ===========================================
// HELPERS (ПОД ТВОЮ СТРУКТУРУ JSON)
// ===========================================

// Делает абсолютный URL для медиа
function normalizeMediaUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url}`;
}

// Strapi item -> обычный объект
// У тебя НЕТ attributes, поэтому по сути просто raw
function unwrapItem(raw: any) {
  if (!raw) return {};
  if (raw.attributes) {
    return { id: raw.id, ...raw.attributes };
  }
  return raw;
}

// Один медиа-объект (slider.image или mainImage)
function extractSingleImage(media: any) {
  if (!media) return null;
  if (media.data) {
    return media.data.attributes || media.data;
  }
  return media;
}

// Массив медиа (images)
function extractImages(media: any) {
  if (!media) return [];
  if (Array.isArray(media)) return media;
  if (Array.isArray(media.data)) {
    return media.data.map((img: any) => img.attributes || img);
  }
  return [];
}

// ===========================================
// SLIDER
// ===========================================
// Твой JSON Slider:
// { data: [ { id, titel/title, link, image: { ... } } ] }
export async function getSliderItems() {
  const data = await strapiFetch(`/api/sliders-items?populate=*`);

  const rows: any[] = Array.isArray(data?.data) ? data.data : [];

  return rows.map((raw: any) => {
    const a = unwrapItem(raw);
    const title = a.title || a.titel || "";

    const imgRaw = extractSingleImage(a.image);
    let image = null;

    if (imgRaw) {
      const url =
        normalizeMediaUrl(imgRaw.formats?.large?.url) ||
        normalizeMediaUrl(imgRaw.formats?.medium?.url) ||
        normalizeMediaUrl(imgRaw.url);

      if (url) {
        image = {
          url,
          alt: imgRaw.alternativeText || title || "Slider image",
        };
      }
    }

    return {
      id: a.id,
      title,
      subtitle: a.subtitle || a.description || "",
      link: a.link,
      image,
    };
  });
}

// ===========================================
// LATEST MACHINES
// ===========================================
// Твой JSON machines (ты прислала пример):
// { data: [ { id, title, slug, brand, year, price, machine_status, location, format, description, category, images: [..] } ] }
export async function getLatestMachines(limit = 6) {
  const data = await strapiFetch(
    `/api/machines?sort=createdAt:desc&pagination[limit]=${limit}&populate=*`
  );

  const rows: any[] = Array.isArray(data?.data) ? data.data : [];

  return rows.map((raw: any) => {
    const a = unwrapItem(raw);

    const galleryRaw = extractImages(a.images);
    const firstImg = galleryRaw[0];

    const cardImage = firstImg
      ? {
          url:
            normalizeMediaUrl(
              firstImg.formats?.medium?.url ||
                firstImg.formats?.small?.url ||
                firstImg.url
            ) as string,
          alt: firstImg.alternativeText || a.title || "Machine image",
        }
      : undefined;

    const images = galleryRaw.map((img: any) => {
      const url =
        normalizeMediaUrl(img.formats?.medium?.url) ||
        normalizeMediaUrl(img.url);
      return {
        url: url as string,
        alt: img.alternativeText || a.title || "Machine image",
      };
    });

    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      brand: a.brand,
      year: a.year,
      price: a.price,
      machine_status: a.machine_status,
      location: a.location,
      format: a.format,
      description: a.description,
      categoryName: a.category?.name || null,
      cardImage,
      images,
      createdAt: a.createdAt,
    };
  });
}

// ===========================================
// MACHINE BY SLUG (для страницы детали)
// ===========================================
export async function getMachineBySlug(slug: string) {
  const data = await strapiFetch(
    `/api/machines?filters[slug][$eq]=${slug}&populate=*`
  );

  const raw = data?.data?.[0];
  if (!raw) return null;

  const a = unwrapItem(raw);

  const galleryRaw = extractImages(a.images);
  const firstImg = galleryRaw[0];

  const cardImage = firstImg
    ? {
        url:
          normalizeMediaUrl(
            firstImg.formats?.large?.url ||
              firstImg.formats?.medium?.url ||
              firstImg.url
          ) as string,
        alt: firstImg.alternativeText || a.title || "Machine image",
      }
    : undefined;

  const images = galleryRaw.map((img: any) => {
    const url =
      normalizeMediaUrl(img.formats?.large?.url) ||
      normalizeMediaUrl(img.formats?.medium?.url) ||
      normalizeMediaUrl(img.url);
    return {
      url: url as string,
      alt: img.alternativeText || a.title || "Machine image",
    };
  });

  return {
    id: a.id,
    documentId: a.documentId, // 👈 тут берём documentId из Strapi
    slug: a.slug,
    title: a.title,
    brand: a.brand,
    year: a.year,
    price: a.price,
    machine_status: a.machine_status,
    location: a.location,
    format: a.format,
    description: a.description,
    categoryName: a.category?.name || null,
    cardImage,
    images,
  };
}



// ===========================================
// HOMEPAGE GALLERY
// ===========================================
export async function getGalleryItems() {
  const data = await strapiFetch(`/api/gallery-items?populate=*`);

  const rows: any[] = Array.isArray(data?.data) ? data.data : [];

  return rows
    .map((raw: any) => {
      const a = unwrapItem(raw);
      const imgRaw = extractSingleImage(a.image);

      if (!imgRaw) return null;

      const url =
        normalizeMediaUrl(imgRaw.formats?.medium?.url) ||
        normalizeMediaUrl(imgRaw.formats?.small?.url) ||
        normalizeMediaUrl(imgRaw.url);

      if (!url) return null;

      return {
        id: a.id,
        title: a.title || "",
        image: {
          url,
          alt: imgRaw.alternativeText || a.title || "Gallery image",
        },
      };
    })
    .filter(Boolean);
}





// === STOCK LIST HELPERS ===

export interface StockMachine {
  slug: string;
  documentId: string;
  title: string;
  brand?: string | null;
  year?: number | null;
  category?: string | null;
  location?: string | null;
  format?: string | null;
  status?: string | null;
  thumbnailUrl?: string | null;
}

export interface StockFilterOptions {
  categories: string[];
  brands: string[];
  years: number[];
  locations: string[];
  formats: string[];
  statuses: string[];
}

type StockFiltersInput = {
  category?: string;
  brand?: string;
  year?: string;
  format?: string;
  status?: string;
  location?: string;
  page?: number;
  pageSize?: number;
};

/**
 * БЕРЁМ ВСЕ МАШИНЫ ОДНИМ ПРОСТЫМ ЗАПРОСОМ.
 * Никакого populate, никаких fields[], никаких filters — только то, что у тебя уже
 * прекрасно работает на детальной странице.
 */
async function fetchAllMachinesForStock(): Promise<StockMachine[]> {
  const res = await strapiFetch(
    '/api/machines?sort=createdAt:desc&pagination[pageSize]=1000'
  );

  return (res.data || []).map((item: any) => {
    const a = item.attributes || {};

    return {
      slug: a.slug, // <-- ИСПОЛЬЗУЕМ SLUG
      documentId: item.documentId ?? item.id,
      title: a.title ?? '(no title)',
      brand: a.brand ?? null,
      year: a.year ?? null,
      category: null, // relation Category пока не трогаем
      location: a.location ?? null,
      format: a.format ?? null,
      status: a.machine_status ?? null,
      thumbnailUrl: null, // mainImage тоже можно будет подключить позже
    };
  });
}

/**
 * Фильтрация и пагинация делаются уже в коде, а не в Strapi — чтобы не ловить 400.
 */
export async function getStockMachines(filters: StockFiltersInput = {}) {
  const all = await fetchAllMachinesForStock();

  const filtered = all.filter((m) => {
    if (filters.category && m.category !== filters.category) return false;
    if (filters.brand && m.brand !== filters.brand) return false;
    if (filters.year && String(m.year ?? '') !== filters.year) return false;
    if (filters.format && m.format !== filters.format) return false;
    if (filters.status && m.status !== filters.status) return false;
    if (filters.location && m.location !== filters.location) return false;
    return true;
  });

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = filtered.slice(start, end);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  return {
    items,
    pagination: {
      page,
      pageSize,
      pageCount,
      total: filtered.length,
    },
  };
}

/**
 * Фильтры тоже считаем на стороне фронта — из того же массива all.
 */
export async function getStockFilterOptions(): Promise<StockFilterOptions> {
  const all = await fetchAllMachinesForStock();

  const categories = new Set<string>();
  const brands = new Set<string>();
  const years = new Set<number>();
  const locations = new Set<string>();
  const formats = new Set<string>();
  const statuses = new Set<string>();

  all.forEach((m) => {
    if (m.category) categories.add(m.category);
    if (m.brand) brands.add(m.brand);
    if (m.year) years.add(m.year);
    if (m.location) locations.add(m.location);
    if (m.format) formats.add(m.format);
    if (m.status) statuses.add(m.status);
  });

  return {
    categories: [...categories].sort(),
    brands: [...brands].sort(),
    years: [...years].sort((a, b) => b - a),
    locations: [...locations].sort(),
    formats: [...formats].sort(),
    statuses: [...statuses].sort(),
  };
}


// === ABOUT PAGE ===



// "/uploads/..." → "http://localhost:1337/uploads/..."
export function fromStrapi(path?: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
}

// Упрощённый парсер медиа для твоей структуры
// hero_image у тебя уже плоский объект (без data/attributes)
export function getMediaUrl(media: any): string {
  if (!media) return '';
  const path =
    media?.formats?.large?.url ||
    media?.formats?.medium?.url ||
    media?.url ||
    '';
  return fromStrapi(path);
}

// === ABOUT PAGE (single type) ===
export async function getAboutPage() {
  const res = await strapiFetch('/api/about-page?populate=*');

  // ТВОЙ реальный ответ: { data: { ...hero_title, hero_image... }, meta: {} }
  // Поэтому просто возвращаем res.data
  return (res as any)?.data ?? res;
}