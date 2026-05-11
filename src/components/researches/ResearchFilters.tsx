"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ResearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  availableTags: string[];
  availableYears: string[];
}

export function ResearchFilters({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  selectedYear,
  onYearChange,
  availableTags,
  availableYears,
}: ResearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      {/* Search */}
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search by title, authors, or abstract..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Topic/Tag Filter */}
      <div className="w-full sm:w-[200px]">
        <Label htmlFor="tag">Topic</Label>
        <Select value={selectedTag} onValueChange={onTagChange}>
          <SelectTrigger id="tag" className="mt-2">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {availableTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="w-full sm:w-[160px]">
        <Label htmlFor="year">Year</Label>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger id="year" className="mt-2">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
