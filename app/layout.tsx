import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BharatOS — India ka AI Life Operating System',
  description:
    'BharatOS: Free AI assistant for legal help, government schemes, health, finance, agriculture & education. Rural & urban Indians ke liye. Hindi/Hinglish mein.',
  keywords: [
    'BharatOS', 'India AI', 'legal help India', 'government schemes', 'PM Kisan',
    'Ayushman Bharat', 'RTI', 'consumer court', 'free legal aid', 'NyayBot',
    'JanSeva', 'Swasthya', 'Dhan', 'Kisan', 'Gyaan',
  ],
  authors: [{ name: 'BharatOS' }],
  openGraph: {
    title: 'BharatOS — India ka AI Life Operating System',
    description: 'Legal, Govt Schemes, Health, Finance, Agriculture, Education — sab ek jagah.',
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatOS',
    description: 'India ka AI Life Operating System',
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
