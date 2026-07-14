import { motion } from "framer-motion";
import { Globe, MapPin, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints, getAverageTimeToFill } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Geography = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

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
        <p className="text-muted-foreground">Hires distribution by country.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Countries" value={countryStats.length} icon={MapPin} color="primary" delay={0} />
        <StatCard label="Top Country" value={sortedByHired[0]?.name || "—"} icon={Globe} color="accent" delay={1} />
        <StatCard label="Average Conversion" value={`${avgConversion}%`} icon={TrendingUp} color="accent" delay={2} />
        <StatCard label="Overall Average Time" value={`${getAverageTimeToFill(jobs)} days`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Hires by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Hires" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Average Time by Country (days)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Days" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detailed View by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={countryStats}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Country" },
                { key: "total", header: "Total Jobs" },
                { key: "hired", header: "Hired" },
                {
                  key: "conversion",
                  header: "Conversion",
                  render: (row) => `${row.total > 0 ? Math.round((row.hired / row.total) * 100) : 0}%`,
                },
                { key: "avgDays", header: "Average Time (days)" },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Geography;
