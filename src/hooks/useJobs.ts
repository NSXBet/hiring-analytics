import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { Job } from "@/types";

const getYearFromDate = (dateString: string | null | undefined): number | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.getFullYear();
};

export const useJobs = (year?: number) =>
  useQuery({
    queryKey: ["jobs", year],
    queryFn: async () => {
      const jobs = await fetchJobs();
      if (!year) return jobs;

      // 2025 uses committed_date; 2026+ uses closing_date
      const dateField = year === 2025 ? "committed_date" : "closing_date";

      return jobs.filter(
        (job: Job) =>
          job.status === "Hired" &&
          getYearFromDate(job[dateField as keyof Job] as string | null | undefined) === year
      );
    },
  });
