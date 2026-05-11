import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamMember } from "@/types";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import teamData from "@/data/team.json";

export default function TeamPage() {
  const team = teamData as unknown as TeamMember[];

  // Group team members by role
  const groupedTeam = team.reduce(
    (acc, member) => {
      if (!acc[member.role]) {
        acc[member.role] = [];
      }
      acc[member.role].push(member);
      return acc;
    },
    {} as Record<string, TeamMember[]>
  );

  // Define role order for display
  const roleOrder = ["Lead", "Maintainer", "Core Contributor", "Contributor"];
  const orderedRoles = roleOrder.filter((role) => groupedTeam[role]);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Meet the amazing people behind our organization
          </p>
        </div>

        {orderedRoles.map((role) => (
          <section key={role} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{role}s</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTeam[role].map((member) => (
                <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {member.avatarUrl && (
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-full mb-4 object-cover"
                      />
                    )}

                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>

                    <Badge variant="secondary" className="mb-3">
                      {member.role}
                    </Badge>

                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    )}

                    {member.expertise && member.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {member.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                      {member.githubUrl && (
                        <Link
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                      )}

                      {member.linkedinUrl && (
                        <Link
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Link>
                      )}

                      {member.twitterUrl && (
                        <Link
                          href={member.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </Link>
                      )}

                      {member.email && (
                        <Link
                          href={`mailto:${member.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {team.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No team members listed at the moment.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
