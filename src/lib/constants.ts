import { JobStatus } from "@/types";

export const JOB_STATUSES: JobStatus[] = [
  "Interview",
  "Offer",
  "Kick off",
  "Stand By",
  "Hired",
  "Canceled",
  "Turnover",
  "Withdrawn",
  "TBD",
];

export const ACTIVE_STATUSES: JobStatus[] = ["Interview", "Offer", "Kick off", "Stand By"];

export const CLOSED_STATUSES: JobStatus[] = ["Hired", "Canceled", "Turnover", "Withdrawn", "TBD"];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Hired: "hsl(var(--status-hired))",
  Interview: "hsl(var(--status-interview))",
  Offer: "hsl(var(--status-offer))",
  "Kick off": "hsl(var(--status-kickoff))",
  "Stand By": "hsl(var(--status-standby))",
  Canceled: "hsl(var(--status-canceled))",
  Turnover: "hsl(var(--status-turnover))",
  Withdrawn: "hsl(var(--status-withdrawn))",
  TBD: "hsl(var(--status-tbd))",
};

export const STATUS_LABELS: Record<JobStatus, string> = {
  Hired: "Contratado",
  Interview: "Entrevista",
  Offer: "Oferta",
  "Kick off": "Kick off",
  "Stand By": "Stand By",
  Canceled: "Cancelado",
  Turnover: "Turnover",
  Withdrawn: "Desistiu",
  TBD: "TBD",
};

export const DIRECTOR_COLORS: Record<string, string> = {
  Product: "hsl(var(--director-product))",
  Engineering: "hsl(var(--director-engineering))",
  Data: "hsl(var(--director-data))",
  Sales: "hsl(var(--director-sales))",
  Marketing: "hsl(var(--director-marketing))",
  People: "hsl(var(--director-people))",
  Finance: "hsl(var(--director-finance))",
};

export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];
