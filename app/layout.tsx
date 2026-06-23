import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BharatOS — India ka AI Life OS | Free Hindi AI Assistant',
  description: 'Legal help, Govt schemes, Health info, Finance guidance — sab Hindi mein, bilkul free. India ka pehla AI Life Operating System.',
  keywords: 'BharatOS, India AI, Hindi AI, legal help Hindi, govt schemes AI, NyayBot, JanSeva',
  openGraph: {
    title: 'BharatOS — India ka AI Life OS',
    description: 'Legal • Health • Govt • Finance — Hindi mein, Free mein',
    type: 'website',
    url: 'https://bharat-os.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatOS — India ka AI',
    description: 'Har Indian ka AI assistant — Hindi mein',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BharatOS',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B00' },
    { media: '(prefers-color-scheme: dark)',  color: '#04070F' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* desktop-shell centers the card on large screens — see globals.css */}
        <div className="desktop-shell">
          {children}
        </div>
      </body>
    </html>
  )
}