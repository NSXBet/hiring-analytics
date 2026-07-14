import { motion } from "framer-motion";
import { Layers, BarChart3, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { DIRECTOR_COLORS, CHART_COLORS } from "@/lib/constants";

const Levels = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const hired = jobs.filter((j) => j.status === "Hired");

  const levelCounts = Object.entries(groupBy(hired, "level")).map(([name, list]) => ({
    name: name === "null" ? "N/A" : name,
    value: list.length,
  }));

  const levelChartData = toChartPoints(
    levelCounts.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {} as Record<string, number>)
  );

  const directors = Array.from(new Set(hired.map((j) => j.director))).sort();
  const levels = Array.from(new Set(hired.map((j) => j.level || "N/A"))).sort();

  const matrix = directors.map((director) => {
    const row: Record<string, number | string> = { director };
    const directorJobs = hired.filter((j) => j.director === director);
    levels.forEach((level) => {
      row[level] = directorJobs.filter((j) => (j.level || "N/A") === level).length;
    });
    row.total = directorJobs.length;
    return row;
  });

  const columns = [
    { key: "director", header: "Diretoria" },
    ...levels.map((level) => ({ key: level, header: level })),
    { key: "total", header: "Total" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          Levels
        </h2>
        <p className="text-muted-foreground">Distribuição de contratações por nível e diretoria.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Níveis Distintos" value={levels.length} icon={Layers} color="primary" delay={0} />
        <StatCard label="Total Contratados" value={hired.length} icon={BarChart3} color="accent" delay={1} />
        <StatCard label="Diretorias" value={directors.length} icon={Building2} color="primary" delay={2} />
        <StatCard
          label="Nível Mais Comum"
          value={levelChartData[0]?.name || "—"}
          icon={Layers}
          color="accent"
          delay={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Level</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={levelChartData} label="Contratações" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top Combinations</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={matrix
                  .flatMap((row) =>
                    levels.map((level) => ({
                      name: `${row.director} - ${level}`,
                      value: Number(row[level]) || 0,
                    }))
                  )
                  .filter((d) => d.value > 0)
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 10)}
                label="Contratações"
                orientation="horizontal"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Level por Diretoria</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={matrix}
              keyExtractor={(row) => row.director as string}
              columns={columns.map((col) => ({
                ...col,
                render: col.key === "director" ? undefined : (row: Record<string, number | string>) => row[col.key],
              }))}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Levels;
