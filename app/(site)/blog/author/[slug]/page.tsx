export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Calendar, ChevronLeft, Mail, Link as LinkIcon } from "lucide-react";
import { PortableText } from "@portabletext/react";
import {
  fetchAuthorSlugs,
  fetchAuthorBySlug,
  fetchPostsByAuthorSlug,
} from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { SITE_URL, FALLBACK_BLOG_IMAGE, formatLongDate } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = await fetchAuthorSlugs();
  return (slugs as Array<{ slug?: string }>)
    .filter((s): s is { slug: string } => Boolean(s.slug))
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await fetchAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found" };

  const title = `${author.name}${author.jobTitle ? ` — ${author.jobTitle}` : ""} | Shumaker Roofing`;
  const description =
    author.shortBio || `Read roofing articles and expert insights written by ${author.name} at Shumaker Roofing.`;
  const image = urlFor(author.photo);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/blog/author/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/author/${slug}`,
      type: "profile",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await fetchAuthorBySlug(slug);

  if (!author) notFound();

  const posts = await fetchPostsByAuthorSlug(slug);
  const photoUrl = urlFor(author.photo);
  const authorUrl = `${SITE_URL}/blog/author/${slug}`;
  const sameAs = (author.sameAs ?? []).filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${authorUrl}#profilepage`,
    "url": authorUrl,
    "mainEntity": {
      "@type": "Person",
      "@id": `${authorUrl}#person`,
      "name": author.name,
      "url": authorUrl,
      ...(author.jobTitle ? { "jobTitle": author.jobTitle } : {}),
      ...(photoUrl ? { "image": photoUrl } : {}),
      ...(author.shortBio ? { "description": author.shortBio } : {}),
      ...((author.expertise ?? []).length > 0 ? { "knowsAbout": author.expertise } : {}),
      ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
      "worksFor": {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Shumaker Roofing Company",
        "url": SITE_URL,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="flex flex-col w-full pb-24">
        {/* Header */}
        <section className="bg-secondary/40 border-b border-border">
          <Container className="py-16">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-8 font-medium text-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blog
            </Link>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={author.name ?? "Author"}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-full object-cover shadow-md shrink-0"
                  priority
                />
              ) : null}
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-1">
                  {author.name}
                </h1>
                {author.jobTitle && (
                  <p className="text-primary font-medium">{author.jobTitle}</p>
                )}
                {author.credentials && (
                  <p className="text-sm text-muted-foreground mt-1">{author.credentials}</p>
                )}
                {author.shortBio && (
                  <p className="text-foreground/80 mt-4 max-w-2xl leading-relaxed">{author.shortBio}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" /> {author.email}
                    </a>
                  )}
                  {sameAs.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" /> {new URL(url).hostname.replace("www.", "")}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Full bio */}
        {author.bio ? (
          <Container className="mt-12">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/90">
              <PortableText value={author.bio as never} />
            </div>
          </Container>
        ) : null}

        {/* Posts by this author */}
        <Container className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
            Articles by {author.name}
          </h2>
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No articles published yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const imageUrl = urlFor(post.featuredImage) ?? FALLBACK_BLOG_IMAGE;
                const postSlug = post.slug?.current ?? post._id;
                const formattedDate = formatLongDate(
                  post.publishedDate ? new Date(post.publishedDate) : new Date()
                );
                return (
                  <Link
                    key={post._id}
                    href={`/blog/${postSlug}`}
                    className="group flex flex-col rounded-2xl border border-border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.title || "Blog post"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                      </span>
                      <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/70 line-clamp-3">
                        {post.excerpt || "Read more about this topic in our detailed insights article."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
