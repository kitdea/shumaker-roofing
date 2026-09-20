import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllBlogPosts } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { FALLBACK_BLOG_IMAGE, formatLongDate } from "@/lib/utils";

/**
 * Homepage "Latest From Our Blog" preview — 3 most recent posts with
 * contextual, in-body links to /blog and each post.
 *
 * Added to address GSC-GA4 Insights checklist row 6: /blog had only
 * nav/footer links pointing to it site-wide (weak signal), no contextual
 * in-body links from the homepage or any other high-authority page, and
 * was landing at avg position 37.9 with 3,941 impressions but 1 click
 * over 28 days.
 */
export async function BlogPreviewSection() {
  let posts: Awaited<ReturnType<typeof fetchAllBlogPosts>> = [];
  try {
    posts = (await fetchAllBlogPosts()).slice(0, 3);
  } catch (err) {
    console.error("Failed to fetch blog posts for homepage preview:", err);
  }

  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => {
        const slug = post.slug?.current ?? post._id;
        const imageUrl = urlFor(post.featuredImage) ?? FALLBACK_BLOG_IMAGE;
        const formattedDate = formatLongDate(
          post.publishedDate ? new Date(post.publishedDate) : new Date()
        );

        return (
          <Card
            key={post._id}
            className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full"
          >
            <Link
              href={`/blog/${slug}`}
              className="relative h-48 w-full overflow-hidden block bg-muted"
            >
              <Image
                src={imageUrl}
                alt={post.title || "Shumaker Roofing blog post"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                quality={50}
              />
            </Link>
            <CardContent className="p-6 flex-1 flex flex-col">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3.5 w-3.5" /> {formattedDate}
              </span>
              <Link
                href={`/blog/${slug}`}
                className="group-hover:text-primary transition-colors"
              >
                <h3 className="text-lg font-heading font-bold mb-3 line-clamp-2">
                  {post.title}
                </h3>
              </Link>
              <p className="text-foreground/70 mb-4 flex-1 line-clamp-2 text-sm">
                {post.excerpt || "Read more roofing tips and guides from Shumaker Roofing."}
              </p>
              <Link
                href={`/blog/${slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
