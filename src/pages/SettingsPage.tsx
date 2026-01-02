import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Key, Webhook, Users, Bell } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    nocodbApiUrl: "",
    nocodbApiToken: "",
    webhookOutreach: "",
    webhookFollowup: "",
    webhookMarkReplied: "",
    emailNotifications: true,
    autoSync: true,
  });

  const handleSave = () => {
    localStorage.setItem("crm-settings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your CRM integrations and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Configure your NocoDB connection</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nocodbUrl">NocoDB API URL</Label>
                <Input
                  id="nocodbUrl"
                  placeholder="http://localhost:8080"
                  value={settings.nocodbApiUrl}
                  onChange={(e) => setSettings({ ...settings, nocodbApiUrl: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nocodbToken">NocoDB API Token</Label>
                <Input
                  id="nocodbToken"
                  type="password"
                  placeholder="Enter your API token"
                  value={settings.nocodbApiToken}
                  onChange={(e) => setSettings({ ...settings, nocodbApiToken: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Webhook className="h-5 w-5 text-success" />
                </div>
                <div>
                  <CardTitle>n8n Webhooks</CardTitle>
                  <CardDescription>Configure your automation workflow URLs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="webhookOutreach">Outreach Webhook URL</Label>
                <Input
                  id="webhookOutreach"
                  placeholder="https://your-n8n-instance.com/webhook/outreach"
                  value={settings.webhookOutreach}
                  onChange={(e) => setSettings({ ...settings, webhookOutreach: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhookFollowup">Follow-up Webhook URL</Label>
                <Input
                  id="webhookFollowup"
                  placeholder="https://your-n8n-instance.com/webhook/followup"
                  value={settings.webhookFollowup}
                  onChange={(e) => setSettings({ ...settings, webhookFollowup: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhookReplied">Mark as Replied Webhook URL</Label>
                <Input
                  id="webhookReplied"
                  placeholder="https://your-n8n-instance.com/webhook/mark-replied"
                  value={settings.webhookMarkReplied}
                  onChange={(e) => setSettings({ ...settings, webhookMarkReplied: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Bell className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for new replies
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync leads every hour
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, autoSync: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Members Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <div>
                  <CardTitle>SDR Team Members</CardTitle>
                  <CardDescription>Manage your sales development team</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Team member management coming soon. Connect to backend to enable this feature.
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
