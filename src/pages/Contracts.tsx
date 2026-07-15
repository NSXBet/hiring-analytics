import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Briefcase, Users, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_COLORS } from "@/lib/constants";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const CONTRACT_LABELS: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  "cross charged": "Cross Charged",
};

const CONTRACT_TYPES = ["CLT", "PJ", "cross charged"];

const Contracts = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);
  const [activeTab, setActiveTab] = useState("by-type");

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const offerAccepted = jobs.filter((j) => j.status === "Offer Accepted");

  const contractCounts = Object.entries(groupBy(offerAccepted, "type_of_contract")).map(([name, list]) => ({
    name: CONTRACT_LABELS[name] || name,
    raw: name,
    total: list.length,
    offerAccepted: list.filter((j) => j.status === "Offer Accepted").length,
  }));

  const chartData = toChartPoints(
    contractCounts.reduce((acc, { name, total }) => {
      acc[name] = total;
      return acc;
    }, {} as Record<string, number>)
  );

  const pieData = toChartPoints(
    contractCounts.reduce((acc, { name, offerAccepted }) => {
      acc[name] = offerAccepted;
      return acc;
    }, {} as Record<string, number>)
  );

  const directors = Array.from(new Set(offerAccepted.map((j) => j.director))).sort();

  const matrix = directors.map((director) => {
    const directorJobs = offerAccepted.filter((j) => j.director === director);
    const row: Record<string, number | string> = { director };
    CONTRACT_TYPES.forEach((type) => {
      row[type] = directorJobs.filter((j) => j.type_of_contract === type).length;
    });
    row.total = directorJobs.length;
    return row;
  });

  const directorChartData = matrix.map((row) => ({
    name: row.director as string,
    CLT: Number(row.CLT) || 0,
    PJ: Number(row.PJ) || 0,
    "Cross Charged": Number(row["cross charged"]) || 0,
  }));

  const directorColumns = [
    { key: "director", header: "Directorate" },
    ...CONTRACT_TYPES.map((type) => ({ key: type, header: CONTRACT_LABELS[type] })),
    { key: "total", header: "Total" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Contracts
        </h2>
        <p className="text-muted-foreground">Contract distribution and breakdown by directorate.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Offer Accepted" value={offerAccepted.length} icon={Users} color="primary" delay={0} />
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

      <motion.div variants={staggerItem}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="by-type">By Contract Type</TabsTrigger>
            <TabsTrigger value="by-directorate">By Directorate</TabsTrigger>
          </TabsList>

          <TabsContent value="by-type" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Offers Accepted by Contract Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart data={chartData} label="Offers Accepted" />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Contract Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <StatusDistributionChart data={pieData} />
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Detailed View by Contract Type</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={contractCounts}
                  keyExtractor={(row) => row.name}
                  columns={[
                    { key: "name", header: "Contract Type" },
                    { key: "total", header: "Total" },
                    { key: "hired", header: "Hired" },
                    {
                      key: "share",
                      header: "Share",
                      render: (row) =>
                        `${hired.length > 0 ? Math.round((row.total / hired.length) * 100) : 0}%`,
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-directorate" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Directorates" value={directors.length} icon={Building2} color="primary" delay={0} />
              <StatCard label="CLT" value={directorChartData.reduce((a, b) => a + b.CLT, 0)} icon={Briefcase} color="accent" delay={1} />
              <StatCard label="PJ" value={directorChartData.reduce((a, b) => a + b.PJ, 0)} icon={Briefcase} color="primary" delay={2} />
              <StatCard
                label="Cross Charged"
                value={directorChartData.reduce((a, b) => a + b["Cross Charged"], 0)}
                icon={Briefcase}
                color="accent"
                delay={3}
              />
            </div>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Contract Type by Directorate</CardTitle>
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
                  <BarChart data={directorChartData} margin={{ top: 8, right: 16, bottom: 56, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                      angle={directorChartData.length > 6 ? -35 : 0}
                      textAnchor={directorChartData.length > 6 ? "end" : "middle"}
                      height={directorChartData.length > 6 ? 80 : 40}
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

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Detailed View by Directorate</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={matrix}
                  keyExtractor={(row) => row.director as string}
                  columns={directorColumns.map((col) => ({
                    ...col,
                    render: col.key === "director" ? undefined : (row: Record<string, number | string>) => row[col.key],
                  }))}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Contracts;
