import { motion } from "framer-motion";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { groupBy, toChartPoints, getAverageTimeToFill } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Recruiters = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const recruiterStats = Object.entries(groupBy(jobs, "recruiter")).map(([name, list]) => ({
    name,
    total: list.length,
    offerAccepted: list.filter((j) => j.status === "Offer Accepted").length,
    avgDays: getAverageTimeToFill(list),
  }));

  const sortedByOfferAccepted = [...recruiterStats].sort((a, b) => b.offerAccepted - a.offerAccepted);
  const avgConversion =
    recruiterStats.length > 0
      ? Math.round(recruiterStats.reduce((sum, r) => sum + (r.total > 0 ? (r.offerAccepted / r.total) * 100 : 0), 0) / recruiterStats.length)
      : 0;

  const chartData = toChartPoints(
    recruiterStats.reduce((acc, { name, offerAccepted }) => {
      acc[name] = offerAccepted;
      return acc;
    }, {} as Record<string, number>)
  );

  const timeToFillData = toChartPoints(
    recruiterStats.reduce((acc, { name, avgDays }) => {
      acc[name] = avgDays;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Recruiters
        </h2>
        <p className="text-muted-foreground">Recruiter performance by volume and conversion.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Recruiters" value={recruiterStats.length} icon={Users} color="primary" delay={0} />
        <StatCard label="Top Recruiter" value={sortedByOfferAccepted[0]?.name || "—"} icon={UserCheck} color="accent" delay={1} />
        <StatCard label="Average Conversion" value={`${avgConversion}%`} icon={TrendingUp} color="accent" delay={2} />
        <StatCard label="Overall Average Time" value={`${getAverageTimeToFill(jobs)} days`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Offers Accepted by Recruiter</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} label="Offers Accepted" orientation="horizontal" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Average Time by Recruiter (days)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={timeToFillData} label="Days" orientation="horizontal" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recruiter Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recruiterStats}
              keyExtractor={(row) => row.name}
              columns={[
                { key: "name", header: "Recruiter" },
                { key: "total", header: "Jobs" },
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

export default Recruiters;
