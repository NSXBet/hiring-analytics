import { motion } from "framer-motion";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
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

  const sortedByHired = [...recruiterStats].sort((a, b) => b.hired - a.hired);
  const avgConversion =
    recruiterStats.length > 0
      ? Math.round(recruiterStats.reduce((sum, r) => sum + (r.total > 0 ? (r.hired / r.total) * 100 : 0), 0) / recruiterStats.length)
      : 0;

  const chartData = toChartPoints(
    recruiterStats.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  const timeToFillData = toChartPoints(
    recruiterStats.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Recruiters" value={recruiterStats.length} icon={Users} color="primary" delay={0} />
        <StatCard label="Top Recruiter" value={sortedByHired[0]?.name || "—"} icon={UserCheck} color="accent" delay={1} />
        <StatCard label="Conversão Média" value={`${avgConversion}%`} icon={TrendingUp} color="accent" delay={2} />
        <StatCard label="Tempo Médio Geral" value={`${getAverageTimeToFill(jobs)} dias`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Recruiter</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Contratações" orientation="horizontal" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tempo Médio por Recruiter (dias)</CardTitle>
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
