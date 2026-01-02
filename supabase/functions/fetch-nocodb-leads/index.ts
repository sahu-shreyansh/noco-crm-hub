import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const NOCODB_BASE_URL = "https://app.nocodb.com";
const TABLE_ID = "m7lq2fxiwp128u3";
const VIEW_ID = "vw72ijpqe2aptx4g";
const PAGE_SIZE = 100;

// Matches actual NocoDB field names
interface NocoDBRecord {
  Id: number;
  nc_order?: number;
  timestamp?: string;
  fullName?: string;
  jobTitle?: string;
  company?: string;
  phone1?: string;
  phone2?: string;
  email1?: string;
  "email verification"?: string | null;
  email2?: string;
  website?: string;
  address?: string;
  notes?: string;
  confidence?: string;
  rawText?: string;
  fileName?: string;
  fileId?: string;
  fileLink?: string;
  status?: string;
  emailBody?: string;
}

interface NocoDBResponse {
  list: NocoDBRecord[];
  pageInfo?: {
    totalRows?: number;
    page?: number;
    pageSize?: number;
    isLastPage?: boolean;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("NOCODB_API_TOKEN");
    if (!apiToken) {
      console.error("Missing NOCODB_API_TOKEN");
      throw new Error("NOCODB_API_TOKEN missing");
    }

    let allRecords: NocoDBRecord[] = [];
    let offset = 0;
    let page = 1;
    let keepFetching = true;

    console.log(`[Fetch-Leads] START. View: ${VIEW_ID}, PageSize: ${PAGE_SIZE}`);

    while (keepFetching) {
      const url = new URL(`${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`);
      url.searchParams.set("viewId", VIEW_ID);
      url.searchParams.set("limit", PAGE_SIZE.toString());
      url.searchParams.set("offset", offset.toString());

      console.log(`[Fetch-Leads] Fetching page ${page} (offset ${offset})...`);

      const res = await fetch(url.toString(), {
        headers: {
          "xc-token": apiToken,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`[Fetch-Leads] API Error: ${res.status} ${err}`);
        throw new Error(`NocoDB API Error ${res.status}: ${err}`);
      }

      const data: NocoDBResponse = await res.json();
      const rows = data.list || [];
      const info = data.pageInfo || {};

      console.log(`[Fetch-Leads] Page ${page}: fetched ${rows.length} rows. Total so far: ${allRecords.length + rows.length}`);

      if (rows.length > 0) {
        allRecords.push(...rows);
      }

      // Pagination logic
      if (rows.length === 0 || info.isLastPage === true || rows.length < PAGE_SIZE) {
        keepFetching = false;
        break;
      }

      // Safety limit
      if (allRecords.length >= 10000) {
        console.warn("[Fetch-Leads] Safety limit 10k reached.");
        keepFetching = false;
        break;
      }

      offset += PAGE_SIZE;
      page++;
    }

    console.log(`[Fetch-Leads] DONE. Total records: ${allRecords.length}`);

    // Map NocoDB status values to our Lead status types
    const mapStatus = (status?: string): string => {
      if (!status) return "new";
      const s = status.toLowerCase();
      if (s === "sent" || s === "contacted") return "contacted";
      if (s === "replied" || s === "response") return "replied";
      if (s === "positive" || s === "interested") return "positive";
      if (s === "meeting" || s === "scheduled") return "meeting";
      if (s === "closed" || s === "won" || s === "converted") return "closed";
      if (s === "negative" || s === "rejected" || s === "not interested") return "replied";
      return "new";
    };

    // Transform records to Lead format for frontend
    const leads = allRecords.map((r) => ({
      id: r.Id?.toString() || crypto.randomUUID(),
      name: r.fullName || "Unknown",
      company: r.company || "Unknown",
      email: r.email1 || r.email2 || "",
      jobTitle: r.jobTitle || "",
      phone: r.phone1 || r.phone2 || "",
      website: r.website || "",
      address: r.address || "",
      notes: r.notes || "",
      
      // Status mapping
      status: mapStatus(r.status),
      rawStatus: r.status || "new",
      
      // Outreach tracking - if status is "SENT" or has emailBody, outreach was sent
      outreach_sent: !!r.status && r.status.toLowerCase() !== "new",
      
      // Reply tracking - infer from status
      reply_received: ["replied", "positive", "meeting", "closed", "response", "interested"].includes((r.status || "").toLowerCase()),
      reply_type: null as string | null, // NocoDB doesn't have this field, will be null
      
      // SDR/Timestamps
      sdr_name: "Team", // NocoDB doesn't have SDR field
      first_outreach_date: r.timestamp || null,
      last_followup_date: null as string | null,
      next_followup_date: null as string | null,
      followup_count: r.status?.toLowerCase() === "sent" ? 1 : 0,
      days_to_reply: null as number | null,
      email_opened: false,
      
      // Extra fields from NocoDB
      confidence: r.confidence ? parseFloat(r.confidence) : null,
      fileLink: r.fileLink || null,
      emailBody: r.emailBody || null,
    }));

    return new Response(
      JSON.stringify({
        total: leads.length,
        leads,
        debug: {
          fetched: leads.length,
          provider: "NocoDB",
          viewId: VIEW_ID,
          sampleStatuses: [...new Set(allRecords.map(r => r.status).filter(Boolean))].slice(0, 10)
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (e) {
    console.error("[Fetch-Leads] Exception:", e);
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
