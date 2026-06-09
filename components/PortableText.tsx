import { PortableText as SanityPortableText } from '@portabletext/react'
import type {
  PortableTextBlock,
  PortableTextComponentProps,
  PortableTextReactComponents,
} from '@portabletext/react'
import Image from 'next/image'
import { sanityImage } from '@/sanity/lib/image'

const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({
      value,
    }: {
      value: {
        asset?: { _ref: string }
        alt?: string
        caption?: string
      }
    }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm">
            <Image
              src={sanityImage(value, { width: 1200, height: 675 })}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-warm-500 text-sm text-center mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode
      value?: { href?: string; blank?: boolean }
    }) => (
      <a
        href={value?.href ?? '#'}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-gold-400 underline underline-offset-4 hover:text-gold-300 transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="text-cream-200 font-medium">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="text-cream-300 italic">{children}</em>
    ),
  },
  block: {
    h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h2 className="font-display text-3xl font-medium text-cream-200 mt-12 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h3 className="font-display text-2xl font-medium text-cream-200 mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h4 className="font-body text-lg font-medium text-cream-100 mt-6 mb-2 uppercase tracking-wide">
        {children}
      </h4>
    ),
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="text-warm-400 leading-relaxed mb-5">{children}</p>
    ),
    // blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
    //   <blockquote className="border-l-2 border-gold-500 pl-6 ml-0 my-8">
    //     <p className="font-display text-xl italic text-cream-300">{children}</p>
    //   </blockquote>
    // ),
    blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <blockquote className="border-l-2 border-gold-500 pl-6 ml-0 my-8 font-display text-xl italic text-cream-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="space-y-2 mb-5 ml-4">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="space-y-2 mb-5 ml-4 list-decimal list-inside">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-warm-400 leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gold-500">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-warm-400 leading-relaxed">{children}</li>
    ),
  },
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <SanityPortableText value={value} components={components} />
}
