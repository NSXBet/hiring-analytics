import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { formatDate } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";

const SECONDARY_STATUSES = ["Canceled", "Turnover", "Withdrawn", "TBD"] as const;

const SecondaryStatus = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const secondaryJobs = jobs.filter((j) => SECONDARY_STATUSES.includes(j.status as (typeof SECONDARY_STATUSES)[number]));

  const statusCounts = SECONDARY_STATUSES.reduce((acc, status) => {
    acc[status] = jobs.filter((j) => j.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-primary" />
          Secondary Status
        </h2>
        <p className="text-muted-foreground">Secondary status analysis and withdrawals.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-4">
        {SECONDARY_STATUSES.map((status) => (
          <Card key={status} className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{status}</p>
              <p className="mt-2 text-3xl font-bold">{statusCounts[status]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Secondary Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData} label="Quantity" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Requisitions with Secondary Status ({secondaryJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={secondaryJobs}
              keyExtractor={(row) => row.id}
              columns={[
                { key: "cod", header: "COD" },
                { key: "role", header: "Role" },
                { key: "status", header: "Status", render: (row: Job) => <StatusBadge status={row.status} /> },
                { key: "recruiter", header: "Recruiter" },
                { key: "hiring_manager", header: "Hiring Manager" },
                { key: "director", header: "Directorate" },
                { key: "country", header: "Country" },
                { key: "opening_date", header: "Opening", render: (row: Job) => formatDate(row.opening_date) },
                { key: "closing_date", header: "Closing", render: (row: Job) => formatDate(row.closing_date) },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SecondaryStatus;
