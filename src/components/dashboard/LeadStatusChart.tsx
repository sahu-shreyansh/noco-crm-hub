import { DashboardMetrics } from "@/types/crm";

interface LeadStatusChartProps {
  data: DashboardMetrics["leadsByStatus"];
}

const statusConfig = {
  new: { label: "New", color: "bg-info" },
  contacted: { label: "Contacted", color: "bg-warning" },
  replied: { label: "Replied", color: "bg-success" },
  qualified: { label: "Qualified", color: "bg-primary" },
  closed: { label: "Closed", color: "bg-muted-foreground" },
};

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="metric-card animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Leads by Status</h3>
      
      {/* Progress bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const value = data[key as keyof typeof data];
          const percentage = (value / total) * 100;
          return (
            <div
              key={key}
              className={`${config.color} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => {
          const value = data[key as keyof typeof data];
          const percentage = ((value / total) * 100).toFixed(1);
          return (
            <div key={key} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${config.color}`} />
              <span className="text-sm text-muted-foreground">
                {config.label}
              </span>
              <span className="text-sm font-medium ml-auto">
                {value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
