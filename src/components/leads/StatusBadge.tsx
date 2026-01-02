import { LeadStatus } from "@/types/crm";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<LeadStatus, string> = {
  new: "status-new",
  contacted: "status-contacted",
  replied: "status-replied",
  positive: "bg-success/10 text-success",
  meeting: "bg-primary/10 text-primary",
  closed: "status-closed",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  replied: "Replied",
  positive: "Positive",
  meeting: "Meeting",
  closed: "Closed",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", statusStyles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
