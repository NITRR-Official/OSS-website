import { addWeeks, format, isSameWeek, startOfWeek } from "date-fns";
import { LEADERBOARD_CONFIG } from "./config";

export function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: LEADERBOARD_CONFIG.WEEK_STARTS_ON });
}

export function isConsecutiveWeek(currentWeekStart: Date, previousWeekStart: Date) {
  const nextWeek = addWeeks(previousWeekStart, 1);
  return isSameWeek(currentWeekStart, nextWeek, {
    weekStartsOn: LEADERBOARD_CONFIG.WEEK_STARTS_ON,
  });
}

export function formatMonthKey(date: Date) {
  return format(date, LEADERBOARD_CONFIG.MONTH_KEY_FORMAT);
}
