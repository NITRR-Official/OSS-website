"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onTagChange: (tag: string) => void;
  onStackChange: (stack: string) => void;
  availableTags: string[];
  availableStacks: string[];
}

export function ProjectFilters({
  onSearchChange,
  onStatusChange,
  onTagChange,
  onStackChange,
  availableTags,
  availableStacks,
}: ProjectFiltersProps) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Dormant">Dormant</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onTagChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onStackChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by stack" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stacks</SelectItem>
            {availableStacks.map((stack) => (
              <SelectItem key={stack} value={stack}>
                {stack}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
