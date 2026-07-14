import { motion } from "framer-motion";
import { BarChart3, Building2, Trophy, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import { DIRECTOR_COLORS } from "@/lib/constants";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { groupBy, toChartPoints, getAverageTimeToFill, getSLAAdherence } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Performance = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const directorHired = Object.entries(groupBy(jobs, "director")).map(([name, list]) => ({
    name,
    hired: list.filter((j) => j.status === "Hired").length,
    total: list.length,
    avgDays: getAverageTimeToFill(list),
  }));

  const sortedByHired = [...directorHired].sort((a, b) => b.hired - a.hired);
  const sortedByTime = [...directorHired].filter((d) => d.avgDays > 0).sort((a, b) => a.avgDays - b.avgDays);

  const timeToFillData = toChartPoints(
    directorHired.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
      return acc;
    }, {} as Record<string, number>)
  );

  const chartData = toChartPoints(
    directorHired.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Performance por Diretoria
        </h2>
        <p className="text-muted-foreground">Contratações e tempo médio de preenchimento por área.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Diretorias" value={directorHired.length} icon={Building2} color="primary" delay={0} />
        <StatCard label="Top Diretoria" value={sortedByHired[0]?.name || "—"} icon={Trophy} color="accent" delay={1} />
        <StatCard
          label="Menor Tempo Médio"
          value={sortedByTime[0] ? `${sortedByTime[0].avgDays} dias` : "—"}
          icon={Clock}
          color="primary"
          delay={2}
        />
        <StatCard label="Aderência ao Prazo" value={`${getSLAAdherence(jobs)}%`} icon={Target} color="accent" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Diretoria</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Contratações" colorMap={DIRECTOR_COLORS} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tempo Médio de Preenchimento (dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Dias" colorMap={DIRECTOR_COLORS} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detalhamento por Diretoria</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={directorHired}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Diretoria" },
                { key: "total", header: "Total de Vagas" },
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

export default Performance;
