import { useJobs } from "@/hooks/useJobs";
import { getTotalJobs } from "@/lib/metrics";

const Overview = () => {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error.message}</div>;
  if (!jobs || jobs.length === 0) return <div className="p-4">Sem dados</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Overview</h2>
      <p>Total de vagas: {getTotalJobs(jobs)}</p>
      <p>Primeira vaga: {jobs[0].role}</p>
    </div>
  );
};

export default Overview;
