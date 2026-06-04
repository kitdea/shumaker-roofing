export const revalidate = 3600;
export const dynamicParams = true;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { Container } from "@/components/shared/container";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES, BLOCKS } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";
import type { Hyperlink } from "@contentful/rich-text-types";
import { fetchPageSeo } from "@/lib/seo";
import { TwoColumnSection } from "@/components/shared/two-column-section";
import { slugify, toHttpsUrl, SITE_URL } from "@/lib/utils";

const SITE_DOMAIN = "shumakerroofing.com";

const richTextOptions: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = (node as Hyperlink).data.uri as string;
      const isExternal = uri.startsWith("http") && !uri.includes(SITE_DOMAIN);
      return (
        <a
          href={uri}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const asset = node.data?.target?.fields;
      const url = toHttpsUrl(asset?.file?.url);
      const alt = (asset?.title as string) || (asset?.description as string) || "";
      const width = (asset?.file?.details?.image?.width as number) || 800;
      const height = (asset?.file?.details?.image?.height as number) || 500;
      if (!url) return null;
      return (
        <div className="my-8 rounded-xl overflow-hidden shadow-md">
          <Image src={url} alt={alt} width={width} height={height} className="w-full h-auto object-cover" />
        </div>
      );
    },
  },
};

const getPostFromSlug = cache(async function getPostFromSlug(slug: string) {
  let post = null;

  // Check fields.slug first (custom slug set in Contentful)
  try {
    const response = await client.getEntries({
      content_type: "blog",
      "fields.slug": slug,
      limit: 1,
      include: 3,
    });
    if (response.items.length > 0) post = response.items[0];
  } catch {
    // ignore — content model may not have a slug field
  }

  // Fall back to slugify(title) match
  if (!post) {
    try {
      const response = await client.getEntries({ content_type: "blog", include: 3 });
      post =
        response.items.find((item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const title = (item.fields as any).title as string | undefined;
          return title && slugify(title) === slug;
        }) ?? null;
    } catch {
      // ignore
    }
  }

  if (!post) {
    try {
      const byId = await client.getEntry(slug);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (byId?.sys.contentType.sys.id === "blog") post = byId as any;
    } catch {
      // ignore
    }
  }

  return post;
});

