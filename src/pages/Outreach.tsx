import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { mockCampaigns } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Outreach = () => {
  const activeCampaigns = mockCampaigns.filter(c => c.status === "active");
  const pausedCampaigns = mockCampaigns.filter(c => c.status === "paused");
  const completedCampaigns = mockCampaigns.filter(c => c.status === "completed");

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Outreach</h1>
            <p className="text-muted-foreground mt-1">
              Manage your email campaigns and track performance
            </p>
          </div>
          <Button size="sm" className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
            <Play className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCampaigns.length}</p>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
            <Pause className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">{pausedCampaigns.length}</p>
              <p className="text-sm text-muted-foreground">Paused Campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{completedCampaigns.length}</p>
              <p className="text-sm text-muted-foreground">Completed Campaigns</p>
            </div>
          </div>
        </div>

        {/* Campaigns Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Campaigns ({mockCampaigns.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeCampaigns.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({pausedCampaigns.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCampaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCampaigns.map((campaign, index) => (
                <div 
                  key={campaign.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paused" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pausedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Outreach;
