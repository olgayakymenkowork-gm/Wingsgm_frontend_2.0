import { getDictionary } from '@/lib/getDictionary'
import { Locale } from '@/lib/i18n'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const isDE = lang === 'de'

  return {
    metadataBase: new URL('https://wingsgm.com'),
    alternates: {
      canonical: `https://wingsgm.com/${lang}`,
      languages: {
        'en': 'https://wingsgm.com/en',
        'de': 'https://wingsgm.com/de',
      },
    },
    openGraph: {
      siteName: 'WingsGM',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
    other: {
      'content-language': isDE ? 'de' : 'en',
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="site__main">{children}</main>
      <Footer dict={dict} lang={lang} />
      <ScrollToTop />
    </>
  )
}
