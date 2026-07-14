import { Job } from "@/types";

const getYear = (dateString: string | null | undefined): number | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.getFullYear();
};

/**
 * Returns the effective closing date for a hired job based on the selected year.
 * - For 2025: mirror committed_date as closing_date (fallback to closing_date).
 * - For other years: use closing_date as-is.
 */
export const getEffectiveClosingDate = (job: Job, year: number): string | null => {
  if (job.status !== "Hired") return null;
  if (year === 2025) {
    return job.committed_date || job.closing_date;
  }
  return job.closing_date;
};

/**
 * Filters jobs that belong to a given year based on the business rule:
 * - Hired jobs: year is determined by effective closing_date.
 * - Non-hired jobs: year is determined by opening_date.
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): Job[] => {
  if (!jobs) return [];

  return jobs.filter((job) => {
    if (job.status === "Hired") {
      return getYear(getEffectiveClosingDate(job, year)) === year;
    }
    return getYear(job.opening_date) === year;
  });
};
