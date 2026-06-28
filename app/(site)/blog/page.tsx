export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { fetchAllBlogPosts, resolveAuthor, type BlogListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { SITE_URL, FALLBACK_BLOG_IMAGE, formatLongDate } from "@/lib/utils";
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


function buildBlogSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": SITE_URL + "/blog#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": SITE_URL + "/blog" },
        ],
      },
      {
        "@type": "Blog",
        "@id": SITE_URL + "/blog#blog",
        "url": SITE_URL + "/blog",
        "name": "Shumaker Roofing Blog",
        "description":
          "Expert roofing tips, maintenance guides, company news, and industry insights from Shumaker Roofing.",
        "publisher": {
          "@type": "Organization",
          "@id": SITE_URL + "/#organization",
          "name": "Shumaker Roofing Company",
          "url": SITE_URL,
        },
        "blogPost": posts.slice(0, 10).map((p) => ({
          "@type": "BlogPosting",
          "headline": p.title,
          "url": SITE_URL + "/blog/" + p.slug,
          "image": p.imageUrl,
          "author": {
            "@type": "Person",
            "name": p.authorName,
            ...(p.authorSlug ? { "url": `${SITE_URL}/blog/author/${p.authorSlug}` } : {}),
          },
        })),
      },
    ],
  };
}

export default async function BlogPage() {
  let rawPosts: BlogListItem[] = [];
  try {
    rawPosts = await fetchAllBlogPosts();
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
  }

  const posts: BlogPost[] = rawPosts.map((post) => {
    const imageUrl = urlFor(post.featuredImage) ?? FALLBACK_BLOG_IMAGE;
    const formattedDate = formatLongDate(post.publishedDate ? new Date(post.publishedDate) : new Date());
    const author = resolveAuthor(post);

    return {
      id: post._id,
      slug: post.slug?.current ?? post._id,
      title: post.title || "Untitled",
      description: post.excerpt || "Click to read more about this topic in our detailed insights article.",
      imageUrl,
      formattedDate,
      authorName: author.name,
      authorSlug: author.slug,
      categories: post.categories ?? [],
    };
  });


  const blogSchema = buildBlogSchema(posts);
  // Collect unique categories across all posts, preserve insertion order
  const categories = Array.from(
    new Set(posts.flatMap((p) => p.categories))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src={FALLBACK_BLOG_IMAGE}
            alt="Blog"
            fill
            sizes="100vw"
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
    </>
  );
}
