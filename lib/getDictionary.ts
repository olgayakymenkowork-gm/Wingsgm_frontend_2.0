import type { Locale } from './i18n'

const dictionaries = {
  en: () => import('../locales/en.json').then(m => m.default),
  de: () => import('../locales/de.json').then(m => m.default),
}

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale as 'en' | 'de']
  if (!loader) return dictionaries['en']()
  return loader()
}
