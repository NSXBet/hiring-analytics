export type JobStatus =
  | "Interview"
  | "Offer"
  | "Kick off"
  | "Stand By"
  | "Offer Accepted"
  | "Canceled"
  | "Turnover"
  | "Withdrawn"
  | "TBD";

export interface Job {
  id: string;
  cod: string;
  role: string;
  status: JobStatus;
  recruiter: string;
  hiring_manager: string;
  director: string;
  country: string;
  cost_center: string;
  squad: string | null;
  level: string | null;
  type_of_contract: string | null;
  opening_date: string | null;
  closing_date: string | null;
  committed_date: string | null;
  gender: "Female" | "Male" | "Non-binary" | "Prefer not to say" | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardFilters {
  director?: string;
  recruiter?: string;
  hiringManager?: string;
  country?: string;
  status?: JobStatus;
  startDate?: string;
  endDate?: string;
}

export interface MetricCard {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: string;
}

export interface ChartPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
