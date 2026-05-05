export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { client } from "@/lib/contentful";
import { slugify, toHttpsUrl } from "@/lib/utils";
import { BlogFilter, type BlogPost } from "./blog-filter";

export const metadata: Metadata = {
  title: { absolute: "Shumaker Roofing Blog | Expert Roofing Advice & Updates" },
  description:
    "Follow Shumaker Roofing for the latest roofing tips, maintenance guides, company news, and industry insights. Keep your roof in top shape! Contact us now!",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Shumaker Roofing Blog | Expert Roofing Advice & Updates",
    description:
      "Follow Shumaker Roofing for the latest roofing tips, maintenance guides, company news, and industry insights. Keep your roof in top shape! Contact us now!",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shumaker Roofing Blog | Expert Roofing Advice & Updates",
    description:
      "Follow Shumaker Roofing for the latest roofing tips, maintenance guides, company news, and industry insights. Keep your roof in top shape! Contact us now!",
  },
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop";

export default async function BlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawPosts: any[] = [];
  try {
    const response = await client.getEntries({
      content_type: "blog",
      order: ["-fields.date"],
    });
    rawPosts = response.items;
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
  }

  // Serialize into plain objects — safe to pass to a Client Component
  const posts: BlogPost[] = rawPosts.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = item.fields as any;

    const imageField =
      post.featuredImage ||
      post.image ||
      post.coverImage ||
      post.heroImage ||
      post.thumbnail ||
      post.picture ||
      post.cover;
    const imageUrl =
      toHttpsUrl(imageField?.fields?.file?.url) ?? FALLBACK_IMAGE;

    const dateObj = post.publishedDate
      ? new Date(post.publishedDate)
      : post.date
      ? new Date(post.date)
      : new Date(item.sys.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    let categories: string[] = [];
    const categoriesField = post.categories || post.category;
    if (Array.isArray(categoriesField)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories = categoriesField
        .map(
          (cat: any) =>
            cat?.fields?.name ||
            cat?.fields?.title ||
            cat?.fields?.category ||
            (typeof cat === "string" ? cat : "")
        )
        .filter(Boolean);
    } else if (categoriesField) {
      const catName =
        categoriesField?.fields?.name ||
        categoriesField?.fields?.title ||
        categoriesField?.fields?.category ||
        (typeof categoriesField === "string" ? categoriesField : "");
      if (catName) categories.push(catName);
    }

    const authorField =
      post.author ||
      post.creator ||
      post.writer ||
      post.publisher ||
      post.Author;
    const authorName =
      authorField?.fields?.name ||
      authorField?.fields?.fullName ||
      authorField?.fields?.title ||
      (typeof authorField === "string" ? authorField : "Shumaker Team");

    const description =
      typeof post.description === "string"
        ? post.description
        : typeof post.excerpt === "string"
        ? post.excerpt
        : "Click to read more about this topic in our detailed insights article.";

    return {
      id: item.sys.id,
      slug: post.title ? slugify(post.title as string) : item.sys.id,
      title: (post.title as string) || "Untitled",
      description,
      imageUrl,
      formattedDate,
      authorName,
      categories,
    };
  });

  // Collect unique categories across all posts, preserve insertion order
  const categories = Array.from(
    new Set(posts.flatMap((p) => p.categories))
  );

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src={FALLBACK_IMAGE}
            alt="Blog"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Blog
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Get the latest updates, expert tips, and industry news from the
            professionals at Shumaker Roofing.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeader title="Latest Articles" subtitle="Blog" align="center" />
          <BlogFilter posts={posts} categories={categories} />
        </Container>
      </section>
    </div>
  );
}
