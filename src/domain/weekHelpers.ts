/**
 * Week helper functions for calculating week start dates and days ahead/behind
 */

/**
 * Get the start of the week (Sunday) for a given date
 */
export function getWeekStartDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Subtract days to get to Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the ISO date string for the start of the week
 */
export function getWeekStartDateString(date: Date = new Date()): string {
  return getWeekStartDate(date).toISOString().split("T")[0]!;
}

/**
 * Get the next week's start date
 */
export function getNextWeekStartDate(currentWeekStart: string): string {
  const date = new Date(currentWeekStart);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0]!;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

