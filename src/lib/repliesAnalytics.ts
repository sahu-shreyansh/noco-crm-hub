import { Lead, ReplyType } from "@/types/crm";

export interface ReplyMetrics {
  totalReplies: number;
  positiveReplies: number;
  neutralReplies: number;
  negativeReplies: number;
  autoReplies: number;
  avgReplyTimeHours: number;
  previousPeriodDelta: {
    totalReplies: number;
    positiveReplies: number;
    neutralReplies: number;
    negativeReplies: number;
  };
}

export interface FollowUpMetrics {
  avgFollowupsPerLead: number;
  repliesAfterFollowup: number;
  positivePercentAfterFollowup: number;
  avgDaysToReply: number;
  previousPeriodDelta: {
    avgFollowupsPerLead: number;
    repliesAfterFollowup: number;
    positivePercentAfterFollowup: number;
    avgDaysToReply: number;
  };
}

export interface SentimentDistribution {
  name: string;
  value: number;
  color: string;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export function calculateReplyMetrics(leads: Lead[]): ReplyMetrics {
  const repliedLeads = leads.filter((lead) => lead.reply_received);
  const totalReplies = repliedLeads.length;

  const positiveReplies = repliedLeads.filter((l) => l.reply_type === "positive").length;
  const neutralReplies = repliedLeads.filter((l) => l.reply_type === "neutral").length;
  const negativeReplies = repliedLeads.filter((l) => l.reply_type === "negative").length;
  const autoReplies = repliedLeads.filter((l) => l.reply_type === null).length;

  const leadsWithReplyTime = repliedLeads.filter((l) => l.reply_time_hours !== undefined);
  const avgReplyTimeHours =
    leadsWithReplyTime.length > 0
      ? leadsWithReplyTime.reduce((sum, l) => sum + (l.reply_time_hours || 0), 0) /
        leadsWithReplyTime.length
      : 0;

  return {
    totalReplies,
    positiveReplies,
    neutralReplies,
    negativeReplies,
    autoReplies,
    avgReplyTimeHours,
    previousPeriodDelta: {
      totalReplies: 18,
      positiveReplies: 12,
      neutralReplies: -5,
      negativeReplies: -8,
    },
  };
}

export function calculateFollowUpMetrics(leads: Lead[]): FollowUpMetrics {
  const leadsWithFollowups = leads.filter((l) => l.followup_count > 0);
  const totalFollowups = leads.reduce((sum, l) => sum + l.followup_count, 0);
  const avgFollowupsPerLead = leads.length > 0 ? totalFollowups / leads.length : 0;

  const repliesAfterFollowup = leadsWithFollowups.filter((l) => l.reply_received).length;
  const positiveAfterFollowup = leadsWithFollowups.filter(
    (l) => l.reply_received && l.reply_type === "positive"
  ).length;
  const positivePercentAfterFollowup =
    repliesAfterFollowup > 0 ? (positiveAfterFollowup / repliesAfterFollowup) * 100 : 0;

  const leadsWithReplyTime = leads.filter((l) => l.reply_time_hours !== undefined);
  const avgDaysToReply =
    leadsWithReplyTime.length > 0
      ? leadsWithReplyTime.reduce((sum, l) => sum + (l.reply_time_hours || 0), 0) /
        leadsWithReplyTime.length /
        24
      : 0;

  return {
    avgFollowupsPerLead,
    repliesAfterFollowup,
    positivePercentAfterFollowup,
    avgDaysToReply,
    previousPeriodDelta: {
      avgFollowupsPerLead: 8,
      repliesAfterFollowup: 15,
      positivePercentAfterFollowup: 5,
      avgDaysToReply: -12,
    },
  };
}

export function calculateSentimentDistribution(leads: Lead[]): SentimentDistribution[] {
  const repliedLeads = leads.filter((lead) => lead.reply_received);
  const total = repliedLeads.length;

  if (total === 0) {
    return [
      { name: "Positive", value: 0, color: "hsl(142, 71%, 45%)" },
      { name: "Neutral", value: 0, color: "hsl(38, 92%, 50%)" },
      { name: "Negative", value: 0, color: "hsl(0, 84%, 60%)" },
      { name: "Auto-reply", value: 0, color: "hsl(220, 9%, 46%)" },
    ];
  }

  const positive = repliedLeads.filter((l) => l.reply_type === "positive").length;
  const neutral = repliedLeads.filter((l) => l.reply_type === "neutral").length;
  const negative = repliedLeads.filter((l) => l.reply_type === "negative").length;
  const autoReply = repliedLeads.filter((l) => l.reply_type === null).length;

  return [
    { name: "Positive", value: positive, color: "hsl(142, 71%, 45%)" },
    { name: "Neutral", value: neutral, color: "hsl(38, 92%, 50%)" },
    { name: "Negative", value: negative, color: "hsl(0, 84%, 60%)" },
    { name: "Auto-reply", value: autoReply, color: "hsl(220, 9%, 46%)" },
  ];
}

export function calculateReplyFunnel(leads: Lead[]): FunnelStage[] {
  const outreachSent = leads.filter((l) => l.outreach_sent).length;
  const opened = Math.round(outreachSent * 0.45); // Simulated open rate
  const replied = leads.filter((l) => l.reply_received).length;
  const positive = leads.filter((l) => l.reply_type === "positive").length;
  const meetings = leads.filter((l) => l.status === "meeting" || l.status === "closed").length;

  const maxCount = outreachSent || 1;

  return [
    { stage: "Outreach Sent", count: outreachSent, percentage: 100 },
    { stage: "Opened", count: opened, percentage: Math.round((opened / maxCount) * 100) },
    { stage: "Replied", count: replied, percentage: Math.round((replied / maxCount) * 100) },
    { stage: "Positive", count: positive, percentage: Math.round((positive / maxCount) * 100) },
    { stage: "Meeting", count: meetings, percentage: Math.round((meetings / maxCount) * 100) },
  ];
}
