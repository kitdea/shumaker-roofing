import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { Container } from "@/components/shared/container";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { fetchEntrySeo } from "@/lib/seo";

const getPostFromSlug = cache(async function getPostFromSlug(slug: string) {
  let post = null;

  // Try finding by slug field first
  try {
    const response = await client.getEntries({ content_type: 'blog', 'fields.slug': slug, limit: 1, include: 2 });
    if (response.items.length > 0) {
      post = response.items[0];
    }
  } catch {
    // Ignore error: This happens if the user doesn't have a "slug" field in their content model (422 Unprocessable Entity)
  }

  // If not found by slug (or if slug field doesn't exist), check if the URL parameter is actually the sys.id
  if (!post) {
    try {
      const byId = await client.getEntry(slug);
      if (byId && byId.sys.contentType.sys.id === 'blog') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        post = byId as any;
      }
    } catch {
      // Ignore entry not found error 
    }
  }

  return post;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetches the blog entry, resolves the linked SEO Metadata entry, and builds
  // the full Next.js Metadata object — including title, description, OG, Twitter,
  // canonical URL, and robots directives.
  // Falls back to the entry's own title/description when no seoMetadata is linked.
  return fetchEntrySeo({
    contentType: "blog",
    slugField: "slug",
    slug,
    fallbackTitle: "Shumaker Roofing Blog",
    fallbackDesc: "Read our latest roofing insights and tips.",
    ogType: "article",
    notFoundTitle: "Post Not Found",
    // Extract a fallback image from the entry's own fields if no SEO image is set
    fallbackImageExtractor: (fields) => {
      const img =
        fields.featuredImage ||
        fields.image ||
        fields.coverImage ||
        fields.heroImage ||
        fields.thumbnail ||
        fields.cover;
      const url: string | undefined = img?.fields?.file?.url;
      return url ? (url.startsWith("//") ? `https:${url}` : url) : undefined;
    },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawPost = await getPostFromSlug(slug);

  if (!rawPost) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postFields = rawPost.fields as any;

  const imageField = postFields.featuredImage || postFields.image || postFields.coverImage || postFields.heroImage || postFields.thumbnail || postFields.picture || postFields.cover;
  const imageUrl = imageField?.fields?.file?.url
    ? `https:${imageField.fields.file.url}`
    : "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop";

  const dateObj = postFields.publishedDate ? new Date(postFields.publishedDate) : (postFields.date ? new Date(postFields.date) : new Date(rawPost.sys.createdAt));
  const formattedDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  let categories: string[] = [];
  const categoriesField = postFields.categories || postFields.category;
  if (Array.isArray(categoriesField)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = categoriesField.map((cat: any) => cat?.fields?.name || cat?.fields?.title || cat?.fields?.category || (typeof cat === 'string' ? cat : "")).filter(Boolean);
  } else if (categoriesField) {
    const catName = categoriesField?.fields?.name || categoriesField?.fields?.title || categoriesField?.fields?.category || (typeof categoriesField === 'string' ? categoriesField : "");
    if (catName) categories.push(catName);
  }

  const authorField = postFields.author || postFields.creator || postFields.writer || postFields.publisher || postFields.Author;
  const authorName = authorField?.fields?.name || authorField?.fields?.fullName || authorField?.fields?.title || (typeof authorField === 'string' ? authorField : "Shumaker Team");

  const authorRole = authorField?.fields?.role || authorField?.fields?.jobTitle || authorField?.fields?.position || "";
  const authorBio = authorField?.fields?.bio || authorField?.fields?.description || authorField?.fields?.shortBio || null;
  const authorAvatar = authorField?.fields?.avatar || authorField?.fields?.picture || authorField?.fields?.image || authorField?.fields?.profilePicture;
  const authorAvatarUrl = authorAvatar?.fields?.file?.url ? `https:${authorAvatar.fields.file.url}` : null;

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Article Header */}
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
          <Link href="/news" className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-6 font-medium text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-primary/20 text-white border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-block backdrop-blur-sm shadow-sm">
                {cat}
              </div>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 max-w-4xl leading-tight">
            {postFields.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formattedDate}</span>
            <span className="flex items-center gap-2"><User className="h-4 w-4" /> By {authorName}</span>
          </div>
        </Container>
      </section>

      <Container className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {documentToReactComponents(postFields.content as any)}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
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
              <div className="text-sm text-foreground/80 leading-relaxed">
                {typeof authorBio === 'string' ? (
                  <p>{authorBio}</p>
                ) : authorBio && typeof authorBio === 'object' ? (
                  documentToReactComponents(authorBio)
                ) : (
                  <p>With dedicated expertise in the industry, {authorName} shares valuable insights and knowledge to help our readers stay informed and make confident decisions.</p>
                )}
              </div>
            </div>

            <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-8 opacity-10 blur-xl">
                <div className="w-40 h-40 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white relative z-10">Need Roofing Help?</h3>
              <p className="text-primary-foreground/90 mb-8 text-sm text-white/90 relative z-10 leading-relaxed">
                If you are dealing with roofing issues, our expert team is ready to provide top-notch service and a free estimate to protect your home.
              </p>
              <Button variant="secondary" size="lg" className="w-full font-bold text-primary hover:bg-white relative z-10 shadow-md" asChild>
                <Link href="/contact">Contact Us Today</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
