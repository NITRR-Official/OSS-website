import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Target, Eye, Heart, Users, Code2, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Learn more about NIT Raipur Open Source Organization
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To create a sustainable open-source ecosystem at NIT Raipur by building multi-year
                technical projects that outlive individual batches. We aim to foster a real
                open-source culture where students learn, contribute, and grow together.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To establish NIT Raipur as a hub for open-source innovation, producing impactful
                projects that solve real-world problems and creating a community of skilled
                developers who contribute to the global open-source ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of working together, sharing knowledge, and supporting
                  each other&apos;s growth.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive for high-quality code, comprehensive documentation, and maintainable
                  projects.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Inclusivity</h3>
                <p className="text-sm text-muted-foreground">
                  We welcome contributors of all skill levels and backgrounds, fostering a
                  supportive learning environment.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <Card className="p-8">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                NIT Raipur Open Source Organization was founded with a simple yet powerful idea: to
                create technical projects that last beyond the tenure of their creators. We noticed
                that many student projects, despite being innovative and well-built, were abandoned
                after their creators graduated.
              </p>
              <p className="mb-4">
                Our organization aims to change this narrative by fostering a culture of continuous
                contribution and maintenance. We focus on building projects that solve real problems
                for the NIT Raipur community and beyond, while providing students with hands-on
                experience in open-source development, collaboration, and project maintenance.
              </p>
              <p>
                Today, we&apos;re proud to have built a thriving community of contributors,
                maintainers, and open-source enthusiasts who are making a real impact through their
                code and collaboration.
              </p>
            </div>
          </Card>
        </section>

        {/* Join CTA */}
        <section>
          <Card className="p-8 bg-muted/50">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you&apos;re a seasoned developer or just starting out, there&apos;s a place
                for you in our community. Start contributing today and be part of something
                meaningful.
              </p>
            </div>
          </Card>
        </section>
      </Container>
    </div>
  );
}
