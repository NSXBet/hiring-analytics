import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";

export const useJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
