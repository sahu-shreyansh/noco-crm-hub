export type LeadStatus = 'new' | 'contacted' | 'replied' | 'positive' | 'meeting' | 'closed';
export type ReplyType = 'positive' | 'neutral' | 'negative' | null;

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
  outreach_sent: boolean;
  reply_received: boolean;
  reply_type: ReplyType;
  sdr_name: string;
  first_outreach_date: string;
  last_followup_date?: string;
  next_followup_date?: string;
  followup_count: number;
  reply_time_hours?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  leadsCount: number;
  sent: number;
  replied: number;
  createdAt: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  emailsSent: number;
  replies: number;
  conversionRate: number;
  leadsByStatus: Record<LeadStatus, number>;
  positiveReplyRate: number;
  avgFollowupsPerLead: number;
  avgReplyTimeHours: number;
}

export interface SDRPerformance {
  sdr_name: string;
  outreach_count: number;
  reply_count: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
}

export interface TimelineEvent {
  lead_id: string;
  lead_name: string;
  company: string;
  sdr_name: string;
  events: {
    type: 'outreach' | 'followup_1' | 'followup_2' | 'reply' | 'meeting';
    date: string;
    label: string;
  }[];
}

export interface RepliesOverTime {
  date: string;
  replies: number;
  positive: number;
  negative: number;
}
