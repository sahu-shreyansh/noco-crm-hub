import { Lead } from "@/types/crm";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send, Mail, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const handleAction = (action: string, lead: Lead) => {
    toast.success(`${action} triggered for ${lead.name}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Company</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Source</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">SDR</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Created</th>
            <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr 
              key={lead.id} 
              className="table-row-hover border-b border-border last:border-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="py-4 px-6">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{lead.name}</span>
                  <span className="text-sm text-muted-foreground">{lead.email}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-foreground">{lead.company}</td>
              <td className="py-4 px-6 text-muted-foreground">{lead.source}</td>
              <td className="py-4 px-6">
                <StatusBadge status={lead.status} />
              </td>
              <td className="py-4 px-6 text-muted-foreground text-sm">{lead.sdr_name}</td>
              <td className="py-4 px-6 text-muted-foreground">{lead.createdAt}</td>
              <td className="py-4 px-6">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleAction("View details", lead)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAction("Send outreach", lead)}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Outreach
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Send follow-up", lead)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Follow-up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Mark as replied", lead)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Replied
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
