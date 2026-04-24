import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import { getDictionary } from '@/lib/getDictionary'

export default async function NotFound() {
  const dict = await getDictionary('en')

  return (
    <>
      <Header lang="en" dict={dict} />
      <main style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f7',
        padding: '40px 24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ad0000',
            marginBottom: '12px',
          }}>
            404
          </p>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0a1a3c',
            marginBottom: '12px',
            lineHeight: 1.2,
          }}>
            Page not found
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: 1.7,
            marginBottom: '28px',
          }}>
            The page you are looking for does not exist
            or has been moved.
          </p>
          <Link href="/en/stock-list" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 26px',
            borderRadius: '999px',
            background: '#0020c2',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Browse machinery →
          </Link>
        </div>
      </main>
      <Footer dict={dict} lang="en" />
    </>
  )
}
