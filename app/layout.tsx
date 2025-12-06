import type { Metadata } from 'next'
import { Inter, Great_Vibes } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

const greatVibes = Great_Vibes({ 
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-great-vibes',
})

export const metadata: Metadata = {
  title: 'LIFEPHORIA - Dating Self-Insight Quiz',
  description: 'A quiz designed for men who want to date with more confidence, clarity and self-respect.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${greatVibes.variable}`}>{children}</body>
    </html>
  )
}

