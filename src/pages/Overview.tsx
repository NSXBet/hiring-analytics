import { useJobs } from "@/hooks/useJobs";

const Overview = () => {
  const { data: jobs, isLoading, error } = useJobs();

  console.log("Overview render", { isLoading, error, count: jobs?.length });

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Erro: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Overview</h2>
      <p>Total de vagas: {jobs?.length || 0}</p>
      <ul className="space-y-1">
        {jobs?.slice(0, 5).map((job) => (
          <li key={job.id} className="text-sm">{job.role} - {job.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Overview;
