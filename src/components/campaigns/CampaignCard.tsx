import { Campaign } from "@/types/crm";
import { cn } from "@/lib/utils";
import { Play, Pause, CheckCircle } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

const statusConfig = {
  active: {
    icon: Play,
    label: "Active",
    className: "bg-success/10 text-success",
  },
  paused: {
    icon: Pause,
    label: "Paused",
    className: "bg-warning/10 text-warning",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "bg-muted text-muted-foreground",
  },
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const config = statusConfig[campaign.status];
  const replyRate = ((campaign.replied / campaign.sent) * 100).toFixed(1);

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {campaign.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Created {campaign.createdAt}
          </p>
        </div>
        <span className={cn("status-badge", config.className)}>
          <config.icon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-2xl font-bold text-foreground">{campaign.leadsCount}</p>
          <p className="text-xs text-muted-foreground">Leads</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{campaign.sent}</p>
          <p className="text-xs text-muted-foreground">Sent</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-success">{campaign.replied}</p>
          <p className="text-xs text-muted-foreground">Replied</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-warning">{replyRate}%</p>
          <p className="text-xs text-muted-foreground">Reply Rate</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(campaign.sent / campaign.leadsCount) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {campaign.sent} of {campaign.leadsCount} emails sent
        </p>
      </div>
    </div>
  );
}
