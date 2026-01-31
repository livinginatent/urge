import type { Metadata } from "next";
import { NavBar } from "@/components/navbar";
import { BlogCard } from "@/components/blog-card";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  mainImage?: {
    asset?: {
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  author?: {
    name: string;
  };
  categories?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Blog – URGE | Thoughts on Discipline and Habits",
  description:
    "Read insights on discipline, habit formation, and the cost of every urge. Learn how to break the cycle and build lasting change.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog – URGE | Thoughts on Discipline and Habits",
    description:
      "Read insights on discipline, habit formation, and the cost of every urge. Learn how to break the cycle and build lasting change.",
    url: "https://urges.app/blog",
    siteName: "URGE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – URGE | Thoughts on Discipline and Habits",
    description:
      "Read insights on discipline, habit formation, and the cost of every urge. Learn how to break the cycle and build lasting change.",
  },
  keywords: [
    "discipline",
    "habits",
    "habit tracking",
    "self-improvement",
    "urge control",
    "behavior change",
    "productivity",
    "personal development",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    stega: false,
  });

  // JSON-LD structured data for blog listing
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "URGE Blog",
    description:
      "Thoughts on discipline, habits, and the cost of every urge.",
    url: "https://urges.app/blog",
    publisher: {
      "@type": "Organization",
      name: "URGE",
      url: "https://urges.app",
    },
  };

  return (
    <div className="relative bg-[#050505] min-h-screen w-full overflow-x-hidden">
      <NavBar />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center border-b-2 border-[#27272a] pb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-brutal mb-6">
              BLOG
            </h1>
            <p className="text-[#52525b] text-lg md:text-xl font-mono max-w-2xl mx-auto">
              Thoughts on discipline, habits, and the cost of every urge.
            </p>
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: BlogPost) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-[#52525b] text-lg font-mono">
                No posts yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </main>

    
    </div>
  );
}
