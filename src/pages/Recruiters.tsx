import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DirectorPerformanceChart from "@/components/charts/DirectorPerformanceChart";
import DataTable from "@/components/DataTable";
import { useJobs } from "@/hooks/useJobs";
import { groupBy, toChartPoints, getAverageTimeToFill } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Recruiters = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const recruiterStats = Object.entries(groupBy(jobs, "recruiter")).map(([name, list]) => ({
    name,
    total: list.length,
    hired: list.filter((j) => j.status === "Hired").length,
    avgDays: getAverageTimeToFill(list),
  }));

  const chartData = toChartPoints(
    recruiterStats.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Recruiters
        </h2>
        <p className="text-muted-foreground">Desempenho dos recrutadores por volume e conversão.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Contratações por Recruiter</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectorPerformanceChart data={chartData} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Ranking de Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recruiterStats}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Recruiter" },
                { key: "total", header: "Vagas" },
                { key: "hired", header: "Contratados" },
                {
                  key: "conversion",
                  header: "Conversão",
                  render: (row) => `${row.total > 0 ? Math.round((row.hired / row.total) * 100) : 0}%`,
                },
                { key: "avgDays", header: "Tempo Médio (dias)" },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Recruiters;
