import { motion } from "framer-motion";
import { BarChart3, Building2, Trophy, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import { DIRECTOR_COLORS } from "@/lib/constants";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints, getAverageTimeToFill, getSLAAdherence } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Performance = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const directorOfferAccepted = Object.entries(groupBy(jobs, "director")).map(([name, list]) => ({
    name,
    offerAccepted: list.filter((j) => j.status === "Offer Accepted").length,
    total: list.length,
    avgDays: getAverageTimeToFill(list),
  }));

  const sortedByOfferAccepted = [...directorOfferAccepted].sort((a, b) => b.offerAccepted - a.offerAccepted);
  const sortedByTime = [...directorOfferAccepted].filter((d) => d.avgDays > 0).sort((a, b) => a.avgDays - b.avgDays);

  const timeToFillData = toChartPoints(
    directorOfferAccepted.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
      return acc;
    }, {} as Record<string, number>)
  );

  const chartData = toChartPoints(
    directorOfferAccepted.reduce((acc, { name, offerAccepted }) => {
      acc[name] = offerAccepted;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Performance by Directorate
        </h2>
        <p className="text-muted-foreground">Offers Accepted and average time to fill by area.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Directorates" value={directorOfferAccepted.length} icon={Building2} color="primary" delay={0} />
        <StatCard label="Top Directorate" value={sortedByOfferAccepted[0]?.name || "—"} icon={Trophy} color="accent" delay={1} />
        <StatCard
          label="Lowest Average Time"
          value={sortedByTime[0] ? `${sortedByTime[0].avgDays} days` : "—"}
          icon={Clock}
          color="primary"
          delay={2}
        />
        <StatCard label="SLA Adherence" value={`${getSLAAdherence(jobs)}%`} icon={Target} color="accent" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Offers Accepted by Directorate</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Offers Accepted" colorMap={DIRECTOR_COLORS} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Average Time to Fill (days)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Days" colorMap={DIRECTOR_COLORS} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Detailed View by Directorate</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={directorOfferAccepted}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Directorate" },
                { key: "total", header: "Total Jobs" },
                { key: "offerAccepted", header: "Offer Accepted" },
                {
                  key: "conversion",
                  header: "Conversion",
                  render: (row) => `${row.total > 0 ? Math.round((row.offerAccepted / row.total) * 100) : 0}%`,
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

export default Performance;
