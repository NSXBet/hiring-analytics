import { JobStatus } from "@/types";

export const JOB_STATUSES: JobStatus[] = [
  "Interview",
  "Offer",
  "Kick off",
  "Stand By",
  "Offer Accepted",
  "Canceled",
  "Turnover",
  "Withdrawn",
  "TBD",
];

export const ACTIVE_STATUSES: JobStatus[] = ["Interview", "Offer", "Kick off", "Stand By"];

export const CLOSED_STATUSES: JobStatus[] = ["Offer Accepted", "Canceled", "Turnover", "Withdrawn", "TBD"];

export const STATUS_COLORS: Record<JobStatus, string> = {
  "Offer Accepted": "hsl(var(--status-hired))",
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
  "Offer Accepted": "Offer Accepted",
  Interview: "Interview",
  Offer: "Offer",
  "Kick off": "Kick off",
  "Stand By": "Stand By",
  Canceled: "Canceled",
  Turnover: "Turnover",
  Withdrawn: "Withdrawn",
  TBD: "TBD",
};

export const DIRECTOR_COLORS: Record<string, string> = {
  Technology: "hsl(var(--director-technology))",
  "Customer Operations": "hsl(var(--director-customer-operations))",
  Marketing: "hsl(var(--director-marketing))",
  Commercial: "hsl(var(--director-commercial))",
  Product: "hsl(var(--director-product))",
  HR: "hsl(var(--director-hr))",
  Finance: "hsl(var(--director-finance))",
  Betfair: "hsl(var(--director-betfair))",
  Operation: "hsl(var(--director-operation))",
  Legal: "hsl(var(--director-legal))",
  Unknown: "hsl(var(--director-unknown))",
  // Legacy mappings kept for compatibility
  Engineering: "hsl(var(--director-engineering))",
  Data: "hsl(var(--director-data))",
  Sales: "hsl(var(--director-sales))",
  People: "hsl(var(--director-people))",
};

export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];
