import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Research } from "@/types";
import { ExternalLink, FileText, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import researchData from "@/data/researches.json";

export default function ResearchPage() {
  const researches = researchData as unknown as Research[];

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Research Papers</h1>
          <p className="text-lg text-muted-foreground">
            Academic research and publications from our organization
          </p>
        </div>

        {researches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No research papers available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {researches.map((research) => (
              <Card key={research.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{research.title}</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{research.authors.join(", ")}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(research.publishedDate), "MMM yyyy")}</span>
                      </div>

                      {research.conference && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{research.conference}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4">{research.abstract}</p>

                    {research.tags && research.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {research.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {research.pdfUrl && (
                        <Button asChild variant="default">
                          <Link href={research.pdfUrl} target="_blank" rel="noopener noreferrer">
                            View PDF
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {research.doi && (
                        <Button asChild variant="outline">
                          <Link
                            href={`https://doi.org/${research.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            DOI
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {research.githubUrl && (
                        <Button asChild variant="outline">
                          <Link href={research.githubUrl} target="_blank" rel="noopener noreferrer">
                            GitHub
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
