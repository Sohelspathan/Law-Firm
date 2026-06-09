export default function Loading() {
  return (
    <div className="min-h-screen bg-navy-900 pt-40">
      <div className="container-site py-20">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-8">
          {[60, 40, 80].map((w, i) => (
            <div
              key={i}
              className="h-3 bg-navy-700 rounded animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Heading skeleton */}
        <div className="space-y-4 mb-12">
          <div className="h-12 bg-navy-700 rounded animate-pulse w-3/4" />
          <div className="h-12 bg-navy-700 rounded animate-pulse w-1/2" />
        </div>

        {/* Gold line skeleton */}
        <div className="w-12 h-px bg-navy-700 mb-6" />

        {/* Paragraph skeleton */}
        <div className="space-y-3 max-w-xl">
          {[100, 95, 85].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-navy-700 rounded animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-navy-900 p-8 space-y-4">
              <div className="w-10 h-10 bg-navy-700 rounded animate-pulse" />
              <div className="h-6 bg-navy-700 rounded animate-pulse w-2/3" />
              <div className="space-y-2">
                <div className="h-3 bg-navy-700 rounded animate-pulse" />
                <div className="h-3 bg-navy-700 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-navy-700 rounded animate-pulse w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
