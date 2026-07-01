export const revalidate = 3600;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllBlogSlugs, fetchBlogPostBySlug, mapSplitSections, resolveAuthor, type SplitSectionItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { fetchPageSeo } from "@/lib/seo";
import { TwoColumnSection } from "@/components/shared/two-column-section";
import { PortableTextTable } from "@/components/shared/portable-text-table";
import { portableTextLinkMark } from "@/components/shared/portable-text-link";
import { SITE_URL, SITE_DOMAIN, FALLBACK_BLOG_IMAGE, formatLongDate } from "@/lib/utils";

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
const BARE_URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderTextWithLinks(text: string) {
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // First pass: parse markdown links [label](url)
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(...renderBareUrls(text.slice(lastIndex, match.index), result.length));
    }
    const [, label, href] = match;
    const isInternal = href.includes(SITE_DOMAIN);
    result.push(
      <a
        key={match.index}
        href={href}
        target={isInternal ? "_self" : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
        className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(...renderBareUrls(text.slice(lastIndex), result.length));
  }
  return result;
}

function renderBareUrls(text: string, keyOffset: number): React.ReactNode[] {
  const parts = text.split(BARE_URL_REGEX);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const isInternal = part.includes(SITE_DOMAIN);
      return (
        <a
          key={keyOffset + i}
          href={part}
          target={isInternal ? "_self" : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function getPortableTextComponents(fallbackAlt: string): PortableTextComponents {
  return {
    marks: {
      link: portableTextLinkMark,
    },
    types: {
      image: ({ value }) => {
        const url = urlFor(value);
        if (!url) return null;
        return (
          <div className="my-8 rounded-xl overflow-hidden shadow-md">
            <Image src={url} alt={value.alt || fallbackAlt} width={800} height={500} className="w-full h-auto object-cover" />
          </div>
        );
      },
      table: ({ value }) => <PortableTextTable rows={value?.rows} />,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs();
  return (slugs as Array<{ slug?: string }>)
    .filter((s): s is { slug: string } => Boolean(s.slug))
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const fallbackTitle = post.title || "Shumaker Roofing Blog";
  const fallbackDesc = post.excerpt || "Read our latest roofing insights and tips.";

  return fetchPageSeo({
    entryFields: post,
    fallbackTitle,
    fallbackDesc,
    fallbackImage: urlFor(post.featuredImage),
    ogType: "article",
    canonicalPath: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) notFound();

  const twoColumnData = mapSplitSections(post.splitSections).filter(
    (s): s is SplitSectionItem & { imageUrl: string } => s.imageUrl !== null
  );

  const imageUrl = urlFor(post.featuredImage) ?? FALLBACK_BLOG_IMAGE;

  const dateObj = new Date(post.publishedDate ?? post._createdAt);
  const formattedDate = formatLongDate(dateObj);

  const categories: string[] = post.categories ?? [];
  const author = resolveAuthor(post);
  const authorName = author.name;
  const authorUrl = author.slug ? `${SITE_URL}/blog/author/${author.slug}` : undefined;

  const faqItems: { question: string; answer: string }[] = (post.faqItems ?? []).filter(
    (f: { question?: string; answer?: string }) => f.question && f.answer
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog/${slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title as string, "item": `${SITE_URL}/blog/${slug}` },
        ],
      },
      {
        "@type": "Article",
        "@id": `${SITE_URL}/blog/${slug}#article`,
        "headline": post.title as string,
        "description": (post.excerpt ?? "").trim(),
        "image": {
          "@type": "ImageObject",
          "url": imageUrl,
          "width": 1200,
          "height": 630,
        },
        "url": `${SITE_URL}/blog/${slug}`,
        "datePublished": dateObj.toISOString(),
        "dateModified": new Date(post._updatedAt ?? dateObj).toISOString(),
        "author": {
          "@type": "Person",
          ...(authorUrl ? { "@id": `${authorUrl}#person` } : {}),
          "name": authorName,
          ...(authorUrl ? { "url": authorUrl } : {}),
          ...(author.jobTitle ? { "jobTitle": author.jobTitle } : {}),
          ...(author.imageUrl ? { "image": author.imageUrl } : {}),
          ...(author.shortBio ? { "description": author.shortBio } : {}),
          ...(author.expertise.length > 0 ? { "knowsAbout": author.expertise } : {}),
          ...(author.sameAs.length > 0 ? { "sameAs": author.sameAs } : {}),
          "worksFor": {
            "@type": "Organization",
            "name": "Shumaker Roofing Company",
            "url": SITE_URL,
          },
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          "name": "Shumaker Roofing Company",
          "url": SITE_URL,
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/blog/${slug}`,
          "breadcrumb": { "@id": `${SITE_URL}/blog/${slug}#breadcrumb` },
        },
        ...(categories.length > 0 ? { "articleSection": categories.join(", ") } : {}),
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/blog/${slug}#faq`,
              "mainEntity": faqItems.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-end pb-16 bg-secondary">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-slate-900/70 absolute inset-0 z-10" />
          <Image
            src={imageUrl}
            alt={post.title || "Blog Post"}
            fill
            sizes="100vw"
            className="object-cover opacity-60 mix-blend-overlay z-0"
            priority
          />
        </div>
        <Container className="relative z-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-6 font-medium text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-primary/20 text-white border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-block backdrop-blur-sm shadow-sm"
              >
                {cat}
              </div>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 max-w-4xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" /> By{" "}
              {authorUrl ? (
                <Link href={authorUrl} className="hover:text-primary transition-colors underline-offset-2 hover:underline">
                  {authorName}
                </Link>
              ) : (
                authorName
              )}
            </span>
          </div>
        </Container>
      </section>

      {/* Article body */}
      <Container className="mt-12">
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
          {post.content && (
            <PortableText value={post.content} components={getPortableTextComponents(post.title || "Blog post image")} />
          )}
        </article>
      </Container>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <Container className="mt-12">
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="bg-muted/60 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-heading font-bold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-border">
              {faqItems.map((faq, idx) => (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-muted/40 transition-colors">
                    <span className="font-semibold text-foreground">{faq.question}</span>
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-foreground/80 leading-relaxed text-sm">
                    {renderTextWithLinks(faq.answer)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* About the Author — horizontal */}
      <Container className="mt-16">
        <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-start gap-6">
          <div className="flex items-center gap-4 sm:shrink-0">
            {author.imageUrl ? (
              <Image
                src={author.imageUrl}
                alt={authorName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <User className="h-6 w-6" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-foreground">{authorName}</h4>
              {author.jobTitle && (
                <p className="text-xs text-muted-foreground">{author.jobTitle}</p>
              )}
              {author.credentials && (
                <p className="text-xs text-muted-foreground">{author.credentials}</p>
              )}
            </div>
          </div>
          <div className="sm:border-l sm:border-border sm:pl-6">
            <h3 className="text-lg font-heading font-bold mb-2">About the Author</h3>
            <div className="text-sm text-foreground/80 leading-relaxed">
              <p>
                {author.shortBio ||
                  `With dedicated expertise in the industry, ${authorName} shares valuable insights and knowledge to help our readers stay informed and make confident decisions.`}
              </p>
            </div>
            {authorUrl && (
              <Link
                href={authorUrl}
                className="inline-block mt-3 text-sm font-medium text-primary hover:underline underline-offset-2"
              >
                View all posts by {authorName} →
              </Link>
            )}
          </div>
        </div>
      </Container>

      {/* CTA — horizontal */}
      <Container className="mt-6">
        <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute -right-4 -top-8 opacity-10 blur-xl pointer-events-none">
            <div className="w-40 h-40 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-heading font-bold text-white mb-2">Need Roofing Help?</h3>
            <p className="text-white/90 text-sm leading-relaxed max-w-xl">
              If you are dealing with roofing issues, our expert team is ready to provide top-notch
              service and a free estimate to protect your home.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="relative z-10 font-bold text-primary hover:bg-white shadow-md shrink-0"
            asChild
          >
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </Container>
      {twoColumnData.length > 0 && (
        <div className="divide-y divide-border">
          {twoColumnData.map((section, idx) => (
            <TwoColumnSection
              key={section.id}
              splitTitle={section.splitTitle}
              splitDescription={section.splitDescription}
              splitImageUrl={section.imageUrl}
              imageRight={idx % 2 !== 0}
            />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
