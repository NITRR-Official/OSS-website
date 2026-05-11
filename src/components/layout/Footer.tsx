import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { Container } from "./Container";
import { SITE_CONFIG } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  pages: [
    { name: "Projects", href: "/projects" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Events", href: "/events" },
    { name: "Research", href: "/researches" },
    { name: "Team", href: "/team" },
    { name: "About", href: "/about" },
  ],
  resources: [
    { name: "How to Contribute", href: "/contribute" },
    { name: "FAQ", href: "/faq" },
    { name: "Code of Conduct", href: "/code-of-conduct" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                  <span className="text-xl font-bold text-primary-foreground">N</span>
                </div>
                <span className="font-bold">{SITE_CONFIG.shortName}</span>
              </div>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                {SITE_CONFIG.description}
              </p>
              <div className="mt-6 flex space-x-4">
                <Link
                  href={SITE_CONFIG.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href={`mailto:${SITE_CONFIG.links.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>

            {/* Pages Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Pages</h3>
              <ul className="space-y-3">
                {footerLinks.pages.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Copyright */}
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-muted-foreground md:flex-row md:space-y-0">
            <p>
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p>Made with ❤️ by the NIT Raipur Open Source Community</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
