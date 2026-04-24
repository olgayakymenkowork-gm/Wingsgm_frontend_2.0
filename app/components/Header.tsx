'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Layout.module.css'

const LOCALES = ['en', 'de'] as const

type Props = {
  lang: string
  dict: any
}

export default function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setMenuOpen(false)

  function buildLangHref(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        {/* LOGO */}
        <div className={styles.logoBlock}>
          <Link href={`/${lang}`} onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-wingsgm.png"
              alt="WingsGM graphic machinery"
              className={styles.logo}
            />
          </Link>
        </div>

        {/* DESKTOP: nav + lang switcher */}
        <div className={styles.desktopNav}>
          <nav className={styles.nav}>
            <Link href={`/${lang}/stock-list`} className={styles.navLink}>
              {dict.nav.stockList}
            </Link>
            <Link href={`/${lang}/about`} className={styles.navLink}>
              {dict.nav.about}
            </Link>
            <Link href={`/${lang}/contact`} className={styles.navLink}>
              {dict.nav.contact}
            </Link>
          </nav>

          {/* Desktop lang switcher — imported inline to avoid 'use client' split */}
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '6px', padding: '2px', gap: '2px' }}>
            {LOCALES.map((locale) => (
              <Link
                key={locale}
                href={buildLangHref(locale)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                  background: lang === locale ? '#ffffff' : 'transparent',
                  color: lang === locale ? '#ad0000' : '#999999',
                  boxShadow: lang === locale ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                }}
              >
                {locale.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* MOBILE: hamburger */}
        <button
          className={styles.burgerBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            width: '34px',
            height: '34px',
            borderRadius: '7px',
            background: menuOpen ? '#f0f0f0' : '#f4f4f4',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            transition: 'background 0.2s',
          }}
          aria-label="Menu"
        >
          <span style={{
            display: 'block',
            width: '14px',
            height: '1.5px',
            background: '#333',
            borderRadius: '1px',
            transition: 'all 0.2s',
            transform: menuOpen ? 'translateY(4.5px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '14px',
            height: '1.5px',
            background: '#333',
            borderRadius: '1px',
            opacity: menuOpen ? 0 : 1,
            transition: 'all 0.2s',
          }} />
          <span style={{
            display: 'block',
            width: '14px',
            height: '1.5px',
            background: '#333',
            borderRadius: '1px',
            transition: 'all 0.2s',
            transform: menuOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={styles.mobileMenuDropdown}
        style={{ display: menuOpen ? 'block' : 'none' }}
      >
          {[
            { href: `/${lang}/stock-list`, label: dict.nav.stockList },
            { href: `/${lang}/about`,      label: dict.nav.about },
            { href: `/${lang}/contact`,    label: dict.nav.contact },
          ].map(({ href, label }, i, arr) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={{
                display: 'block',
                padding: '11px 0',
                fontSize: '14px',
                fontWeight: '500',
                color: '#222222',
                textDecoration: 'none',
                borderBottom: i < arr.length - 1 ? '0.5px solid #f5f5f5' : 'none',
              }}
            >
              {label}
            </Link>
          ))}

          {/* Mobile lang switcher */}
          <div style={{
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '0.5px solid #f0f0f0',
            display: 'flex',
            gap: '8px',
          }}>
            {LOCALES.map((locale) => (
              <Link
                key={locale}
                href={buildLangHref(locale)}
                onClick={closeMenu}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  textDecoration: 'none',
                  background: lang === locale ? '#ffffff' : '#f4f4f4',
                  color: lang === locale ? '#ad0000' : '#999999',
                  boxShadow: lang === locale ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {locale.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
    </header>
  )
}
