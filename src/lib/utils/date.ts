import { format, formatDistanceToNow, parseISO, differenceInDays } from "date-fns";

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy 'at' hh:mm a");
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj < new Date();
}

/**
 * Get days until a date
 */
export function getDaysUntil(date: Date | string): number {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
}

/**
 * Get month-year string for activity data (e.g., "Jan 2026")
 */
export function getMonthYearString(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM yyyy");
}
