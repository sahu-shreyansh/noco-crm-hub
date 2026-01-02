import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const NOCODB_BASE_URL = "https://app.nocodb.com";
const TABLE_ID = "mqr3ezrainoyq9p";
const PAGE_SIZE = 100;

interface NocoDBRecord {
  Id: number;
  lead_id?: string;
  name?: string;
  company?: string;
  email?: string;
  status?: string;
  reply_received?: boolean;
  reply_type?: string;
  sdr_name?: string;
  first_outreach_date?: string;
  last_followup_date?: string;
  next_followup_date?: string;
  follow_up_count?: number;
  days_to_reply?: number;
  email_opened?: boolean;
}

interface NocoDBResponse {
  list: NocoDBRecord[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("NOCODB_API_TOKEN");
    if (!apiToken) {
      throw new Error("NOCODB_API_TOKEN missing in Supabase secrets");
    }

    let allRecords: NocoDBRecord[] = [];
    let offset = 0;

    while (true) {
      const url =
        `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records` +
        `?limit=${PAGE_SIZE}&offset=${offset}`;

      const res = await fetch(url, {
        headers: {
          "xc-token": apiToken,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`NocoDB ${res.status}: ${errText}`);
      }

      const data: NocoDBResponse = await res.json();
      const rows = data.list ?? [];

      if (rows.length === 0) break;

      allRecords.push(...rows);

      // Stop when last page reached
      if (rows.length < PAGE_SIZE) break;

      offset += PAGE_SIZE;
    }

    // Normalize for analytics
    const leads = allRecords.map((r) => ({
      id: r.lead_id ?? r.Id.toString(),
      name: r.name ?? "Unknown",
      company: r.company ?? "Unknown",
      email: r.email ?? "",
      status: r.status ?? "new",
      replyReceived: r.reply_received ?? false,
      replyType: r.reply_type ?? null,
      sdrName: r.sdr_name ?? "Unassigned",
      firstOutreachDate: r.first_outreach_date ?? null,
      lastFollowupDate: r.last_followup_date ?? null,
      nextFollowupDate: r.next_followup_date ?? null,
      followUpCount: r.follow_up_count ?? 0,
      daysToReply: r.days_to_reply ?? null,
      emailOpened: r.email_opened ?? false,
    }));

    return new Response(
      JSON.stringify({
        total: leads.length,
        leads,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
        leads: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});