import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { Job } from "@/types";

const getJobYear = (job: Job): number | null => {
  if (job.closing_date) {
    return new Date(job.closing_date).getFullYear();
  }
  return null;
};

export const useJobs = (year?: number) =>
  useQuery({
    queryKey: ["jobs", year],
    queryFn: async () => {
      const jobs = await fetchJobs();
      if (!year) return jobs;
      return jobs.filter((job) => job.status === "Hired" && getJobYear(job) === year);
    },
  });
