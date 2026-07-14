import { Job } from "@/types";

const getYear = (dateString: string | null | undefined): number | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.getFullYear();
};

/**
 * Filters jobs that belong to a given year based on the business rule:
 * - Hired jobs: year is determined exclusively by closing_date (when we closed).
 * - Non-hired jobs: year is determined by opening_date (when the req was opened).
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): Job[] => {
  if (!jobs) return [];

  return jobs.filter((job) => {
    if (job.status === "Hired") {
      return getYear(job.closing_date) === year;
    }
    return getYear(job.opening_date) === year;
  });
};
