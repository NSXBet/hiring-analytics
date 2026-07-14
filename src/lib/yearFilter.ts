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
 * Filters Hired jobs that belong to a given year.
 * - 2025: uses committed_date
 * - 2026+: uses closing_date when available in that year, otherwise committed_date
 * Returns jobs augmented with `referenceDate` used for monthly/directorate breakdowns.
 */
export const filterJobsByYear = (jobs: Job[] | undefined, year: number): YearJob[] => {
  if (!jobs) return [];

  return jobs
    .filter((job) => job.status === "Hired")
    .map((job) => {
      const closingYear = getYear(job.closing_date);
      const committedYear = getYear(job.committed_date);

      let referenceDate: string | null = null;

      if (year === 2025) {
        if (committedYear === year) {
          referenceDate = job.committed_date ?? null;
        }
      } else {
        // 2026+
        if (closingYear === year) {
          referenceDate = job.closing_date ?? null;
        } else if (committedYear === year) {
          referenceDate = job.committed_date ?? null;
        }
      }

      return { ...job, referenceDate };
    })
    .filter((job) => job.referenceDate !== null);
};
