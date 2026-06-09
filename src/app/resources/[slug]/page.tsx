import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchResourceContent } from "@/lib/github/resources";
import { MarkdownRenderer } from "@/components/resources/MarkdownRenderer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, List } from "lucide-react";
import { HelpfulStats } from "@/components/shared/HelpfulStats";

interface ResourcePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ResourcePageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} | NITRR OSS Resources`,
  };
}

function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split("\n");
  const regex = /^(#{2,3})\s+(.*)/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-");

      headings.push({ id, text, level });
    }
  }
  return headings;
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const content = await fetchResourceContent(slug);

  if (!content) {
    notFound();
  }

  const headings = extractHeadings(content);
  const githubUrl = `https://github.com/NITRR-Official/Help-and-Resources/blob/main/${slug}.md`;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            asChild
            className="-ml-4 text-muted-foreground hover:text-foreground"
          >
            <Link href="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          <article className="flex-1 min-w-0 bg-card border rounded-2xl p-6 md:p-12 shadow-sm w-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 pb-8 border-b">{title}</h1>
            <MarkdownRenderer content={content} />
            <div className="mt-12 pt-8 border-t">
              <HelpfulStats slug={slug} />
            </div>
          </article>

          {headings.length > 0 && (
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <List className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    On this page
                  </h4>
                </div>
                <nav className="relative text-sm">
                  <div className="absolute left-[5px] top-3 bottom-3 w-px bg-border/60"></div>
                  <ul className="flex flex-col gap-3">
                    {headings.map((heading, i) => (
                      <li key={`${heading.id}-${i}`} className="relative pl-6">
                        <div
                          className={`absolute left-[5px] top-1/2 h-px bg-border/60 -translate-y-1/2 ${heading.level === 3 ? "w-6" : "w-3"}`}
                        ></div>
                        <a
                          href={`#${heading.id}`}
                          className={`block hover:text-primary transition-colors truncate ${
                            heading.level === 3
                              ? "ml-4 text-muted-foreground text-xs"
                              : "text-foreground font-medium"
                          }`}
                          title={heading.text}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </Container>
    </div>
  );
}
