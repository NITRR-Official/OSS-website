/**
 * Sort array of objects by a numeric or string property
 */
export function sortBy<T>(array: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return 0;
  });
}

/**
 * Sort contributors by points (descending)
 */
export function sortByPoints<T extends { points: number }>(array: T[]): T[] {
  return sortBy(array, "points", "desc");
}

/**
 * Sort projects by stars (descending)
 */
export function sortByStars<T extends { stars: number }>(array: T[]): T[] {
  return sortBy(array, "stars", "desc");
}
