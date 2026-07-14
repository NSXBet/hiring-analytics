import { useJobs } from "@/hooks/useJobs";
import { getTotalJobs } from "@/lib/metrics";

const Overview = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-green-100 text-green-900 text-xl font-bold rounded-lg">
      Total jobs: {getTotalJobs(jobs)}
    </div>
  );
};

export default Overview;
