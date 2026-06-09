  /**
   * Sanity Studio — embedded at /studio
   *
   * NextStudio handles its own client-side rendering internally.
   * Do NOT add 'use client' here — it causes hydration mismatches in Next.js 15.
   *
   * Protection: Sanity requires users to be logged in to a Sanity account
   * that has access to this project. Uninvited users see a login screen.
   */

  import type { Metadata } from 'next'
  import { NextStudio } from 'next-sanity/studio'
  import config from '@/sanity.config'

  // Tell crawlers not to index the Studio
  export const metadata: Metadata = {
    robots: 'noindex, nofollow',
  }

  export default function StudioPage() {
    return <NextStudio config={config} />
  }