import type { Metadata } from 'next'
import { Anton, Courier_Prime, Barlow } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-courier',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "SaaSHate — The Internet's Most Hated SaaS Ranking",
  description: 'Vote for the SaaS products you hate the most. Public leaderboard. Raw internet sentiment. No corporate spin.',
  openGraph: {
    title: 'SaaSHate — Most Hated SaaS Ranking',
    description: "The internet's public SaaS hate index.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${courierPrime.variable} ${barlow.variable} h-full`}
      style={{ backgroundColor: '#FFFCF5', colorScheme: 'light' }}
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
