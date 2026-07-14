import { Job } from "@/types";

const getYear = (dateString: string | null | undefined): number | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.getFullYear();
};

const isFutureDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Filters jobs that belong to a given year based on the business rule:
 * - Hired jobs: year is determined by closing_date (Quando Fechamos).
 * - For the current year, future closing dates are excluded.
 * - Non-hired jobs: year is determined by opening_date.
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): Job[] => {
  if (!jobs) return [];

  const currentYear = new Date().getFullYear();

  return jobs.filter((job) => {
    if (job.status === "Hired") {
      const closingYear = getYear(job.closing_date);
      if (closingYear !== year) return false;
      if (year === currentYear && isFutureDate(job.closing_date)) return false;
      return true;
    }
    return getYear(job.opening_date) === year;
  });
};
