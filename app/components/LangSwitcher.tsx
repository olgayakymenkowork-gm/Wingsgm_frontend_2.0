'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LOCALES = ['en', 'de'] as const

type Props = {
  currentLang: string
}

export default function LangSwitcher({ currentLang }: Props) {
  const pathname = usePathname()

  function buildHref(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <div style={{
      display: 'flex',
      background: '#f0f0f0',
      borderRadius: '6px',
      padding: '2px',
      gap: '2px',
    }}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={buildHref(locale)}
          style={{
            padding: '5px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
            background: currentLang === locale ? '#ffffff' : 'transparent',
            color: currentLang === locale ? '#ad0000' : '#999999',
            boxShadow: currentLang === locale
              ? '0 1px 3px rgba(0,0,0,0.10)'
              : 'none',
          }}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
