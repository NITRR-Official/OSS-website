import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  GitFork,
  GitPullRequest,
  MessageSquare,
  Code2,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContributePage() {
  return (
    <div className="py-12">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How to Contribute</h1>
          <p className="text-lg text-muted-foreground">
            Start your open-source journey with us - everyone is welcome!
          </p>
        </div>

        {/* Getting Started */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Join Our Community</h3>
                  <p className="text-muted-foreground mb-3">
                    Join our Discord server to connect with other contributors, ask questions, and
                    get help.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={SITE_CONFIG.links.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Discord
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Explore Projects</h3>
                  <p className="text-muted-foreground mb-3">
                    Browse our projects page to find something that interests you. Look for issues
                    tagged with &quot;good first issue&quot; or &quot;help wanted&quot;.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/projects">View Projects</Link>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Fork & Clone</h3>
                  <p className="text-muted-foreground mb-3">
                    Fork the repository on GitHub and clone it to your local machine to start making
                    changes.
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    git clone https://github.com/YOUR-USERNAME/PROJECT-NAME.git
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Make Changes & Test</h3>
                  <p className="text-muted-foreground mb-3">
                    Create a new branch, make your changes, and thoroughly test your code. Follow
                    the project&apos;s coding standards and guidelines.
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    git checkout -b feature/your-feature-name
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Submit Pull Request</h3>
                  <p className="text-muted-foreground mb-3">
                    Push your changes and create a pull request. Provide a clear description of what
                    you&apos;ve changed and why.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={SITE_CONFIG.links.github} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Contribution Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Ways to Contribute</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Code</h3>
                <p className="text-sm text-muted-foreground">
                  Fix bugs, implement features, or improve performance
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Write or improve documentation, tutorials, and guides
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Review pull requests and provide constructive feedback
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Contribution Guidelines</h2>
          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Follow coding standards</p>
                  <p className="text-sm text-muted-foreground">
                    Use the project&apos;s linting and formatting tools
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Write clear commit messages</p>
                  <p className="text-sm text-muted-foreground">
                    Use descriptive messages that explain what and why
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Test your changes</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure your code works and doesn&apos;t break existing functionality
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Be respectful and inclusive</p>
                  <p className="text-sm text-muted-foreground">
                    Follow our Code of Conduct and treat everyone with respect
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Ask for help when needed</p>
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t hesitate to ask questions in Discord or on GitHub
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Earn Points */}
        <section>
          <Card className="p-8 bg-muted/50">
            <div className="text-center">
              <GitPullRequest className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Earn Points & Climb the Leaderboard</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every merged pull request for an org reconized issue earns you points based on
                difficulty:
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge variant="outline" className="text-base py-2 px-4">
                  Easy: 10 points
                </Badge>
                <Badge variant="outline" className="text-base py-2 px-4">
                  Medium: 25 points
                </Badge>
                <Badge variant="outline" className="text-base py-2 px-4">
                  Hard: 50 points
                </Badge>
              </div>
              <Button asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </Card>
        </section>
      </Container>
    </div>
  );
}
