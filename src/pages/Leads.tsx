import { AppLayout } from "@/components/layout/AppLayout";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNocoDBLeads } from "@/hooks/useNocoDBLeads";

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: nocoData, isLoading, error } = useNocoDBLeads();

  const leads = nocoData?.leads ?? [];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your leads in one place
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-6 mb-6 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">Showing: </span>
            <span className="font-medium text-foreground">{filteredLeads.length}</span>
            <span className="text-muted-foreground"> of {leads.length} leads</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
            <span className="font-semibold">Error:</span> {error.message}
          </div>
        )}

        {/* Table */}
        <LeadsTable leads={filteredLeads} />
      </div>
    </AppLayout>
  );
};

export default Leads;
