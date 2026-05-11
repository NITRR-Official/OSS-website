import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Mail, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Code of Conduct - NITRR OSS",
  description: "Community guidelines and code of conduct for NITRR Open Source Society",
};

export default function CodeOfConductPage() {
  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Code of Conduct</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our commitment to fostering an open, welcoming, and inclusive community.
        </p>
      </div>

      {/* Our Pledge */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Pledge</h2>
        <p className="text-muted-foreground mb-4">
          In the interest of fostering an open and welcoming environment, we as contributors and
          maintainers pledge to make participation in our project and our community a
          harassment-free experience for everyone, regardless of age, body size, disability,
          ethnicity, sex characteristics, gender identity and expression, level of experience,
          education, socio-economic status, nationality, personal appearance, race, religion, or
          sexual identity and orientation.
        </p>
      </Card>

      {/* Our Standards */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Standards</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
              Examples of behavior that contributes to a positive environment:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Using welcoming and inclusive language</li>
              <li>Being respectful of differing viewpoints and experiences</li>
              <li>Gracefully accepting constructive criticism</li>
              <li>Focusing on what is best for the community</li>
              <li>Showing empathy towards other community members</li>
              <li>Helping newcomers and answering questions patiently</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
              Examples of unacceptable behavior:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                The use of sexualized language or imagery and unwelcome sexual attention or advances
              </li>
              <li>Trolling, insulting/derogatory comments, and personal or political attacks</li>
              <li>Public or private harassment</li>
              <li>Publishing other&apos;s private information without explicit permission</li>
              <li>
                Other conduct which could reasonably be considered inappropriate in a professional
                setting
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Our Responsibilities */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Responsibilities</h2>
        <p className="text-muted-foreground mb-4">
          Project maintainers are responsible for clarifying the standards of acceptable behavior
          and are expected to take appropriate and fair corrective action in response to any
          instances of unacceptable behavior.
        </p>
        <p className="text-muted-foreground">
          Project maintainers have the right and responsibility to remove, edit, or reject comments,
          commits, code, wiki edits, issues, and other contributions that are not aligned with this
          Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors
          that they deem inappropriate, threatening, offensive, or harmful.
        </p>
      </Card>

      {/* Scope */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Scope</h2>
        <p className="text-muted-foreground">
          This Code of Conduct applies within all project spaces, including GitHub repositories,
          Discord server, events, and any other community spaces. It also applies when an individual
          is representing the project or its community in public spaces.
        </p>
      </Card>

      {/* Enforcement */}
      <Card className="p-6 mb-6 border-orange-200 dark:border-orange-900">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Enforcement</h2>
            <p className="text-muted-foreground mb-4">
              Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by
              contacting the project team. All complaints will be reviewed and investigated promptly
              and fairly.
            </p>
            <p className="text-muted-foreground mb-4">
              All project team members are obligated to respect the privacy and security of the
              reporter of any incident.
            </p>
          </div>
        </div>
      </Card>

      {/* Reporting */}
      <Card className="p-6 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">How to Report Violations</h2>
        <p className="text-muted-foreground mb-6">
          If you experience or witness unacceptable behavior, or have any other concerns, please
          report it by contacting us through one of the following channels:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <a
                href="mailto:opensource@nitrr.ac.in"
                className="text-sm text-primary hover:underline"
              >
                opensource@nitrr.ac.in
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Discord</p>
              <a
                href="https://discord.gg/your-invite-link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Contact moderators
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Attribution */}
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>
          This Code of Conduct is adapted from the{" "}
          <a
            href="https://www.contributor-covenant.org/version/2/0/code_of_conduct.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Contributor Covenant, version 2.0
          </a>
        </p>
      </div>
    </Container>
  );
}
