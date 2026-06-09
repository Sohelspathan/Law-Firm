import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getSiteSettings } from '@/sanity/lib/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <Navbar firmName={settings?.firmName ?? 'The Firm'} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  )
}
