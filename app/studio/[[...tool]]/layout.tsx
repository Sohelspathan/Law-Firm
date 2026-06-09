/**
 * Studio-specific layout.
 *
 * suppressHydrationWarning is required because Sanity Studio's rich text
 * editor renders <div> elements inside <p> tags internally — a known
 * mismatch between Sanity's portable text renderer and React's hydration.
 * This suppresses the warning without affecting any user-facing pages.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
