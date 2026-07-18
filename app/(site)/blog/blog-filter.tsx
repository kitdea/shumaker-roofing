"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 12;

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  formattedDate: string;
  authorName: string;
  authorSlug: string | null;
  categories: string[];
};

interface BlogFilterProps {
  posts: BlogPost[];
  categories: string[];
}

export function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.categories.includes(activeCategory);
      const matchesSearch = !q || post.title.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col gap-6 mb-12">
        <div className="relative max-w-lg mx-auto w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles..."
            className="h-12 w-full rounded-md border border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground/70 border-border hover:border-primary hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((post) => (
            <Card
              key={post.id}
              className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative h-56 w-full overflow-hidden block bg-muted"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {post.categories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="bg-primary text-white text-xs font-bold uppercase py-1 px-3 rounded-md"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </Link>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {post.formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />{" "}
                    {post.authorSlug ? (
                      <Link
                        href={`/blog/author/${post.authorSlug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.authorName}
                      </Link>
                    ) : (
                      post.authorName
                    )}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group-hover:text-primary transition-colors"
                >
                  <h3 className="text-xl font-heading font-bold mb-3">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-foreground/70 mb-6 flex-1 line-clamp-3">
                  {post.description}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto justify-start font-semibold text-primary"
                  asChild
                >
                  <Link href={`/blog/${post.slug}`}>
                    READ MORE <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No articles found{search ? ` for "${search}"` : ""}.
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("All"); setPage(1); }}
            className="mt-4 text-primary font-semibold hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex items-center justify-center h-10 w-10 rounded-md border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={currentPage === n ? "page" : undefined}
              className={cn(
                "h-10 w-10 rounded-md text-sm font-semibold border transition-colors",
                currentPage === n
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground/70 border-border hover:border-primary hover:text-primary"
              )}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex items-center justify-center h-10 w-10 rounded-md border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
