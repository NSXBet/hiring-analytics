import * as framer from "framer-motion";
import { useJobs } from "@/hooks/useJobs";
import { getTotalJobs } from "@/lib/metrics";

const Overview = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <div>Loading...</div>;
  }

  console.log("framer-motion module:", framer);

  return (
    <div className="p-4">
      <div className="bg-blue-100 p-4 rounded">Total jobs: {getTotalJobs(jobs)}</div>
    </div>
  );
};

export default Overview;
