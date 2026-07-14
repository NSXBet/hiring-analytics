import { motion } from "framer-motion";
import { Globe, MapPin, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { groupBy, toChartPoints, getAverageTimeToFill } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Geography = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const countryStats = Object.entries(groupBy(jobs, "country")).map(([name, list]) => ({
    name,
    total: list.length,
    hired: list.filter((j) => j.status === "Hired").length,
    avgDays: getAverageTimeToFill(list),
  }));

  const sortedByHired = [...countryStats].sort((a, b) => b.hired - a.hired);
  const avgConversion =
    countryStats.length > 0
      ? Math.round(countryStats.reduce((sum, c) => sum + (c.total > 0 ? (c.hired / c.total) * 100 : 0), 0) / countryStats.length)
      : 0;

  const chartData = toChartPoints(
    countryStats.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  const timeToFillData = toChartPoints(
    countryStats.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Geography
        </h2>
        <p className="text-muted-foreground">Distribuição de contratações por país.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Países" value={countryStats.length} icon={MapPin} color="primary" delay={0} />
        <StatCard label="Top País" value={sortedByHired[0]?.name || "—"} icon={Globe} color="accent" delay={1} />
        <StatCard label="Conversão Média" value={`${avgConversion}%`} icon={TrendingUp} color="accent" delay={2} />
        <StatCard label="Tempo Médio Geral" value={`${getAverageTimeToFill(jobs)} dias`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por País</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Contratações" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tempo Médio por País (dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Dias" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detalhamento por País</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={countryStats}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "País" },
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

export default Geography;
