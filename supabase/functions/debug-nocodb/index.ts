// @supabase/functions/no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOCODB_BASE_URL = "https://app.nocodb.com";
const TABLE_ID = "mqr3ezrainoyq9p";
const VIEW_ID = "vwx7stc4s2q57zoa";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const apiToken = Deno.env.get("NOCODB_API_TOKEN");
        if (!apiToken) {
            return new Response("Missing NOCODB_API_TOKEN", { status: 500 });
        }

        const results = {
            test1_view_default: null,
            test2_view_limit100: null,
            test3_no_view_limit10: null,
            env: {
                tableId: TABLE_ID,
                viewId: VIEW_ID
            }
        };

        // Helper fetcher
        const fetchNoco = async (params: URLSearchParams) => {
            const url = new URL(`${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`);
            params.forEach((v, k) => url.searchParams.append(k, v));

            const start = performance.now();
            const res = await fetch(url.toString(), {
                headers: { "xc-token": apiToken },
            });
            const end = performance.now();

            const json = await res.json();
            return {
                status: res.status,
                url: url.toString().replace(TABLE_ID, '***'), // redact
                duration: `${(end - start).toFixed(2)}ms`,
                listLength: json.list?.length,
                pageInfo: json.pageInfo,
                firstRecId: json.list?.[0]?.Id,
                error: !res.ok ? json : undefined
            };
        };

        // TEST 1: View Normal
        const p1 = new URLSearchParams();
        p1.set("viewId", VIEW_ID);
        results.test1_view_default = await fetchNoco(p1);

        // TEST 2: View + Limit
        const p2 = new URLSearchParams();
        p2.set("viewId", VIEW_ID);
        p2.set("limit", "100");
        results.test2_view_limit100 = await fetchNoco(p2);

        // TEST 3: Raw Table (No view)
        const p3 = new URLSearchParams();
        p3.set("limit", "20"); // Check if table has more than 14 records total
        results.test3_no_view_limit10 = await fetchNoco(p3);

        return new Response(JSON.stringify(results, null, 2), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
