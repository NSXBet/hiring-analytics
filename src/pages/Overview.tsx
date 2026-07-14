import { motion } from "framer-motion";
import { LayoutDashboard, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import TimeToFillChart from "@/components/charts/TimeToFillChart";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import { useJobs } from "@/hooks/useJobs";
import {
  getTotalJobs,
  getHiredJobs,
  getOpenJobs,
  getAverageTimeToFill,
  getStatusCounts,
  getMonthlyHires,
} from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Overview = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  const statusCounts = getStatusCounts(jobs);
  const hiredCount = getHiredJobs(jobs).length;
  const openCount = getOpenJobs(jobs).length;
  const avgDays = getAverageTimeToFill(jobs);
  const monthlyHires = getMonthlyHires(jobs);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Overview
        </h2>
        <p className="text-muted-foreground">Visão geral das vagas fechadas e em andamento.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Vagas" value={getTotalJobs(jobs)} icon={Users} color="primary" delay={0} />
        <StatCard label="Contratados" value={hiredCount} icon={CheckCircle2} color="accent" delay={1} />
        <StatCard label="Vagas Abertas" value={openCount} icon={AlertCircle} color="warning" delay={2} />
        <StatCard label="Tempo Médio de Preenchimento" value={`${avgDays} dias`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeToFillChart data={monthlyHires} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <StatusDistributionChart data={statusCounts} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
