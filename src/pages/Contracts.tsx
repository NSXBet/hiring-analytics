import { motion } from "framer-motion";
import { FileText, Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const CONTRACT_LABELS: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  "cross charged": "Cross Charged",
};

const Contracts = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const hired = jobs.filter((j) => j.status === "Hired");

  const contractCounts = Object.entries(groupBy(hired, "type_of_contract")).map(([name, list]) => ({
    name: CONTRACT_LABELS[name] || name,
    raw: name,
    total: list.length,
    hired: list.filter((j) => j.status === "Hired").length,
  }));

  const chartData = toChartPoints(
    contractCounts.reduce((acc, { name, total }) => {
      acc[name] = total;
      return acc;
    }, {} as Record<string, number>)
  );

  const pieData = toChartPoints(
    contractCounts.reduce((acc, { name, hired }) => {
      acc[name] = hired;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Contracts
        </h2>
        <p className="text-muted-foreground">Distribuição de contratações por tipo de contrato.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Contratados" value={hired.length} icon={Users} color="primary" delay={0} />
        <StatCard
          label="CLT"
          value={contractCounts.find((c) => c.raw === "CLT")?.total || 0}
          icon={Briefcase}
          color="accent"
          delay={1}
        />
        <StatCard
          label="PJ"
          value={contractCounts.find((c) => c.raw === "PJ")?.total || 0}
          icon={Briefcase}
          color="primary"
          delay={2}
        />
        <StatCard
          label="Cross Charged"
          value={contractCounts.find((c) => c.raw === "cross charged")?.total || 0}
          icon={Briefcase}
          color="accent"
          delay={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Tipo de Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Contratações" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribuição de Contratos</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <StatusDistributionChart data={pieData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detalhamento por Tipo de Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={contractCounts}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Tipo de Contrato" },
                { key: "total", header: "Total" },
                { key: "hired", header: "Contratados" },
                {
                  key: "share",
                  header: "Representatividade",
                  render: (row) =>
                    `${hired.length > 0 ? Math.round((row.total / hired.length) * 100) : 0}%`,
                },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Contracts;
