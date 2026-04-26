import { getLatestMachines, getSliderItems, getGalleryItems } from "@/lib/strapi";
import { getDictionary } from "@/lib/getDictionary";
import { Locale } from "@/lib/i18n";
import HeroSlider from "../components/HeroSlider";
import LatestMachines from "../components/LatestMachines";
import AboutSection from "../components/AboutSection";
import GalleryStrip from "../components/GalleryStrip";
import MiniCtaStrip from "../components/MiniCtaStrip";
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params as { lang: Locale }
  const isDE = lang === 'de'

  const title = isDE
    ? 'WingsGM – Gebrauchte Druckmaschinen kaufen und verkaufen'
    : 'WingsGM – Used Printing Machinery for Sale'

  const description = isDE
    ? 'Gebrauchte Druckmaschinen, Weiterverarbeitungsanlagen und Vorstufen-Equipment für Druckereien und Verpackungshersteller in Europa. Heidelberg, MAN Roland, KBA und mehr.'
    : 'Used printing machinery, finishing equipment and prepress systems for print shops and packaging producers across Europe. Heidelberg, MAN Roland, KBA and more.'

  return {
    title,
    description,
    keywords: isDE
      ? ['gebrauchte Druckmaschinen', 'Druckmaschinen kaufen', 'Heidelberg gebraucht', 'Offsetdruck Maschinen', 'Druckerei Equipment']
      : ['used printing machinery', 'buy used printing press', 'Heidelberg used', 'offset printing equipment', 'print shop machinery'],
    openGraph: {
      title,
      description,
      url: `https://wingsgm.com/${lang}`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'WingsGM – Used Printing Machinery' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://wingsgm.com/${lang}`,
      languages: {
        'en': 'https://wingsgm.com/en',
        'de': 'https://wingsgm.com/de',
      },
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };
  const [sliderItems, latestMachines, galleryItems, dict] = await Promise.all([
    getSliderItems(),
    getLatestMachines(6),
    getGalleryItems(),
    getDictionary(lang),
  ]);

  return (
    <>
      <HeroSlider
        items={sliderItems as any}
        machines={latestMachines as any}
        lang={lang}
      />
      <LatestMachines machines={latestMachines as any} dict={dict} lang={lang} />
      <AboutSection dict={dict} />
      <GalleryStrip items={galleryItems as any} />
      <MiniCtaStrip dict={dict} lang={lang} />
    </>
  );
}
