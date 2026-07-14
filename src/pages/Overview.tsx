import { motion } from "framer-motion";
import { LayoutDashboard, Users, Clock, CheckCircle2, AlertCircle, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import StatusDistributionChart from "@/components/charts/StatusDistributionChart";
import HiringTrendChart from "@/components/charts/HiringTrendChart";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import {
  getTotalJobs,
  getHiredJobs,
  getOpenJobs,
  getAverageTimeToFill,
  getStatusCounts,
  getMonthlyHires,
  getMonthlyTrend,
  getSLAAdherence,
  getConversionRate,
} from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

const Overview = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading, isError, error } = useJobs(selectedYear);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (isError || !jobs) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={staggerItem}>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Overview
          </h2>
          <p className="text-muted-foreground">Visão geral das vagas fechadas e em andamento.</p>
        </motion.div>
        <motion.div variants={staggerItem}>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">Erro ao carregar dados</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Não foi possível carregar as vagas do Supabase. Verifique a conexão ou tente recarregar a página.
                </p>
                {error && (
                  <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded">
                    {error instanceof Error ? error.message : String(error)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const statusCounts = getStatusCounts(jobs);
  const hiredCount = getHiredJobs(jobs).length;
  const openCount = getOpenJobs(jobs).length;
  const avgDays = getAverageTimeToFill(jobs);
  const monthlyHires = getMonthlyHires(jobs);
  const monthlyTrend = getMonthlyTrend(jobs);
  const slaAdherence = getSLAAdherence(jobs);
  const conversionRate = getConversionRate(jobs);

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Taxa de Conversão" value={`${conversionRate}%`} icon={TrendingUp} color="accent" delay={4} />
        <StatCard label="Aderência ao Prazo" value={`${slaAdherence}%`} icon={Target} color="primary" delay={5} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tendência de Contratações</CardTitle>
            </CardHeader>
            <CardContent>
              <HiringTrendChart data={monthlyTrend} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Contratações por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={monthlyHires} label="Contratações" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

        <motion.div variants={staggerItem}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Resumo por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {statusCounts.slice(0, 8).map((status) => (
                  <div key={status.name} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm font-medium text-muted-foreground">{status.name}</span>
                    <span className="text-lg font-bold">{status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
