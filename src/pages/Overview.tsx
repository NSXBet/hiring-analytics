import { Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { getTotalJobs } from "@/lib/metrics";

const Overview = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-blue-100 p-4 rounded">Total jobs: {getTotalJobs(jobs)}</div>
      <StatCard label="Total de Vagas" value={getTotalJobs(jobs)} icon={Users} color="primary" delay={0} />
    </div>
  );
};

export default Overview;
