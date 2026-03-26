import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getPostBySlug, blogPosts } from "@/lib/data";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | Shumaker Roofing News`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Article Header */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/80" />
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10">
          <Link href="/news" className="inline-flex items-center text-primary hover:text-white transition-colors mb-6 font-medium text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to News
          </Link>
          <div className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-block mb-4 backdrop-blur-sm">
            {post.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 max-w-4xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {post.date}</span>
            <span className="flex items-center gap-2"><User className="h-4 w-4" /> By {post.author}</span>
          </div>
        </Container>
      </section>

      <Container className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 prose prose-lg max-w-none prose-p:text-foreground/80">
            <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">Content</h2>
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('- ') || paragraph.match(/^\d+\./)) {
                return (
                  <div key={index} className="pl-4 my-6 border-l-2 border-primary">
                    {paragraph.split('\n').map((item, i) => (
                      <p key={i} className="my-1.5 font-medium text-foreground">{item}</p>
                    ))}
                  </div>
                );
              }
              return <p key={index} className="mb-4">{paragraph}</p>;
            })}
          </article>
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-muted/50 p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-heading font-bold mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">{post.author}</h4>
                  <p className="text-sm text-muted-foreground">Roofing Specialist</p>
                </div>
              </div>
              <p className="text-sm text-foreground/70">
                With years of experience at Shumaker Roofing, {post.author} shares valuable insights and industry knowledge to help homeowners make informed decisions.
              </p>
            </div>
            
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl">
              <h3 className="text-xl font-heading font-bold mb-4 text-white">Need Roofing Help?</h3>
              <p className="text-primary-foreground/90 mb-6 text-sm text-white/80">
                If you are dealing with roofing issues, our team is ready to provide top-notch service and a free estimate.
              </p>
              <Button variant="secondary" className="w-full text-primary" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
