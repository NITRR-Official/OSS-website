"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Contributor } from "@/types";
import { Trophy, Medal, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LeaderboardTableProps {
  contributors: Contributor[];
}

export function LeaderboardTable({ contributors }: LeaderboardTableProps) {
  const [period, setPeriod] = useState<"all-time" | "monthly">("all-time");

  return (
    <div className="space-y-6">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="mt-6">
          <LeaderboardContent contributors={contributors} />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <LeaderboardContent contributors={contributors} period="monthly" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaderboardContent({ contributors }: { contributors: Contributor[]; period?: string }) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Contributor</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">PRs</TableHead>
            <TableHead className="text-right hidden md:table-cell">Projects</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributors.map((contributor, index) => {
            const rank = index + 1;
            return (
              <TableRow key={contributor.id}>
                <TableCell className="font-medium">{getRankIcon(rank)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {contributor.avatarUrl && (
                      <Image
                        src={contributor.avatarUrl}
                        alt={contributor.username}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{contributor.username}</div>
                      {contributor.name && (
                        <div className="text-sm text-muted-foreground">{contributor.name}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    {contributor.totalPoints}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{contributor.totalPRs}</TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {contributor.projectsContributedTo.length}
                </TableCell>
                <TableCell>
                  <Link
                    href={contributor.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
