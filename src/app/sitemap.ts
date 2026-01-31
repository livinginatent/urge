import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://urges.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch blog posts from Sanity
  try {
    const posts = await client
      .withConfig({ useCdn: false })
      .fetch<Array<{ slug: string }>>(POST_SLUGS_QUERY);

    const blogPosts: MetadataRoute.Sitemap =
      posts?.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      })) || [];

    return [...staticPages, ...blogPosts];
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
    return staticPages;
  }
}

