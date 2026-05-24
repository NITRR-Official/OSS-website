import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, Github, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with us for any queries or collaboration opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <Link
                    href={`mailto:${SITE_CONFIG.links.email}`}
                    className="text-primary hover:underline"
                  >
                    {SITE_CONFIG.links.email}
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">GitHub</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Check out our projects and contribute
                  </p>
                  <Link
                    href={SITE_CONFIG.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {SITE_CONFIG.orgName}
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Discord Community</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Join our community for discussions and help
                  </p>
                  <Link
                    href={SITE_CONFIG.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join Discord
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    National Institute of Technology Raipur
                    <br />
                    G.E. Road, Raipur - 492010
                    <br />
                    Chhattisgarh, India
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            {/* Notice Banner */}
            <Card className="p-4 mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Contact Form Unavailable
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    The contact form is currently not operational. Please use the alternative
                    methods to reach us:
                    <strong className="block mt-2">Email or Discord</strong>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Your name" disabled />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your.email@example.com" disabled />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What is this about?" disabled />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <textarea
                    className="w-full min-h-37.5 px-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your message..."
                    disabled
                  />
                </div>

                <Button type="submit" className="w-full" disabled>
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Please use email or Discord for communication.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
