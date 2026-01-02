import { Lead, Campaign, DashboardMetrics, SDRPerformance, TimelineEvent, RepliesOverTime } from "@/types/crm";

const sdrNames = ["Alex Johnson", "Maria Garcia", "Chris Lee", "Jordan Smith", "Taylor Brown"];

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    company: "TechCorp Industries",
    status: "replied",
    source: "LinkedIn",
    createdAt: "2024-12-28",
    lastContactedAt: "2024-12-29",
    notes: "Interested in enterprise plan",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Alex Johnson",
    first_outreach_date: "2024-12-20",
    last_followup_date: "2024-12-29",
    next_followup_date: "2025-01-02",
    followup_count: 2,
    reply_time_hours: 18
  },
  {
    id: "2",
    name: "Michael Foster",
    email: "m.foster@innovate.io",
    company: "Innovate.io",
    status: "contacted",
    source: "Cold Email",
    createdAt: "2024-12-27",
    lastContactedAt: "2024-12-28",
    outreach_sent: true,
    reply_received: false,
    reply_type: null,
    sdr_name: "Maria Garcia",
    first_outreach_date: "2024-12-22",
    last_followup_date: "2024-12-28",
    next_followup_date: "2025-01-03",
    followup_count: 1
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma@growthlab.com",
    company: "GrowthLab",
    status: "new",
    source: "Website",
    createdAt: "2024-12-29",
    outreach_sent: false,
    reply_received: false,
    reply_type: null,
    sdr_name: "Chris Lee",
    first_outreach_date: "2024-12-29",
    followup_count: 0
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.r@startupx.co",
    company: "StartupX",
    status: "meeting",
    source: "Referral",
    createdAt: "2024-12-25",
    lastContactedAt: "2024-12-28",
    notes: "Meeting scheduled for next week",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Jordan Smith",
    first_outreach_date: "2024-12-18",
    last_followup_date: "2024-12-28",
    next_followup_date: "2025-01-05",
    followup_count: 3,
    reply_time_hours: 24
  },
  {
    id: "5",
    name: "Lisa Park",
    email: "lisa.park@dataflow.com",
    company: "DataFlow Systems",
    status: "new",
    source: "LinkedIn",
    createdAt: "2024-12-30",
    outreach_sent: false,
    reply_received: false,
    reply_type: null,
    sdr_name: "Taylor Brown",
    first_outreach_date: "2024-12-30",
    followup_count: 0
  },
  {
    id: "6",
    name: "David Kim",
    email: "d.kim@nexgen.tech",
    company: "NexGen Technologies",
    status: "contacted",
    source: "Cold Email",
    createdAt: "2024-12-26",
    lastContactedAt: "2024-12-29",
    outreach_sent: true,
    reply_received: false,
    reply_type: null,
    sdr_name: "Alex Johnson",
    first_outreach_date: "2024-12-21",
    last_followup_date: "2024-12-29",
    next_followup_date: "2025-01-04",
    followup_count: 2
  },
  {
    id: "7",
    name: "Amanda Torres",
    email: "amanda@cloudify.io",
    company: "Cloudify",
    status: "positive",
    source: "Conference",
    createdAt: "2024-12-24",
    lastContactedAt: "2024-12-30",
    notes: "Requesting demo",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Maria Garcia",
    first_outreach_date: "2024-12-19",
    last_followup_date: "2024-12-30",
    next_followup_date: "2025-01-06",
    followup_count: 3,
    reply_time_hours: 12
  },
  {
    id: "8",
    name: "Robert Zhang",
    email: "r.zhang@scaleup.com",
    company: "ScaleUp Inc",
    status: "closed",
    source: "Website",
    createdAt: "2024-12-20",
    lastContactedAt: "2024-12-28",
    notes: "Deal closed - $12,000 ARR",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Chris Lee",
    first_outreach_date: "2024-12-15",
    last_followup_date: "2024-12-28",
    followup_count: 4,
    reply_time_hours: 8
  },
  {
    id: "9",
    name: "Jennifer Liu",
    email: "j.liu@quantum.tech",
    company: "Quantum Tech",
    status: "replied",
    source: "LinkedIn",
    createdAt: "2024-12-22",
    lastContactedAt: "2024-12-27",
    outreach_sent: true,
    reply_received: true,
    reply_type: "neutral",
    sdr_name: "Jordan Smith",
    first_outreach_date: "2024-12-17",
    last_followup_date: "2024-12-27",
    next_followup_date: "2025-01-02",
    followup_count: 2,
    reply_time_hours: 36
  },
  {
    id: "10",
    name: "Mark Thompson",
    email: "mark.t@enterprise.co",
    company: "Enterprise Co",
    status: "replied",
    source: "Cold Email",
    createdAt: "2024-12-23",
    lastContactedAt: "2024-12-28",
    outreach_sent: true,
    reply_received: true,
    reply_type: "negative",
    sdr_name: "Taylor Brown",
    first_outreach_date: "2024-12-18",
    last_followup_date: "2024-12-28",
    followup_count: 2,
    reply_time_hours: 48
  },
  {
    id: "11",
    name: "Sophie Adams",
    email: "sophie@fintech.io",
    company: "FinTech Solutions",
    status: "positive",
    source: "Referral",
    createdAt: "2024-12-21",
    lastContactedAt: "2024-12-29",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Alex Johnson",
    first_outreach_date: "2024-12-16",
    last_followup_date: "2024-12-29",
    next_followup_date: "2025-01-03",
    followup_count: 3,
    reply_time_hours: 16
  },
  {
    id: "12",
    name: "Daniel Brown",
    email: "d.brown@startup.vc",
    company: "Startup VC",
    status: "meeting",
    source: "LinkedIn",
    createdAt: "2024-12-19",
    lastContactedAt: "2024-12-30",
    notes: "Demo scheduled",
    outreach_sent: true,
    reply_received: true,
    reply_type: "positive",
    sdr_name: "Maria Garcia",
    first_outreach_date: "2024-12-14",
    last_followup_date: "2024-12-30",
    next_followup_date: "2025-01-07",
    followup_count: 4,
    reply_time_hours: 20
  },
  // Additional leads for more realistic data
  {
    id: "13",
    name: "Alex Martinez",
    email: "alex.m@techstart.io",
    company: "TechStart",
    status: "replied",
    source: "Cold Email",
    createdAt: "2024-12-20",
    lastContactedAt: "2024-12-26",
    outreach_sent: true,
    reply_received: true,
    reply_type: null, // Auto-reply/OOO
    sdr_name: "Chris Lee",
    first_outreach_date: "2024-12-18",
    last_followup_date: "2024-12-26",
    followup_count: 1,
    reply_time_hours: 2
  },
  {
    id: "14",
    name: "Rachel Green",
    email: "r.green@cloudops.com",
    company: "CloudOps",
    status: "replied",
    source: "LinkedIn",
    createdAt: "2024-12-21",
    lastContactedAt: "2024-12-28",
    outreach_sent: true,
    reply_received: true,
    reply_type: null, // Auto-reply/OOO
    sdr_name: "Jordan Smith",
    first_outreach_date: "2024-12-19",
    last_followup_date: "2024-12-28",
    followup_count: 2,
    reply_time_hours: 1
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q4 Enterprise Outreach",
    status: "active",
    leadsCount: 156,
    sent: 142,
    replied: 23,
    createdAt: "2024-12-01"
  },
  {
    id: "2",
    name: "LinkedIn Tech Leaders",
    status: "active",
    leadsCount: 89,
    sent: 67,
    replied: 12,
    createdAt: "2024-12-15"
  },
  {
    id: "3",
    name: "Startup Founders Blast",
    status: "completed",
    leadsCount: 200,
    sent: 200,
    replied: 34,
    createdAt: "2024-11-15"
  },
  {
    id: "4",
    name: "SaaS Decision Makers",
    status: "paused",
    leadsCount: 120,
    sent: 45,
    replied: 8,
    createdAt: "2024-12-10"
  }
];

