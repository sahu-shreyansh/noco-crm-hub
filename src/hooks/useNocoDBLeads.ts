import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Lead, TimelineEvent, RepliesOverTime, SDRPerformance } from '@/types/crm';

interface NocoDBLead {
  id: string;
  name: string;
  company: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  status: string;
  rawStatus?: string;
  outreach_sent: boolean;
  reply_received: boolean;
  reply_type: string | null;
  sdr_name: string;
  first_outreach_date: string | null;
  last_followup_date: string | null;
  next_followup_date: string | null;
  followup_count: number;
  days_to_reply: number | null;
  email_opened: boolean;
  confidence?: number | null;
  fileLink?: string | null;
  emailBody?: string | null;
}

interface NocoDBResponse {
  leads: NocoDBLead[];
  total: number;
  error?: string;
  debug?: {
    sampleStatuses?: string[];
  };
}

function transformToLead(record: NocoDBLead): Lead {
  return {
    id: record.id,
    name: record.name,
    email: record.email || '',
    company: record.company,
    status: (record.status as Lead['status']) || 'new',
    source: 'NocoDB',
    createdAt: record.first_outreach_date || new Date().toISOString(),
    lastContactedAt: record.last_followup_date || undefined,
    outreach_sent: record.outreach_sent,
    reply_received: record.reply_received,
    reply_type: (record.reply_type as Lead['reply_type']) || null,
    sdr_name: record.sdr_name || 'Team',
    first_outreach_date: record.first_outreach_date || new Date().toISOString(),
    last_followup_date: record.last_followup_date || undefined,
    next_followup_date: record.next_followup_date || undefined,
    followup_count: record.followup_count || 0,
    reply_time_hours: record.days_to_reply ? record.days_to_reply * 24 : undefined,
  };
}

function generateTimelineEvents(leads: Lead[]): TimelineEvent[] {
  return leads.slice(0, 20).map((lead) => {
    const events: TimelineEvent['events'] = [];

    if (lead.first_outreach_date) {
      events.push({
        type: 'outreach',
        date: lead.first_outreach_date,
        label: 'Initial Outreach',
      });
    }

    if (lead.followup_count >= 1 && lead.first_outreach_date) {
      const followupDate = new Date(lead.first_outreach_date);
      followupDate.setDate(followupDate.getDate() + 3);
      events.push({
        type: 'followup_1',
        date: followupDate.toISOString(),
        label: 'Follow-up 1',
      });
    }

    if (lead.followup_count >= 2 && lead.first_outreach_date) {
      const followup2Date = new Date(lead.first_outreach_date);
      followup2Date.setDate(followup2Date.getDate() + 7);
      events.push({
        type: 'followup_2',
        date: followup2Date.toISOString(),
        label: 'Follow-up 2',
      });
    }

    if (lead.reply_received && lead.last_followup_date) {
      events.push({
        type: 'reply',
        date: lead.last_followup_date,
        label: 'Reply Received',
      });
    }

    if (lead.status === 'meeting' || lead.status === 'closed') {
      const meetingDate = new Date(lead.last_followup_date || lead.first_outreach_date);
      meetingDate.setDate(meetingDate.getDate() + 5);
      events.push({
        type: 'meeting',
        date: meetingDate.toISOString(),
        label: 'Meeting Scheduled',
      });
    }

    return {
      lead_id: lead.id,
      lead_name: lead.name,
      company: lead.company,
      sdr_name: lead.sdr_name,
      events,
    };
  });
}

function generateRepliesOverTime(leads: Lead[]): RepliesOverTime[] {
  // Group leads by their outreach date
  const dateMap = new Map<string, { replies: number; positive: number; negative: number }>();

  leads.forEach((lead) => {
    if (!lead.first_outreach_date) return;
    const date = lead.first_outreach_date.split('T')[0];
    const existing = dateMap.get(date) || { replies: 0, positive: 0, negative: 0 };
    
    if (lead.reply_received) {
      existing.replies++;
      if (lead.reply_type === 'positive') existing.positive++;
      if (lead.reply_type === 'negative') existing.negative++;
    }
    
    dateMap.set(date, existing);
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30); // Last 30 days
}

function generateSDRPerformance(leads: Lead[]): SDRPerformance[] {
  const sdrMap = new Map<string, SDRPerformance>();

  leads.forEach((lead) => {
    const sdrName = lead.sdr_name || 'Team';
    const existing = sdrMap.get(sdrName) || {
      sdr_name: sdrName,
      outreach_count: 0,
      reply_count: 0,
      positive_count: 0,
      neutral_count: 0,
      negative_count: 0,
    };

    if (lead.outreach_sent) existing.outreach_count++;
    if (lead.reply_received) existing.reply_count++;
    if (lead.reply_type === 'positive') existing.positive_count++;
    if (lead.reply_type === 'neutral') existing.neutral_count++;
    if (lead.reply_type === 'negative') existing.negative_count++;

    sdrMap.set(sdrName, existing);
  });

  return Array.from(sdrMap.values());
}

async function fetchLeadsFromNocoDB(): Promise<{
  leads: Lead[];
  timelineEvents: TimelineEvent[];
  repliesOverTime: RepliesOverTime[];
  sdrPerformance: SDRPerformance[];
}> {
  const { data, error } = await supabase.functions.invoke<NocoDBResponse>('fetch-nocodb-leads');

  if (error) {
    console.error('Error fetching from NocoDB:', error);
    throw new Error(error.message);
  }

  if (data?.error) {
    console.error('NocoDB API error:', data.error);
    throw new Error(data.error);
  }

  console.log(`Fetched ${data?.total || 0} leads from NocoDB`, data?.debug);

  const leads = (data?.leads || []).map(transformToLead);
  const timelineEvents = generateTimelineEvents(leads);
  const repliesOverTime = generateRepliesOverTime(leads);
  const sdrPerformance = generateSDRPerformance(leads);

  return { leads, timelineEvents, repliesOverTime, sdrPerformance };
}

export function useNocoDBLeads() {
  return useQuery({
    queryKey: ['nocodb-leads'],
    queryFn: fetchLeadsFromNocoDB,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: false, // Only poll when tab is active
    retry: 2,
  });
}
