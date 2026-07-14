import { JobStatus } from "@/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      className
    )}
    style={{
      backgroundColor: `${STATUS_COLORS[status]}1A`,
      color: STATUS_COLORS[status],
    }}
  >
    {STATUS_LABELS[status]}
  </span>
);

export default StatusBadge;
