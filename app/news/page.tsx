import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { client } from "@/lib/contentful";
import { fetchPageSeo } from "@/lib/seo";
import { slugify } from "@/lib/utils";

export async function generateMetadata() {
  return fetchPageSeo({
    path: "/news",
    fallbackTitle: "Blog | Shumaker Roofing",
    fallbackDesc:
      "Stay up to date with the latest roofing tips, maintenance guides, company news, and industry insights from the Shumaker Roofing team.",
    ogType: "website",
  });
}

export default async function NewsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = [];
  try {
    const response = await client.getEntries({ content_type: 'blog', order: ['-fields.date'] });
    posts = response.items;
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop"
            alt="Blog"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">Blog</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Get the latest updates, expert tips, and industry news from the professionals at Shumaker Roofing.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeader title="Latest Articles" subtitle="Blog" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {posts.map((item) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const post = item.fields as any;
              // Try various common contentful image field names
              const imageField = post.featuredImage || post.image || post.coverImage || post.heroImage || post.thumbnail || post.picture || post.cover;
              const imageUrl = imageField?.fields?.file?.url
                ? `https:${imageField.fields.file.url}`
                : "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop"; // fallback image

              // Format date from Contentful sys or a custom date field
              const dateObj = post.publishedDate ? new Date(post.publishedDate) : (post.date ? new Date(post.date) : new Date(item.sys.createdAt));
              const formattedDate = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

              // Extract all categories dynamically and remove any static fallback
              let categories: string[] = [];
              const categoriesField = post.categories || post.category;
              if (Array.isArray(categoriesField)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                categories = categoriesField.map((cat: any) => cat?.fields?.name || cat?.fields?.title || cat?.fields?.category || (typeof cat === 'string' ? cat : "")).filter(Boolean);
              } else if (categoriesField) {
                const catName = categoriesField?.fields?.name || categoriesField?.fields?.title || categoriesField?.fields?.category || (typeof categoriesField === 'string' ? categoriesField : "");
                if (catName) categories.push(catName);
              }

              // Try various common contentful author field names
              const authorField = post.author || post.creator || post.writer || post.publisher || post.Author;
              const authorName = authorField?.fields?.name || authorField?.fields?.fullName || authorField?.fields?.title || (typeof authorField === 'string' ? authorField : "Shumaker Team");
              const descriptionText = typeof post.description === 'string' ? post.description : (typeof post.excerpt === 'string' ? post.excerpt : "Click to read more about this topic in our detailed insights article.");

              return (
                <Card key={item.sys.id} className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
                  <Link href={`/news/${post.title ? slugify(post.title as string) : item.sys.id}`} className="relative h-56 w-full overflow-hidden block bg-muted">
                    <Image
                      src={imageUrl}
                      alt={post.title || "Blog post"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {categories.map((cat, idx) => (
                        <div key={idx} className="bg-primary text-white text-xs font-bold uppercase py-1 px-3 rounded-md">
                          {cat}
                        </div>
                      ))}
                    </div>
                  </Link>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formattedDate}</span>
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {authorName}</span>
                    </div>
                    <Link href={`/news/${post.title ? slugify(post.title as string) : item.sys.id}`} className="group-hover:text-primary transition-colors">
                      <h3 className="text-xl font-heading font-bold mb-3">{post.title as string}</h3>
                    </Link>
                    <p className="text-foreground/70 mb-6 flex-1 line-clamp-3">
                      {descriptionText}
                    </p>
                    <Button variant="link" className="p-0 h-auto justify-start font-semibold text-primary" asChild>
                      <Link href={`/news/${post.title ? slugify(post.title as string) : item.sys.id}`}>
                        READ MORE <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
