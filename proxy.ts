import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'de']

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Пропускаем статичные файлы и API роуты
  const isStatic = /\.(.*)$/.test(pathname)
  if (isStatic) return

  if (pathname.startsWith('/api/')) return

  const pathnameHasLocale = locales.some(
    locale =>
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  return NextResponse.redirect(
    new URL(`/en${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
}
