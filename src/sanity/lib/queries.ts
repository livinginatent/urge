import { defineQuery } from 'next-sanity'
import groq from 'groq'

// Fragment for image with metadata
const imageFragment = groq`
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt,
  hotspot,
  crop
`

// Fragment for author
const authorFragment = groq`
  author->{
    _id,
    name,
    slug,
    image {
      ${imageFragment}
    }
  }
`

// Fragment for categories
const categoriesFragment = groq`
  categories[]->{
    _id,
    title,
    "slug": slug.current
  }
`

// All posts for listing page
export const POSTS_QUERY = defineQuery(groq`
  *[_type == "post" && defined(slug.current)] 
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage {
      ${imageFragment}
    },
    ${authorFragment},
    ${categoriesFragment}
  }
`)

// Single post by slug
export const POST_QUERY = defineQuery(groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage {
      ${imageFragment}
    },
    ${authorFragment},
    ${categoriesFragment},
    body[]{
      ...,
      _type == "image" => {
        ...,
        ${imageFragment}
      }
    }
  }
`)

// All post slugs for static generation
export const POST_SLUGS_QUERY = defineQuery(groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`)
