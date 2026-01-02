import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedMetricCard } from "./AnimatedMetricCard";
import { ReplyQualityDonut } from "./ReplyQualityDonut";
import { RepliesOverTimeChart } from "./RepliesOverTimeChart";
import { ReplyFunnel } from "./ReplyFunnel";
import {
  MessageSquare,
  ThumbsUp,
  Minus,
  ThumbsDown,
  Clock,
} from "lucide-react";
import {
  calculateReplyMetrics,
  calculateSentimentDistribution,
  calculateReplyFunnel,
  ReplyMetrics,
} from "@/lib/repliesAnalytics";
import { Lead } from "@/types/crm";
import { RepliesOverTime } from "@/types/crm";

interface RepliesAnalyticsProps {
  leads: Lead[];
  repliesOverTime: RepliesOverTime[];
}

export const RepliesAnalytics = ({ leads, repliesOverTime }: RepliesAnalyticsProps) => {
  const replyMetrics = calculateReplyMetrics(leads);
  const sentimentData = calculateSentimentDistribution(leads);
  const funnelData = calculateReplyFunnel(leads);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-primary rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">Replies Analytics</h2>
      </div>

      {/* Reply KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnimatedMetricCard
          title="Total Replies"
          value={replyMetrics.totalReplies}
          icon={MessageSquare}
          trend={{
            value: Math.abs(replyMetrics.previousPeriodDelta.totalReplies),
            isPositive: replyMetrics.previousPeriodDelta.totalReplies > 0,
          }}
          delay={0}
        />
        <AnimatedMetricCard
          title="Positive Replies"
          value={replyMetrics.positiveReplies}
          icon={ThumbsUp}
          trend={{
            value: Math.abs(replyMetrics.previousPeriodDelta.positiveReplies),
            isPositive: replyMetrics.previousPeriodDelta.positiveReplies > 0,
          }}
          delay={1}
        />
        <AnimatedMetricCard
          title="Neutral Replies"
          value={replyMetrics.neutralReplies}
          icon={Minus}
          trend={{
            value: Math.abs(replyMetrics.previousPeriodDelta.neutralReplies),
            isPositive: replyMetrics.previousPeriodDelta.neutralReplies > 0,
          }}
          delay={2}
        />
        <AnimatedMetricCard
          title="Negative Replies"
          value={replyMetrics.negativeReplies}
          icon={ThumbsDown}
          trend={{
            value: Math.abs(replyMetrics.previousPeriodDelta.negativeReplies),
            isPositive: replyMetrics.previousPeriodDelta.negativeReplies < 0,
          }}
          delay={3}
        />
        <AnimatedMetricCard
          title="Avg Reply Time"
          value={replyMetrics.avgReplyTimeHours}
          suffix="h"
          icon={Clock}
          trend={{
            value: 15,
            isPositive: true,
          }}
          delay={4}
          decimals={1}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RepliesOverTimeChart data={repliesOverTime} />
        </div>
        <ReplyQualityDonut data={sentimentData} />
      </div>

      {/* Reply Conversion Funnel */}
      <ReplyFunnel data={funnelData} />
    </motion.section>
  );
};
