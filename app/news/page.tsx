import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/lib/data";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "News & Insights | Shumaker Roofing",
  description: "Stay up to date with the latest roofing tips, company news, and industry insights.",
};

export default function NewsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[35vh] min-h-[250px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop"
            alt="News and Insights"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">News & Insights</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Get the latest updates, expert tips, and industry news from the professionals at Shumaker Roofing.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeader title="Latest Articles" subtitle="Blog" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {blogPosts.map((post) => (
              <Card key={post.id} className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
                <Link href={`/news/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase py-1 px-3 rounded-md">
                    {post.category}
                  </div>
                </Link>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
                  </div>
                  <Link href={`/news/${post.slug}`} className="group-hover:text-primary transition-colors">
                    <h3 className="text-xl font-heading font-bold mb-3">{post.title}</h3>
                  </Link>
                  <p className="text-foreground/70 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto justify-start font-semibold text-primary" asChild>
                    <Link href={`/news/${post.slug}`}>
                      READ MORE <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
