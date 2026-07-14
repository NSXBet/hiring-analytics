import { motion } from "framer-motion";
import { PieChart, Users, UserCheck, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
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

  const totalKnown = jobs.filter((j) => j.gender && j.gender !== "Prefer not to say").length;
  const femaleCount = jobs.filter((j) => j.gender === "Female").length;
  const maleCount = jobs.filter((j) => j.gender === "Male").length;

  const chartData = toChartPoints(
    genderStats.reduce((acc, { name, total }) => {
      acc[name] = total;
      return acc;
    }, {} as Record<string, number>)
  );

  const hiredByGender = toChartPoints(
    genderStats.reduce((acc, { name, hired }) => {
      acc[name] = hired;
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
        <p className="text-muted-foreground">Distribuição de candidatos e contratados por gênero.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Representatividade Feminina"
          value={totalKnown > 0 ? `${Math.round((femaleCount / totalKnown) * 100)}%` : "—"}
          icon={Users}
          color="primary"
          delay={0}
        />
        <StatCard
          label="Representatividade Masculina"
          value={totalKnown > 0 ? `${Math.round((maleCount / totalKnown) * 100)}%` : "—"}
          icon={Users}
          color="accent"
          delay={1}
        />
        <StatCard label="Mulheres Contratadas" value={femaleCount} icon={UserCheck} color="primary" delay={2} />
        <StatCard label="Homens Contratados" value={maleCount} icon={UserCheck} color="accent" delay={3} />
      </div>

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
              <CardTitle className="text-base font-semibold">Contratados por Gênero</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={hiredByGender} label="Contratados" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
                {
                  key: "hiredRate",
                  header: "Taxa de Contratação",
                  render: (row) => `${row.total > 0 ? Math.round((row.hired / row.total) * 100) : 0}%`,
                },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Diversity;
