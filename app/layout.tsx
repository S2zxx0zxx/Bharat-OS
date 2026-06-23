import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BharatOS — India Ka AI, Har Sawaal Ka Jawab',
  description: 'Legal help, Govt schemes, Health, Finance, Agriculture, Education — sab ek jagah. Gaon se shahar tak, sabke liye.',
  keywords: 'BharatOS, India AI, Hindi AI, legal help, govt schemes, NyayBot, JanSeva',
  openGraph: {
    title: 'BharatOS — India Ka AI',
    description: 'Har sawaal ka jawab ek jagah — Legal, Health, Finance, Govt, Agri, Education',
    type: 'website',
    url: 'https://bharat-os.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatOS — India Ka AI',
    description: 'Har Indian ke liye — free mein',
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'BharatOS' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#141414',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ background: '#141414', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}