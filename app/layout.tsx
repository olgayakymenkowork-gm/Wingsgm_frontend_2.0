import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WingsGM – Used Printing Machinery',
  description: 'Used printing machinery – stock list, sales and brokerage.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