export async function generateStaticParams() {
  const response = await client.getEntries({ content_type: "blog", limit: 200 });
  return response.items.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = item.fields as any;
    const slug = fields.slug
      ? (fields.slug as string)
      : fields.title
      ? slugify(fields.title as string)
      : item.sys.id;
    return { slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawPost = await getPostFromSlug(slug);
  if (!rawPost) return { title: "Post Not Found" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = rawPost.fields as any;

  const fallbackTitle = (fields.title as string) || "Shumaker Roofing Blog";
  const fallbackDesc =
    (typeof fields.description === "string" ? fields.description : null) ||
    (typeof fields.excerpt === "string" ? fields.excerpt : null) ||
    "Read our latest roofing insights and tips.";

  const imageField =
    fields.featuredImage || fields.image || fields.coverImage ||
    fields.heroImage || fields.thumbnail || fields.cover;
  const rawImageUrl: string | undefined = imageField?.fields?.file?.url;
  const fallbackImage = toHttpsUrl(rawImageUrl);

  return fetchPageSeo({
    entryFields: fields,
    fallbackTitle,
    fallbackDesc,
    fallbackImage,
    ogType: "article",
    canonicalPath: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawPost = await getPostFromSlug(slug);

  if (!rawPost) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postFields = rawPost.fields as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitSections: any[] = Array.isArray(postFields.splitSection) ? postFields.splitSection : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const twoColumnData = splitSections.map((item: any) => {
    const f = item.fields;
    const firstImage = Array.isArray(f.splitImage) ? f.splitImage[0] : f.splitImage;
    const rawUrl: string | undefined = firstImage?.fields?.file?.url;
    const imageUrl = toHttpsUrl(rawUrl) ?? null;
    return {
      id: item.sys.id,
      splitTitle: typeof f.splitTitle === "string" ? f.splitTitle : String(f.splitTitle ?? ""),
      splitDescription: f.splitDescription ?? null,
      imageUrl,
    };
  }).filter((s: { imageUrl: string | null }) => s.imageUrl !== null);

  const imageField =
    postFields.featuredImage || postFields.image || postFields.coverImage ||
    postFields.heroImage || postFields.thumbnail || postFields.picture || postFields.cover;
  const imageUrl = toHttpsUrl(imageField?.fields?.file?.url)
    ?? "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop";

  const dateObj = postFields.publishedDate
    ? new Date(postFields.publishedDate)
    : postFields.date
    ? new Date(postFields.date)
    : new Date(rawPost.sys.createdAt);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let categories: string[] = [];
  const categoriesField = postFields.categories || postFields.category;
  if (Array.isArray(categoriesField)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = categoriesField
      .map((cat: any) =>
        cat?.fields?.name || cat?.fields?.title || cat?.fields?.category ||
        (typeof cat === "string" ? cat : "")
      )
      .filter(Boolean);
  } else if (categoriesField) {
    const catName =
      categoriesField?.fields?.name || categoriesField?.fields?.title ||
      categoriesField?.fields?.category ||
      (typeof categoriesField === "string" ? categoriesField : "");
    if (catName) categories.push(catName);
  }

  const authorField =
    postFields.author || postFields.creator || postFields.writer ||
    postFields.publisher || postFields.Author;
  const authorName =
    authorField?.fields?.name || authorField?.fields?.fullName ||
    authorField?.fields?.title || (typeof authorField === "string" ? authorField : "Shumaker Team");
  const authorRole =
    authorField?.fields?.role || authorField?.fields?.jobTitle ||
    authorField?.fields?.position || "";
  const authorBio =
    authorField?.fields?.bio || authorField?.fields?.description ||
    authorField?.fields?.shortBio || null;
  const authorAvatar =
    authorField?.fields?.avatar || authorField?.fields?.picture ||
    authorField?.fields?.image || authorField?.fields?.profilePicture;
  const authorAvatarUrl = toHttpsUrl(authorAvatar?.fields?.file?.url) ?? null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog/${slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": postFields.title as string, "item": `${SITE_URL}/blog/${slug}` },
        ],
      },
      {
        "@type": "Article",
        "@id": `${SITE_URL}/blog/${slug}#article`,
        "headline": postFields.title as string,
        "image": imageUrl,
        "url": `${SITE_URL}/blog/${slug}`,
        "datePublished": dateObj.toISOString(),
        "dateModified": new Date(rawPost.sys.updatedAt).toISOString(),
        "author": {
          "@type": "Person",
          "name": authorName,
          ...(authorRole ? { "jobTitle": authorRole } : {}),
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
        },
        "breadcrumb": { "@id": `${SITE_URL}/blog/${slug}#breadcrumb` },
        ...(categories.length > 0 ? { "articleSection": categories.join(", ") } : {}),
      },
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
            alt={postFields.title || "Blog Post"}
            fill
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
            {postFields.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" /> By {authorName}
            </span>
          </div>
        </Container>
      </section>

      {/* Article body */}
      <Container className="mt-12">
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {documentToReactComponents(postFields.content as any, richTextOptions)}
        </article>
      </Container>

      {/* About the Author — horizontal */}
      <Container className="mt-16">
        <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-start gap-6">
          <div className="flex items-center gap-4 sm:shrink-0">
            {authorAvatarUrl ? (
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20">
                <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
              </div>
            ) : (
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <User className="h-6 w-6" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-foreground">{authorName}</h4>
              {authorRole && (
                <p className="text-sm font-medium text-primary mt-0.5">{authorRole}</p>
              )}
            </div>
          </div>
          <div className="sm:border-l sm:border-border sm:pl-6">
            <h3 className="text-lg font-heading font-bold mb-2">About the Author</h3>
            <div className="text-sm text-foreground/80 leading-relaxed">
              {typeof authorBio === "string" ? (
                <p>{authorBio}</p>
              ) : authorBio && typeof authorBio === "object" ? (
                documentToReactComponents(authorBio, richTextOptions)
              ) : (
                <p>
                  With dedicated expertise in the industry, {authorName} shares valuable insights
                  and knowledge to help our readers stay informed and make confident decisions.
                </p>
              )}
            </div>
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {twoColumnData.map((section: any, idx: number) => (
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
