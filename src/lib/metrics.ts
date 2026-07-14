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

export const getHiredJobs = (jobs: Job[]) => jobs.filter((j) => j.status === "Hired");

export const getClosedJobs = (jobs: Job[]) => jobs.filter((j) => CLOSED_STATUSES.includes(j.status));

export const getActiveJobs = (jobs: Job[]) => jobs.filter((j) => !["Hired", "Canceled", "Withdrawn"].includes(j.status));

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

export const getMonthlyTrend = (jobs: Job[]): ChartPoint[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const opened = new Array(12).fill(0);
  const hired = new Array(12).fill(0);

  jobs.forEach((job) => {
    if (job.opening_date) {
      const month = parseISO(job.opening_date).getMonth();
      opened[month]++;
    }
    if (job.closing_date && job.status === "Hired") {
      const month = parseISO(job.closing_date).getMonth();
      hired[month]++;
    }
  });

  return months.map((name, i) => ({ name, opened: opened[i], hired: hired[i] }));
};

export const formatDate = (date: string | null) => (date ? format(parseISO(date), "dd/MM/yyyy") : "—");
