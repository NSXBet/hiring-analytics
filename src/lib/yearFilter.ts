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
 * Filters jobs that belong to a given year.
 * - Hired jobs: year is determined by closing_date, falling back to committed_date.
 * - Non-hired jobs: year is determined by opening_date.
 * Returns jobs augmented with `referenceDate` used for monthly/directorate breakdowns.
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): YearJob[] => {
  if (!jobs) return [];

  return jobs
    .map((job) => {
      let referenceDate: string | null = null;

      if (job.status === "Hired") {
        const closingYear = getYear(job.closing_date);
        const committedYear = getYear(job.committed_date);
        if (closingYear === year) {
          referenceDate = job.closing_date ?? null;
        } else if (committedYear === year) {
          referenceDate = job.committed_date ?? null;
        }
      } else {
        const openingYear = getYear(job.opening_date);
        if (openingYear === year) {
          referenceDate = job.opening_date ?? null;
        }
      }

      return { ...job, referenceDate };
    })
    .filter((job) => job.referenceDate !== null);
};
