// @supabase/functions/no-verify-jwt
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

      // Some versions of NocoDB might respect 'p' or 'pageSize' or 'page'
      // Adding them defensively; NocoDB usually ignores extras but it helps if version mismatch
      // url.searchParams.set("page", page.toString()); // Intentionally omitting to rely on offset+limit

      console.log(`[Fetch-Leads] Fetching URL: ${url.toString().replace(TABLE_ID, '***')}`);

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

      console.log(`[Fetch-Leads] Page ${page} (Offset ${offset}): fetched ${rows.length} rows.`);
      if (info.totalRows !== undefined) {
        console.log(`[Fetch-Leads] Meta: totalRows=${info.totalRows}, isLastPage=${info.isLastPage}`);
      }

      if (rows.length > 0) {
        allRecords.push(...rows);
      }

      // Pagination Logic
      // 1. If we got 0 rows, we are definitely done
      if (rows.length === 0) {
        keepFetching = false;
        break;
      }

      // 2. If 'isLastPage' is explicitly true, trust it
      if (info.isLastPage === true) {
        console.log("[Fetch-Leads] isLastPage=true detected. Stopping.");
        keepFetching = false;
        break;
      }

      // 3. Fallback: if rows < limit, assume end
      if (rows.length < PAGE_SIZE) {
        console.log(`[Fetch-Leads] Rows (${rows.length}) < Limit (${PAGE_SIZE}). Assuming end.`);
        keepFetching = false;
        break;
      }

      // 4. Safety: Max records
      if (allRecords.length >= 10000) {
        console.warn("[Fetch-Leads] Safety limit 10k reached.");
        keepFetching = false;
        break;
      }

      offset += PAGE_SIZE;
      page++;
    }

    console.log(`[Fetch-Leads] DONE. Total records: ${allRecords.length}`);

    // Normalization
    const leads = allRecords.map((r) => ({
      id: r.lead_id || r.Id?.toString() || crypto.randomUUID(),
      name: r.name || "Unknown",
      company: r.company || "Unknown",
      email: r.email || "",
      status: r.status || "new",
      replyReceived: r.reply_received ?? false,
      replyType: r.reply_type || null,
      sdrName: r.sdr_name || "Unassigned",
      firstOutreachDate: r.first_outreach_date || null,
      lastFollowupDate: r.last_followup_date || null,
      nextFollowupDate: r.next_followup_date || null,
      followUpCount: r.follow_up_count || 0,
      daysToReply: r.days_to_reply || null,
      emailOpened: r.email_opened ?? false,
    }));

    return new Response(
      JSON.stringify({
        total: leads.length,
        leads,
        // Returning debug info in response for user visibility
        debug: {
          fetched: leads.length,
          provider: "NocoDB",
          viewId: VIEW_ID
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


