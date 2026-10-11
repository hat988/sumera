import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Marcellus, Tangerine } from 'next/font/google'
import './globals.css'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
})

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sayeed & Sumera | Engagement Invitation',
  description:
    'You are cordially invited to the engagement ceremony of Sayeed & Sumera on Monday, 19 October 2026 at Gulzar Function Hall, Hyderabad.',
  generator: 'v0.app',
  openGraph: {
    title: 'Sayeed & Sumera | Engagement Invitation',
    description: 'Monday, 19 October 2026 · Gulzar Function Hall, Hyderabad',
    images: ['/images/intro-ring-box.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#04252a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${marcellus.variable} ${tangerine.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
