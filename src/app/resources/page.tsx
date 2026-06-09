import Link from "next/link";
import { BookOpen, ChevronRight, FileText, FileCode, Tag } from "lucide-react";
import { fetchResourcesList } from "@/lib/github/resources";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/shared/SearchBar";

export const metadata = {
  title: "Resources | NITRR OSS",
  description: "Documentation and help resources for the NITRR Open Source Community.",
};

export default async function ResourcesPage() {
  const resources = await fetchResourcesList();

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
              Resources &{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Documentation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Everything you need to know about the NITRR Open Source Community. Learn how to
              contribute, understand our scoring system, and read through our technical guides.
            </p>
            <SearchBar type="resource" />
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-card/50 backdrop-blur-sm">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium text-muted-foreground">
                No resources found at the moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2">Check back later for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Link
                  key={resource.slug}
                  href={`/resources/${resource.slug}`}
                  className="group block p-6 md:p-8 rounded-3xl border bg-card/80 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 -z-10"></div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {resource.name.toLowerCase().includes("guidelines") ||
                        resource.name.toLowerCase().includes("how to") ? (
                          <FileText className="w-6 h-6" />
                        ) : (
                          <FileCode className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          Markdown Document
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                      <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/50">
                      {resource.tags.slice(0, 3).map((tag) => (
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
