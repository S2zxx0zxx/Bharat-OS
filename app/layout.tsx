import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BharatOS — India ka AI Life Assistant',
  description: 'Legal help, Govt schemes, Health info, Finance guidance — sab Hindi mein, free mein. India ka pehla AI life OS.',
  keywords: ['BharatOS', 'India AI', 'legal help Hindi', 'govt schemes', 'NyayBot'],
  authors: [{ name: 'BharatOS Team' }],
  openGraph: {
    title: 'BharatOS — India ka AI',
    description: 'Legal · Health · Govt · Finance — Hindi mein',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF6B00',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
