import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch(
    groq`*[_type == "post"]{
      "slug": slug.current,
      _updatedAt
    }`
  );

  const postRoutes = posts.map((post: any) => ({
    url: `http://localhost:3000/blog/${post.slug}`, 
    lastModified: new Date(post._updatedAt),
  }));

  return [
    {
      url: "http://localhost:3000",
      lastModified: new Date(),
    },
    ...postRoutes,
  ];
}