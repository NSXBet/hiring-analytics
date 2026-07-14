import { motion } from "framer-motion";
import { UserCog, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
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

  const sortedByHired = [...managerStats].sort((a, b) => b.hired - a.hired);
  const avgConversion =
    managerStats.length > 0
      ? Math.round(managerStats.reduce((sum, r) => sum + (r.total > 0 ? (r.hired / r.total) * 100 : 0), 0) / managerStats.length)
      : 0;

  const topManagers = [...managerStats].sort((a, b) => b.hired - a.hired).slice(0, 15);

  const chartData = toChartPoints(
    topManagers.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  const timeToFillData = toChartPoints(
    topManagers.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Gestores" value={managerStats.length} icon={Users} color="primary" delay={0} />
        <StatCard label="Top Gestor" value={sortedByHired[0]?.name || "—"} icon={UserCog} color="accent" delay={1} />
        <StatCard label="Conversão Média" value={`${avgConversion}%`} icon={TrendingUp} color="accent" delay={2} />
        <StatCard label="Tempo Médio Geral" value={`${getAverageTimeToFill(jobs)} dias`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top 15 Hiring Managers - Contratações</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Contratações" orientation="horizontal" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top 15 Hiring Managers - Tempo Médio (dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Dias" orientation="horizontal" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
