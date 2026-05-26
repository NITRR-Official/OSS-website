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
import { ReputationUser } from "@/types";
import { Trophy, Medal, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LeaderboardTableProps {
  allTime: ReputationUser[];
  monthly: ReputationUser[];
}

export function LeaderboardTable({ allTime, monthly }: LeaderboardTableProps) {
  const [period, setPeriod] = useState<"all-time" | "monthly">("all-time");
  const activeData = period === "monthly" ? monthly : allTime;

  return (
    <div className="space-y-6">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="mt-6">
          <LeaderboardContent contributors={activeData} />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <LeaderboardContent contributors={activeData} period="monthly" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaderboardContent({
  contributors,
  period,
}: {
  contributors: ReputationUser[];
  period?: string;
}) {
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
            <TableHead className="text-right">Reputation</TableHead>
            <TableHead className="text-right hidden md:table-cell">Streak</TableHead>
            <TableHead className="text-right hidden md:table-cell">Monthly</TableHead>
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
                      <Link href={`/leaderboard/${contributor.username}`} className="font-medium">
                        {contributor.username}
                      </Link>
                      {contributor.displayName && (
                        <div className="text-sm text-muted-foreground">
                          {contributor.displayName}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    {period === "monthly"
                      ? contributor.monthlyReputation
                      : contributor.totalReputation}
                  </Badge>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {contributor.currentStreak}w
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {contributor.monthlyReputation}
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://github.com/${contributor.username}`}
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
