import { motion } from "framer-motion";
import { UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DirectorPerformanceChart from "@/components/charts/DirectorPerformanceChart";
import DataTable from "@/components/DataTable";
import { useJobs } from "@/hooks/useJobs";
import { groupBy, toChartPoints, getAverageTimeToFill } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const HiringManagers = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const managerStats = Object.entries(groupBy(jobs, "hiring_manager")).map(([name, list]) => ({
    name,
    total: list.length,
    hired: list.filter((j) => j.status === "Hired").length,
    avgDays: getAverageTimeToFill(list),
  }));

  const chartData = toChartPoints(
    managerStats.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCog className="h-6 w-6 text-primary" />
          Hiring Managers
        </h2>
        <p className="text-muted-foreground">Análise de contratações por gestor responsável.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Contratações por Hiring Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectorPerformanceChart data={chartData} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detalhamento por Hiring Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={managerStats}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Hiring Manager" },
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

export default HiringManagers;
