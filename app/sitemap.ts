import { MetadataRoute } from 'next'
import { getLatestMachines } from '@/lib/strapi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const machines = await getLatestMachines(500)

  const base = 'https://wingsgm.com'
  const langs = ['en', 'de']

  const staticPages = [
    '',
    '/stock-list',
    '/about',
    '/contact',
  ]

  const staticRoutes: MetadataRoute.Sitemap = langs.flatMap(lang =>
    staticPages.map(page => ({
      url: `${base}/${lang}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1.0 : page === '/stock-list' ? 0.9 : 0.7,
    }))
  )

  const machineRoutes: MetadataRoute.Sitemap = langs.flatMap(lang =>
    (machines as any[]).map(m => ({
      url: `${base}/${lang}/machine/${m.slug}`,
      lastModified: new Date(m.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticRoutes, ...machineRoutes]
}
