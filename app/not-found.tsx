import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center noise-overlay">
      <div className="container-site text-center py-32">
        <span className="font-display text-[12rem] font-light text-navy-700 leading-none block">
          404
        </span>
        <div className="gold-line mx-auto" />
        <h1 className="heading-display text-4xl mb-4">Page Not Found</h1>
        <p className="text-warm-500 max-w-sm mx-auto mb-10 leading-relaxed">
          The page you&rsquo;re looking for has moved or doesn&rsquo;t exist. Let us help you find your way.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
