import { Job } from "@/types";

export interface YearJob extends Job {
  referenceDate: string | null;
}

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
 * Returns jobs augmented with `referenceDate` used for monthly/directorate breakdowns.
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): YearJob[] => {
  if (!jobs) return [];

  return jobs
    .map((job) => {
      let referenceDate: string | null = null;

      if (job.status === "Hired") {
        if (getYear(job.closing_date) === year) {
          referenceDate = job.closing_date ?? null;
        }
      } else {
        if (getYear(job.opening_date) === year) {
          referenceDate = job.opening_date ?? null;
        }
      }

      return { ...job, referenceDate };
    })
    .filter((job) => job.referenceDate !== null);
};
