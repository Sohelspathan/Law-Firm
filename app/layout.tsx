import type { Metadata } from 'next'
import './globals.css'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { getSiteSettings } from '@/sanity/lib/queries'

// ─── Fonts ─────────────────────────────────────────────────────────────────────
// NOTE: next/font/google fetches Google Fonts at build time.
// If the build environment cannot reach fonts.googleapis.com, builds fail.
// Use local/CSS fallbacks here to keep deploys reliable.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// ─── OG tags ──────────────────────────────────────────────────────────
export const metadata = {
  title: "MTQS Legal Services",
  description: "Experienced attorneys providing legal services.",
  openGraph: {
    title: "MTQS Legal Services",
    description: "Experienced attorneys providing legal services.",
    url: "https://mtqslegalservices.vercel.app",
    siteName: "MTQS Legal Services",
    images: [
      {
        url: "/OGImage.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
}

// ─── Default Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      default: settings?.firmName ?? 'Law Firm',
      template: `%s · ${settings?.firmName ?? 'Law Firm'}`,
    },
    description: settings?.description ?? 'Experienced legal counsel.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      siteName: settings?.firmName,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-navy-900 text-cream-200 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
