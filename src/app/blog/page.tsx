import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getAllPosts } from "@/lib/blog";
import { Calendar, User, Tag, BookOpen } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";

export const metadata = {
  title: "Blog | NITRR OSS",
  description: "Updates, developer spotlights, and showcases from the NITRR Open Source Community.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="py-16 md:py-24 min-h-[80vh] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Community{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Blog
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Discover stories, updates, and deep-dives from the NITRR open-source community.
            </p>
            <SearchBar type="blog" />
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-card/50 backdrop-blur-sm">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium text-muted-foreground">
                No blog posts found yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col rounded-3xl border bg-card/80 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 relative overflow-hidden"
                >
                  <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View Article</span>
                  </Link>

                  {post.coverImage && (
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden border-b">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col flex-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 -z-10"></div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                          >
                            <Tag className="w-3 h-3 mr-1.5 opacity-70" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-6">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <span className="font-medium text-primary">Read Article &rarr;</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
