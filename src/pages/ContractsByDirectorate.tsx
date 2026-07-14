import { motion } from "framer-motion";
import { FileStack, Building2, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_COLORS } from "@/lib/constants";

const CONTRACT_TYPES = ["CLT", "PJ", "cross charged"];
const CONTRACT_LABELS: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  "cross charged": "Cross Charged",
};

const ContractsByDirectorate = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const hired = jobs.filter((j) => j.status === "Hired");

  const directors = Array.from(new Set(hired.map((j) => j.director))).sort();

  const matrix = directors.map((director) => {
    const directorJobs = hired.filter((j) => j.director === director);
    const row: Record<string, number | string> = { director };
    CONTRACT_TYPES.forEach((type) => {
      row[type] = directorJobs.filter((j) => j.type_of_contract === type).length;
    });
    row.total = directorJobs.length;
    return row;
  });

  const chartData = matrix.map((row) => ({
    name: row.director as string,
    CLT: Number(row.CLT) || 0,
    PJ: Number(row.PJ) || 0,
    "Cross Charged": Number(row["cross charged"]) || 0,
  }));

  const columns = [
    { key: "director", header: "Diretoria" },
    ...CONTRACT_TYPES.map((type) => ({ key: type, header: CONTRACT_LABELS[type] })),
    { key: "total", header: "Total" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileStack className="h-6 w-6 text-primary" />
          Contracts by Directorate
        </h2>
        <p className="text-muted-foreground">Distribuição de tipos de contrato por diretoria.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Diretorias" value={directors.length} icon={Building2} color="primary" delay={0} />
        <StatCard label="CLT" value={chartData.reduce((a, b) => a + b.CLT, 0)} icon={Briefcase} color="accent" delay={1} />
        <StatCard label="PJ" value={chartData.reduce((a, b) => a + b.PJ, 0)} icon={Briefcase} color="primary" delay={2} />
        <StatCard
          label="Cross Charged"
          value={chartData.reduce((a, b) => a + b["Cross Charged"], 0)}
          icon={Briefcase}
          color="accent"
          delay={3}
        />
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tipo de Contrato por Diretoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                CLT: { label: "CLT", color: CHART_COLORS[0] },
                PJ: { label: "PJ", color: CHART_COLORS[1] },
                "Cross Charged": { label: "Cross Charged", color: CHART_COLORS[2] },
              }}
              className="aspect-[16/10] w-full min-h-[400px]"
            >
              <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 56, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  angle={chartData.length > 6 ? -35 : 0}
                  textAnchor={chartData.length > 6 ? "end" : "middle"}
                  height={chartData.length > 6 ? 80 : 40}
                />
                <YAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="CLT" stackId="a" fill={CHART_COLORS[0]} radius={[0, 0, 0, 0]} />
                <Bar dataKey="PJ" stackId="a" fill={CHART_COLORS[1]} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Cross Charged" stackId="a" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detalhamento por Diretoria</CardTitle>
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

export default ContractsByDirectorate;
