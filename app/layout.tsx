import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const p = process.env.NEXT_PUBLIC_BASE_PATH || ''
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
)

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}${p}`),
  title: 'Жанибек & Аида',
  description: 'Үйлену тойына шақыру',
  icons: {
    icon: [{ url: `${p}/icon.svg`, type: 'image/svg+xml' }],
    apple: `${p}/icon.svg`,
  },
  openGraph: {
    title: 'Жанибек & Аида',
    description: 'Үйлену тойына шақыру',
    siteName: 'Жанибек & Аида',
    locale: 'kk_KZ',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 413,
        height: 243,
        alt: 'Жанибек & Аида',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Жанибек & Аида',
    description: 'Үйлену тойына шақыру',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
