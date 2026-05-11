"use client";

import { useState, useMemo } from "react";
import { Research } from "@/types/research";
import { ResearchCard } from "./ResearchCard";
import { ResearchFilters } from "./ResearchFilters";

interface ResearchesClientProps {
  researches: Research[];
}

export function ResearchesClient({ researches }: ResearchesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Extract unique tags and years
  const { availableTags, availableYears } = useMemo(() => {
    const tagsSet = new Set<string>();
    const yearsSet = new Set<string>();

    researches.forEach((research) => {
      research.tags.forEach((tag) => tagsSet.add(tag));
      const year = new Date(research.publishedDate).getFullYear().toString();
      yearsSet.add(year);
    });

    return {
      availableTags: Array.from(tagsSet).sort(),
      availableYears: Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)),
    };
  }, [researches]);

  // Filter researches
  const filteredResearches = useMemo(() => {
    return researches.filter((research) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = research.title.toLowerCase().includes(query);
        const matchesAbstract = research.abstract.toLowerCase().includes(query);
        const matchesAuthors = research.authors.some((author) =>
          author.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesAbstract && !matchesAuthors) {
          return false;
        }
      }

      // Tag filter
      if (selectedTag !== "all" && !research.tags.includes(selectedTag)) {
        return false;
      }

      // Year filter
      if (selectedYear !== "all") {
        const researchYear = new Date(research.publishedDate).getFullYear().toString();
        if (researchYear !== selectedYear) {
          return false;
        }
      }

      return true;
    });
  }, [researches, searchQuery, selectedTag, selectedYear]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ResearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableTags={availableTags}
        availableYears={availableYears}
      />

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredResearches.length === 0 ? (
          <p>No research papers found matching your criteria.</p>
        ) : (
          <p>
            Showing {filteredResearches.length} of {researches.length} research paper
            {researches.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {/* Research grid */}
      {filteredResearches.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResearches.map((research) => (
            <ResearchCard key={research.id} research={research} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold">No research papers found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
