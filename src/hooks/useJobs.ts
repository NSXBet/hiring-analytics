import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { filterJobsByYear } from "@/lib/yearFilter";

export const useJobs = (year?: number) =>
  useQuery({
    queryKey: ["jobs", year],
    queryFn: async () => {
      const jobs = await fetchJobs();
      if (!year) return jobs;
      return filterJobsByYear(jobs, year);
    },
  });
