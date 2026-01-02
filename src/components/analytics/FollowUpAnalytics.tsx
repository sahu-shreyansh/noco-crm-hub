import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedMetricCard } from "./AnimatedMetricCard";
import { FollowUpGantt } from "./FollowUpGantt";
import { RotateCw, MessageSquareReply, TrendingUp, CalendarDays } from "lucide-react";
import { calculateFollowUpMetrics, FollowUpMetrics } from "@/lib/repliesAnalytics";
import { Lead, TimelineEvent } from "@/types/crm";

interface FollowUpAnalyticsProps {
  leads: Lead[];
  timelineEvents: TimelineEvent[];
}

export const FollowUpAnalytics = ({ leads, timelineEvents }: FollowUpAnalyticsProps) => {
  const followUpMetrics = calculateFollowUpMetrics(leads);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-info rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">Follow-up Analytics</h2>
      </div>

      {/* Follow-up KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedMetricCard
          title="Avg Follow-ups/Lead"
          value={followUpMetrics.avgFollowupsPerLead}
          icon={RotateCw}
          trend={{
            value: Math.abs(followUpMetrics.previousPeriodDelta.avgFollowupsPerLead),
            isPositive: followUpMetrics.previousPeriodDelta.avgFollowupsPerLead > 0,
          }}
          delay={0}
          decimals={1}
        />
        <AnimatedMetricCard
          title="Replies After Follow-up"
          value={followUpMetrics.repliesAfterFollowup}
          icon={MessageSquareReply}
          trend={{
            value: Math.abs(followUpMetrics.previousPeriodDelta.repliesAfterFollowup),
            isPositive: followUpMetrics.previousPeriodDelta.repliesAfterFollowup > 0,
          }}
          delay={1}
        />
        <AnimatedMetricCard
          title="Positive % After F/U"
          value={followUpMetrics.positivePercentAfterFollowup}
          suffix="%"
          icon={TrendingUp}
          trend={{
            value: Math.abs(followUpMetrics.previousPeriodDelta.positivePercentAfterFollowup),
            isPositive: followUpMetrics.previousPeriodDelta.positivePercentAfterFollowup > 0,
          }}
          delay={2}
          decimals={1}
        />
        <AnimatedMetricCard
          title="Avg Days to Reply"
          value={followUpMetrics.avgDaysToReply}
          suffix="d"
          icon={CalendarDays}
          trend={{
            value: Math.abs(followUpMetrics.previousPeriodDelta.avgDaysToReply),
            isPositive: followUpMetrics.previousPeriodDelta.avgDaysToReply < 0,
          }}
          delay={3}
          decimals={1}
        />
      </div>

      {/* Follow-up Gantt Timeline */}
      <FollowUpGantt data={timelineEvents} />
    </motion.section>
  );
};
