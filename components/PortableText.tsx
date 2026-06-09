import Image from 'next/image'
import { sanityImage } from '@/sanity/lib/image'
import {
  PortableText as SanityPortableText,
  type PortableTextComponents,
} from '@portabletext/react'

const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
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
        </figure>
      )
    },
  },

  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href ?? '#'}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },

  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    normal: ({ children }) => <p>{children}</p>,
  },
}