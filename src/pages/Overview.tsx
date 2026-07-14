import { motion } from "framer-motion";
import { useJobs } from "@/hooks/useJobs";
import { getTotalJobs } from "@/lib/metrics";

const Overview = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <div className="bg-blue-100 p-4 rounded">Total jobs: {getTotalJobs(jobs)}</div>
    </motion.div>
  );
};

export default Overview;
