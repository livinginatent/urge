import type { Metadata } from "next";
import { NavBar } from "@/components/navbar";
import { BlogCard } from "@/components/blog-card";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Blog – URGE",
  description: "Thoughts on discipline, habits, and the cost of every urge.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    stega: false,
  });

  return (
    <div className="relative bg-[#050505] min-h-screen w-full overflow-x-hidden">
      <NavBar />
      
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
              {posts.map((post: any) => (
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

      <SiteFooter />
    </div>
  );
}
