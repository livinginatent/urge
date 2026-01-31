import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/navbar";
import { PortableText } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

type Category = {
  _id: string;
  title: string;
  slug: string;
};

export async function generateStaticParams() {
  const { data: posts } = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return posts?.map((post: { slug: string }) => ({
    slug: post.slug,
  })) || [];
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  });

  if (!post) {
    return {
      title: "Post Not Found – URGE",
    };
  }

  const imageUrl = post.mainImage?.asset?.url
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${post.title} – URGE Blog`,
    description: post.excerpt || `Read ${post.title} on URGE blog.`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url: `https://urges.app/blog/${slug}`,
      siteName: "URGE",
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage?.asset?.url
    ? urlFor(post.mainImage).width(1200).height(800).url()
    : null;

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const imageUrlForSchema = post.mainImage?.asset?.url
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  // JSON-LD structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: imageUrlForSchema,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author?.name
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "URGE",
      url: "https://urges.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://urges.app/blog/${slug}`,
    },
  };

  return (
    <div className="relative bg-[#050505] min-h-screen w-full overflow-x-hidden">
      <NavBar />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#52525b] hover:text-[#E11D48] transition-colors mb-8 text-sm font-mono uppercase tracking-widest"
          >
            ← BACK TO BLOG
          </Link>

          {/* Header */}
          <header className="mb-12">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category: Category) => (
                  <span
                    key={category._id || category.slug || category.title}
                    className="text-xs text-[#52525b] uppercase tracking-widest font-mono border-2 border-[#27272a] px-3 py-1"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-brutal mb-6 leading-tight">
              {post.title}
            </h1>


            <div className="flex items-center gap-4 text-sm text-[#52525b] font-mono border-t-2 border-b-2 border-[#27272a] py-4">
             
            
              {date && <span>{date}</span>}
            </div>
          </header>

          {/* Main Image */}
          {imageUrl && (
            <div className="relative w-full aspect-video mb-12 border-2 border-[#27272a] bg-[#0a0a0a] p-2">
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <article className="prose prose-invert max-w-none">
            {post.body && <PortableText value={post.body} />}
          </article>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-[#27272a]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#E11D48] hover:text-[#be123c] transition-colors text-sm font-mono uppercase tracking-widest"
            >
              ← BACK TO BLOG
            </Link>
          </div>
        </div>
      </main>

 
    </div>
  );
}
