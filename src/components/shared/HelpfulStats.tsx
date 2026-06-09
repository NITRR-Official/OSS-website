"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface HelpfulStatsProps {
  slug: string;
}

export function HelpfulStats({ slug }: HelpfulStatsProps) {
  const [stats, setStats] = useState({ helpfulCount: 0, notHelpfulCount: 0 });
  const [voted, setVoted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stats?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats({ helpfulCount: data.helpfulCount, notHelpfulCount: data.notHelpfulCount });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

  const handleVote = async (isHelpful: boolean) => {
    if (voted !== null) return;
    setVoted(isHelpful);

    // Optimistic update
    setStats((prev) => ({
      helpfulCount: prev.helpfulCount + (isHelpful ? 1 : 0),
      notHelpfulCount: prev.notHelpfulCount + (isHelpful ? 0 : 1),
    }));

    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, isHelpful }),
    });
  };

  if (isLoading)
    return <div className="animate-pulse h-12 w-full max-w-lg bg-muted rounded-xl"></div>;

  const totalVotes = stats.helpfulCount + stats.notHelpfulCount;
  const percentage = totalVotes > 0 ? Math.round((stats.helpfulCount / totalVotes) * 100) : 0;

  return (
    <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 border rounded-2xl bg-card">
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-xl mb-2">Was this helpful?</h3>
        {totalVotes > 0 ? (
          <p className="text-sm text-muted-foreground">
            {percentage}% of people found this helpful ({totalVotes} votes)
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Be the first to vote!</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant={voted === true ? "default" : "outline"}
          onClick={() => handleVote(true)}
          disabled={voted !== null}
          size="lg"
        >
          <ThumbsUp className="w-5 h-5 mr-2" />
          Yes
        </Button>
        <Button
          variant={voted === false ? "destructive" : "outline"}
          onClick={() => handleVote(false)}
          disabled={voted !== null}
          size="lg"
        >
          <ThumbsDown className="w-5 h-5 mr-2" />
          No
        </Button>
      </div>
    </div>
  );
}
