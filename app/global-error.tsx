'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service (e.g. Sentry)
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-navy-950 text-cream-200 font-body antialiased">
        <div className="min-h-screen flex items-center justify-center">
          <div className="container-site text-center py-32">
            <div className="gold-line mx-auto" />
            <h1 className="heading-display text-4xl mb-4">Something Went Wrong</h1>
            <p className="text-warm-500 max-w-sm mx-auto mb-10 leading-relaxed">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={reset} className="btn-primary">
                Try Again
              </button>
              <Link href="/" className="btn-outline">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
