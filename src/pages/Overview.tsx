import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import HiringTrendChart from "@/components/charts/HiringTrendChart";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import DirectorPerformanceChart from "@/components/charts/DirectorPerformanceChart";
import { useJobs } from "@/hooks/useJobs";
import {
  getHiredJobs,
  getClosedJobs,
  getActiveJobs,
  getAverageTimeToFill,
  groupBy,
  toChartPoints,
  getMonthlyTrend,
} from "@/lib/metrics";
import { JOB_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Overview = () => {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (error || !jobs) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">Erro ao carregar dados</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error?.message || "Tente novamente mais tarde."}</p>
      </div>
    );
  }

  const hired = getHiredJobs(jobs);
  const closed = getClosedJobs(jobs);
  const active = getActiveJobs(jobs);
  const avgTimeToFill = getAverageTimeToFill(jobs);

  const statusCounts = JOB_STATUSES.reduce((acc, status) => {
    acc[STATUS_LABELS[status]] = jobs.filter((j) => j.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const statusData = toChartPoints(statusCounts);
  const directorData = toChartPoints(
    Object.entries(groupBy(jobs, "director")).reduce((acc, [key, value]) => {
      acc[key] = value.filter((j) => j.status === "Hired").length;
      return acc;
    }, {} as Record<string, number>)
  );

  const trendData = getMonthlyTrend(jobs);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Visão geral das requisições de contratação.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Vagas" value={jobs.length} icon={Briefcase} color="primary" delay={0} />
        <StatCard label="Contratados" value={hired.length} icon={CheckCircle2} color="accent" delay={1} />
        <StatCard label="Vagas Ativas" value={active.length} icon={Users} color="warning" delay={2} />
        <StatCard label="Tempo Médio de Preenchimento" value={`${avgTimeToFill} dias`} icon={Clock} color="primary" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tendência de Contratações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HiringTrendChart data={trendData} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <StatusDistributionChart data={statusData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Contratações por Diretoria</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectorPerformanceChart data={directorData} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            <p className="mt-2 text-3xl font-bold">
              {jobs.length > 0 ? Math.round((hired.length / jobs.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Vagas Fechadas</p>
            <p className="mt-2 text-3xl font-bold">{closed.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Diretorias Ativas</p>
            <p className="mt-2 text-3xl font-bold">{Object.keys(groupBy(jobs, "director")).length}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Overview;
