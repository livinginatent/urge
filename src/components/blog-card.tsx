import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BlogCardProps {
  post: {
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
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.mainImage?.asset?.url
    ? urlFor(post.mainImage).width(800).height(600).url()
    : null;
  
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group hover:border-[#E11D48] transition-colors cursor-pointer h-full flex flex-col">
        {imageUrl && (
          <div className="relative w-full aspect-video border-b-2 border-[#27272a] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <CardContent className="flex-1 p-6">
          <div className="space-y-3">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category._id || category.slug || category.title}
                    className="text-xs text-[#52525b] uppercase tracking-widest font-mono border border-[#27272a] px-2 py-1"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-brutal group-hover:text-[#E11D48] transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-[#a1a1aa] text-sm md:text-base leading-relaxed font-mono line-clamp-3">
                {post.excerpt}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t-2 border-[#27272a] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#52525b] font-mono">
            {post.author?.name && <span>{post.author.name}</span>}
            {date && post.author?.name && <span>•</span>}
            {date && <span>{date}</span>}
          </div>
          <span className="text-[#E11D48] text-xs uppercase tracking-widest font-mono group-hover:translate-x-1 transition-transform">
            READ →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
