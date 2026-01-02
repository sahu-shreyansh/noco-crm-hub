import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatedMetricCard } from "@/components/analytics/AnimatedMetricCard";
import { SDRPerformanceChart } from "@/components/analytics/SDRPerformanceChart";
import { ReplyQualityDonut } from "@/components/analytics/ReplyQualityDonut";
import { StatusDistributionPie } from "@/components/analytics/StatusDistributionPie";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { RepliesAnalytics } from "@/components/analytics/RepliesAnalytics";
import { FollowUpAnalytics } from "@/components/analytics/FollowUpAnalytics";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { useNocoDBLeads } from "@/hooks/useNocoDBLeads";
import {
  mockMetrics,
  mockLeads,
  mockSDRPerformance,
  mockRepliesOverTime,
  mockTimelineEvents,
  replyQualityData,
  funnelData,
} from "@/data/mockData";
import {
  Users,
  Send,
  MessageSquare,
  TrendingUp,
  RotateCw,
  Clock,
  RefreshCw,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const { data: nocoData, isLoading, error, refetch, isFetching } = useNocoDBLeads();

  // Use NocoDB data if available, otherwise fall back to mock data
  const leads = nocoData?.leads ?? mockLeads;
  const timelineEvents = nocoData?.timelineEvents ?? mockTimelineEvents;
  const repliesOverTime = nocoData?.repliesOverTime ?? mockRepliesOverTime;
  const sdrPerformance = nocoData?.sdrPerformance ?? mockSDRPerformance;

  // Calculate metrics from leads
  const metrics = {
    totalLeads: leads.length,
    emailsSent: leads.filter(l => l.outreach_sent).length,
    replies: leads.filter(l => l.reply_received).length,
    positiveReplyRate: leads.filter(l => l.reply_received).length > 0
      ? (leads.filter(l => l.reply_type === 'positive').length / leads.filter(l => l.reply_received).length) * 100
      : 0,
    avgFollowupsPerLead: leads.length > 0
      ? leads.reduce((sum, l) => sum + l.followup_count, 0) / leads.length
      : 0,
    avgReplyTimeHours: leads.filter(l => l.reply_time_hours).length > 0
      ? leads.filter(l => l.reply_time_hours).reduce((sum, l) => sum + (l.reply_time_hours || 0), 0) / leads.filter(l => l.reply_time_hours).length
      : 0,
    leadsByStatus: {
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      replied: leads.filter(l => l.status === 'replied').length,
      positive: leads.filter(l => l.status === 'positive').length,
      meeting: leads.filter(l => l.status === 'meeting').length,
      closed: leads.filter(l => l.status === 'closed').length,
    },
  };

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Data refreshed",
      description: `Loaded ${leads.length} leads from NocoDB`,
    });
  };

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">SDR Performance Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your sales pipeline, SDR performance, and lead engagement
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
              {isFetching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isFetching ? 'Loading...' : 'Refresh'}
            </Button>
            <Button size="sm" className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <AnalyticsFilters />

        {/* Top KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <AnimatedMetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <AnimatedMetricCard
            title="Outreach Sent"
            value={metrics.emailsSent}
            icon={Send}
            trend={{ value: 8, isPositive: true }}
            delay={1}
          />
          <AnimatedMetricCard
            title="Replies Received"
            value={metrics.replies}
            icon={MessageSquare}
            trend={{ value: 24, isPositive: true }}
            delay={2}
          />
          <AnimatedMetricCard
            title="Positive Reply %"
            value={metrics.positiveReplyRate}
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            delay={3}
            decimals={1}
          />
          <AnimatedMetricCard
            title="Avg Follow-ups"
            value={metrics.avgFollowupsPerLead}
            icon={RotateCw}
            trend={{ value: 2, isPositive: false }}
            delay={4}
            decimals={1}
          />
          <AnimatedMetricCard
            title="Avg Reply Time"
            value={metrics.avgReplyTimeHours}
            suffix="h"
            icon={Clock}
            trend={{ value: 15, isPositive: true }}
            delay={5}
            decimals={1}
          />
        </div>

        {/* SDR Performance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-success rounded-full" />
            <h2 className="text-xl font-semibold text-foreground">SDR Performance</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SDRPerformanceChart data={sdrPerformance} />
            <ReplyQualityDonut data={replyQualityData} />
          </div>
        </motion.section>

        {/* Status & Funnel Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-warning rounded-full" />
            <h2 className="text-xl font-semibold text-foreground">Pipeline Overview</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatusDistributionPie data={metrics.leadsByStatus} />
            <div className="lg:col-span-2">
              <ConversionFunnel data={funnelData} />
            </div>
          </div>
        </motion.section>

        {/* Replies Analytics Section */}
        <div className="mb-8">
          <RepliesAnalytics leads={leads} repliesOverTime={repliesOverTime} />
        </div>

        {/* Follow-up Analytics Section */}
        <div className="mb-8">
          <FollowUpAnalytics leads={leads} timelineEvents={timelineEvents} />
        </div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-muted-foreground rounded-full" />
              <h2 className="text-xl font-semibold text-foreground">Recent Leads</h2>
            </div>
            <Button variant="link" className="text-primary">
              View all leads →
            </Button>
          </div>
          <LeadsTable leads={leads.slice(0, 6)} />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