export const mockMetrics: DashboardMetrics = {
  totalLeads: 847,
  emailsSent: 654,
  replies: 89,
  conversionRate: 13.6,
  leadsByStatus: {
    new: 234,
    contacted: 312,
    replied: 89,
    positive: 78,
    meeting: 42,
    closed: 56
  },
  positiveReplyRate: 62.5,
  avgFollowupsPerLead: 2.3,
  avgReplyTimeHours: 24.5
};

export const mockSDRPerformance: SDRPerformance[] = [
  { sdr_name: "Alex Johnson", outreach_count: 145, reply_count: 28, positive_count: 18, neutral_count: 6, negative_count: 4 },
  { sdr_name: "Maria Garcia", outreach_count: 132, reply_count: 22, positive_count: 14, neutral_count: 5, negative_count: 3 },
  { sdr_name: "Chris Lee", outreach_count: 128, reply_count: 19, positive_count: 12, neutral_count: 4, negative_count: 3 },
  { sdr_name: "Jordan Smith", outreach_count: 118, reply_count: 15, positive_count: 9, neutral_count: 4, negative_count: 2 },
  { sdr_name: "Taylor Brown", outreach_count: 131, reply_count: 5, positive_count: 2, neutral_count: 2, negative_count: 1 },
];

export const mockRepliesOverTime: RepliesOverTime[] = [
  { date: "Dec 20", replies: 8, positive: 5, negative: 1 },
  { date: "Dec 21", replies: 12, positive: 8, negative: 2 },
  { date: "Dec 22", replies: 6, positive: 4, negative: 1 },
  { date: "Dec 23", replies: 14, positive: 9, negative: 2 },
  { date: "Dec 24", replies: 10, positive: 6, negative: 2 },
  { date: "Dec 25", replies: 4, positive: 3, negative: 0 },
  { date: "Dec 26", replies: 11, positive: 7, negative: 2 },
  { date: "Dec 27", replies: 9, positive: 5, negative: 2 },
  { date: "Dec 28", replies: 15, positive: 10, negative: 3 },
  { date: "Dec 29", replies: 8, positive: 5, negative: 1 },
  { date: "Dec 30", replies: 13, positive: 9, negative: 2 },
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    lead_id: "1",
    lead_name: "Sarah Chen",
    company: "TechCorp Industries",
    sdr_name: "Alex Johnson",
    events: [
      { type: "outreach", date: "2024-12-20", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-24", label: "Follow-up 1" },
      { type: "followup_2", date: "2024-12-28", label: "Follow-up 2" },
      { type: "reply", date: "2024-12-29", label: "Reply Received" },
    ]
  },
  {
    lead_id: "4",
    lead_name: "James Rodriguez",
    company: "StartupX",
    sdr_name: "Jordan Smith",
    events: [
      { type: "outreach", date: "2024-12-18", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-22", label: "Follow-up 1" },
      { type: "reply", date: "2024-12-24", label: "Reply Received" },
      { type: "meeting", date: "2024-12-28", label: "Meeting Scheduled" },
    ]
  },
  {
    lead_id: "7",
    lead_name: "Amanda Torres",
    company: "Cloudify",
    sdr_name: "Maria Garcia",
    events: [
      { type: "outreach", date: "2024-12-19", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-23", label: "Follow-up 1" },
      { type: "followup_2", date: "2024-12-27", label: "Follow-up 2" },
      { type: "reply", date: "2024-12-30", label: "Reply Received" },
    ]
  },
  {
    lead_id: "8",
    lead_name: "Robert Zhang",
    company: "ScaleUp Inc",
    sdr_name: "Chris Lee",
    events: [
      { type: "outreach", date: "2024-12-15", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-18", label: "Follow-up 1" },
      { type: "reply", date: "2024-12-20", label: "Reply Received" },
      { type: "meeting", date: "2024-12-24", label: "Meeting Held" },
    ]
  },
  {
    lead_id: "11",
    lead_name: "Sophie Adams",
    company: "FinTech Solutions",
    sdr_name: "Alex Johnson",
    events: [
      { type: "outreach", date: "2024-12-16", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-20", label: "Follow-up 1" },
      { type: "followup_2", date: "2024-12-25", label: "Follow-up 2" },
      { type: "reply", date: "2024-12-29", label: "Reply Received" },
    ]
  },
  {
    lead_id: "12",
    lead_name: "Daniel Brown",
    company: "Startup VC",
    sdr_name: "Maria Garcia",
    events: [
      { type: "outreach", date: "2024-12-14", label: "Initial Outreach" },
      { type: "followup_1", date: "2024-12-17", label: "Follow-up 1" },
      { type: "followup_2", date: "2024-12-21", label: "Follow-up 2" },
      { type: "reply", date: "2024-12-24", label: "Reply Received" },
      { type: "meeting", date: "2024-12-30", label: "Demo Scheduled" },
    ]
  },
];

export const replyQualityData = [
  { name: "Positive", value: 55, color: "hsl(142, 71%, 45%)" },
  { name: "Neutral", value: 21, color: "hsl(38, 92%, 50%)" },
  { name: "Negative", value: 13, color: "hsl(0, 84%, 60%)" },
  { name: "Auto-reply", value: 8, color: "hsl(220, 9%, 46%)" },
];

export const funnelData = [
  { stage: "Leads", count: 847, percentage: 100 },
  { stage: "Outreach", count: 654, percentage: 77.2 },
  { stage: "Replies", count: 89, percentage: 10.5 },
  { stage: "Positive", count: 55, percentage: 6.5 },
  { stage: "Closed", count: 56, percentage: 6.6 },
];

// Reply-specific funnel data
export const replyFunnelData = [
  { stage: "Outreach Sent", count: 654, percentage: 100 },
  { stage: "Opened", count: 294, percentage: 45 },
  { stage: "Replied", count: 89, percentage: 13.6 },
  { stage: "Positive", count: 55, percentage: 8.4 },
  { stage: "Meeting", count: 42, percentage: 6.4 },
];

// Follow-up effectiveness metrics
export const followUpEffectiveness = {
  repliesWithoutFollowup: 12,
  repliesAfterFollowup1: 35,
  repliesAfterFollowup2: 28,
  repliesAfterFollowup3Plus: 14,
};
