import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import DataTable from "@/components/DataTable";
import { useJobs } from "@/hooks/useJobs";
import { groupBy, toChartPoints } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Diversity = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const genderStats = Object.entries(groupBy(jobs, "gender")).map(([name, list]) => ({
    name: name === "null" ? "Não informado" : name,
    total: list.length,
    hired: list.filter((j) => j.status === "Hired").length,
  }));

  const chartData = toChartPoints(
    genderStats.reduce((acc, { name, total }) => {
      acc[name] = total;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PieChart className="h-6 w-6 text-primary" />
          Diversity
        </h2>
        <p className="text-muted-foreground">Distribuição de candidatos por gênero.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribuição por Gênero</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <StatusDistributionChart data={chartData} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Detalhamento</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={genderStats}
                keyExtractor={(row) => row.name}
                columns={[
                  { key: "name", header: "Gênero" },
                  { key: "total", header: "Total" },
                  { key: "hired", header: "Contratados" },
                  {
                    key: "share",
                    header: "Representatividade",
                    render: (row) => `${jobs.length > 0 ? Math.round((row.total / jobs.length) * 100) : 0}%`,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Diversity;
