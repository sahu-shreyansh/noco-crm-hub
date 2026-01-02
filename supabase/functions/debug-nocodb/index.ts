// @supabase/functions/no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOCODB_BASE_URL = "https://app.nocodb.com";
const TABLE_ID = "m7lq2fxiwp128u3";
const VIEW_ID = "vw72ijpqe2aptx4g";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface FetchResult {
    status: number;
    url: string;
    duration: string;
    listLength: number | undefined;
    pageInfo: unknown;
    firstRecord: unknown;
    allFieldNames: string[];
    error?: unknown;
}

interface Results {
    test1_view_default: FetchResult | null;
    test2_view_limit100: FetchResult | null;
    test3_no_view_limit10: FetchResult | null;
    env: { tableId: string; viewId: string };
}

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const apiToken = Deno.env.get("NOCODB_API_TOKEN");
        if (!apiToken) {
            return new Response("Missing NOCODB_API_TOKEN", { status: 500 });
        }

        const results: Results = {
            test1_view_default: null,
            test2_view_limit100: null,
            test3_no_view_limit10: null,
            env: {
                tableId: TABLE_ID,
                viewId: VIEW_ID
            }
        };

        // Helper fetcher
        const fetchNoco = async (params: URLSearchParams): Promise<FetchResult> => {
            const url = new URL(`${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`);
            params.forEach((v, k) => url.searchParams.append(k, v));

            const start = performance.now();
            const res = await fetch(url.toString(), {
                headers: { "xc-token": apiToken },
            });
            const end = performance.now();

            const json = await res.json();
            const firstRec = json.list?.[0];
            return {
                status: res.status,
                url: url.toString().replace(TABLE_ID, '***'),
                duration: `${(end - start).toFixed(2)}ms`,
                listLength: json.list?.length,
                pageInfo: json.pageInfo,
                firstRecord: firstRec,
                allFieldNames: firstRec ? Object.keys(firstRec) : [],
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
        p3.set("limit", "20");
        results.test3_no_view_limit10 = await fetchNoco(p3);

        return new Response(JSON.stringify(results, null, 2), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
