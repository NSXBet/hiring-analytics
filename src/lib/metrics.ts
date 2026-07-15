import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Job, JobStatus, ChartPoint } from "@/types";
import { CLOSED_STATUSES } from "@/lib/constants";

export const countByStatus = (jobs: Job[], status: JobStatus) => jobs.filter((j) => j.status === status).length;

export const countByDirector = (jobs: Job[], director: string) => jobs.filter((j) => j.director === director).length;

export const countByRecruiter = (jobs: Job[], recruiter: string) => jobs.filter((j) => j.recruiter === recruiter).length;

export const countByHiringManager = (jobs: Job[], hiringManager: string) => jobs.filter((j) => j.hiring_manager === hiringManager).length;

export const countByCountry = (jobs: Job[], country: string) => jobs.filter((j) => j.country === country).length;

export const getUniqueValues = (jobs: Job[], key: keyof Job) =>
  Array.from(new Set(jobs.map((j) => j[key]).filter(Boolean))) as string[];

export const getTimeToFill = (job: Job): number | null => {
  if (!job.opening_date || !job.closing_date) return null;
  return differenceInCalendarDays(parseISO(job.closing_date), parseISO(job.opening_date));
};

export const getAverageTimeToFill = (jobs: Job[]): number => {
  const closed = jobs.filter((j) => j.closing_date && j.opening_date);
  if (closed.length === 0) return 0;
  const total = closed.reduce((sum, j) => sum + getTimeToFill(j)!, 0);
  return Math.round(total / closed.length);
};

export const getOfferAcceptedJobs = (jobs: Job[]) => jobs.filter((j) => j.status === "Offer Accepted");

export const getClosedJobs = (jobs: Job[]) => jobs.filter((j) => CLOSED_STATUSES.includes(j.status));

export const getSLAAdherence = (jobs: Job[]): number => {
  const offerAccepted = getOfferAcceptedJobs(jobs).filter((j) => j.closing_date);
  if (offerAccepted.length === 0) return 0;
  const onTime = offerAccepted.filter((j) => {
    if (!j.committed_date) return true;
    return differenceInCalendarDays(parseISO(j.closing_date!), parseISO(j.committed_date)) <= 0;
  }).length;
  return Math.round((onTime / offerAccepted.length) * 100);
};

export const getConversionRate = (jobs: Job[]): number => {
  if (jobs.length === 0) return 0;
  return Math.round((getOfferAcceptedJobs(jobs).length / jobs.length) * 100);
};

export const getActiveJobs = (jobs: Job[]) => jobs.filter((j) => !["Offer Accepted", "Canceled", "Withdrawn"].includes(j.status));

export const groupBy = <K extends keyof Job>(jobs: Job[], key: K): Record<string, Job[]> =>
  jobs.reduce((acc, job) => {
    const value = String(job[key]);
    acc[value] = acc[value] || [];
    acc[value].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

export const toChartPoints = (record: Record<string, number>): ChartPoint[] =>
  Object.entries(record)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fillMonthlyHires = (data: ChartPoint[], year: number): ChartPoint[] => {
  const map = new Map(data.map((d) => [d.name, d.value]));
  return MONTH_LABELS.map((month) => ({
    name: `${month}/${String(year).slice(-2)}`,
    value: map.get(`${month}/${String(year).slice(-2)}`) || 0,
  }));
};

const fillMonthlyTrend = (
  data: { name: string; opened: number; hired: number }[],
  year: number
): { name: string; opened: number; hired: number }[] => {
  const map = new Map(data.map((d) => [d.name, d]));
  return MONTH_LABELS.map((month) => {
    const key = `${month}/${String(year).slice(-2)}`;
    const existing = map.get(key);
    return {
      name: key,
      opened: existing?.opened ?? 0,
      hired: existing?.hired ?? 0,
    };
  });
};

export const getMonthlyTrend = (jobs: Job[], year: number): { name: string; opened: number; hired: number }[] => {
  const counts = new Map<string, { opened: number; hired: number; date: Date }>();

  jobs.forEach((job) => {
    if (job.opening_date) {
      const date = parseISO(job.opening_date);
      const key = format(date, "MMM/yy");
      const current = counts.get(key) || { opened: 0, hired: 0, date };
      current.opened++;
      counts.set(key, current);
    }
    if (job.closing_date) {
      const date = parseISO(job.closing_date);
      const key = format(date, "MMM/yy");
      const current = counts.get(key) || { opened: 0, hired: 0, date };
      current.hired++;
      counts.set(key, current);
    }
  });

  const data = Array.from(counts.entries())
    .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
    .map(([name, { opened, hired }]) => ({ name, opened, hired }));

  return fillMonthlyTrend(data, year);
};

export const getTotalJobs = (jobs: Job[]) => jobs.length;

export const getOpenJobs = (jobs: Job[]) => jobs.filter((j) => j.status !== "Hired" && j.status !== "Canceled" && j.status !== "Withdrawn");

export const getStatusCounts = (jobs: Job[]): ChartPoint[] =>
  Object.entries(
    jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

export const getMonthlyHires = (jobs: Job[], year: number): ChartPoint[] => {
  const counts = new Map<string, { value: number; date: Date }>();

  jobs.forEach((job) => {
    if (job.closing_date) {
      const date = parseISO(job.closing_date);
      const key = format(date, "MMM/yy");
      const current = counts.get(key) || { value: 0, date };
      current.value++;
      counts.set(key, current);
    }
  });

  const data = Array.from(counts.entries())
    .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
    .map(([name, { value }]) => ({ name, value }));

  return fillMonthlyHires(data, year);
};

export const formatDate = (date: string | null) => (date ? format(parseISO(date), "dd/MM/yyyy") : "—");
