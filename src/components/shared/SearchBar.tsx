"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SearchBarProps {
  type: "blog" | "resource";
}

interface SearchResult {
  slug: string;
  title: string;
  type: string;
  score: number;
}

export function SearchBar({ type }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 relative">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="search"
          placeholder={`Semantic Search ${type}s...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl bg-card border-2 transition-colors focus-visible:ring-primary"
        />
      </form>

      {hasSearched && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-2xl shadow-xl z-50 overflow-hidden">
          {isSearching ? (
            <div className="p-6 text-center text-muted-foreground animate-pulse">
              Searching the vector database...
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y">
              {results.map((r, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${r.type === "blog" ? "blog" : "resources"}/${r.slug}`}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Relevance Score: {(r.score * 100).toFixed(1)}%
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No matches found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
