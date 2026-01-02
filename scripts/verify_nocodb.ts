
try {
    let envText = "";
    try {
        envText = await Deno.readTextFile(".env");
    } catch (e) {
        console.log("Could not read .env file directly.");
    }

    let token = Deno.env.get("NOCODB_API_TOKEN");
    let viteToken = "";

    if (envText) {
        for (const line of envText.split("\n")) {
            const trimmed = line.trim();
            if (trimmed.startsWith("NOCODB_API_TOKEN=")) {
                token = trimmed.split("=")[1].trim().replace(/(^"|"$)/g, "");
            } else if (trimmed.startsWith("VITE_NOCODB_API_TOKEN=")) {
                viteToken = trimmed.split("=")[1].trim().replace(/(^"|"$)/g, "");
            }
        }
    }

    if (token) {
        console.log("✅ Found NOCODB_API_TOKEN.");
    } else if (viteToken) {
        console.log("⚠️  Found VITE_NOCODB_API_TOKEN but NO NOCODB_API_TOKEN.");
        console.log("   The Edge Function uses 'NOCODB_API_TOKEN', so it will likely fail unless you set that variable.");
        console.log("   Using VITE_NOCODB_API_TOKEN for this test...");
        token = viteToken;
    } else {
        console.error("❌ No API token found in .env (looked for NOCODB_API_TOKEN or VITE_NOCODB_API_TOKEN).");
        Deno.exit(1);
    }

    const NOCODB_BASE_URL = "https://app.nocodb.com";
    // IDs from the file
    const TABLE_ID = "mm7lq2fxiwp128u3";
    const VIEW_ID = "vw72ijpqe2aptx4g";

    const url = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records?viewId=${VIEW_ID}&limit=1`;

    console.log(`\nTesting API Connection...`);
    console.log(`URL: ${url}`);

    const res = await fetch(url, {
        headers: {
            "xc-token": token,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        console.error(`❌ API Error: ${res.status}`);
        console.error(await res.text());
        Deno.exit(1);
    }

    const data = await res.json();
    console.log("✅ API Connection Successful!");
    console.log("Page Info:", data.pageInfo);
    console.log(`Retrieved ${data.list?.length} record(s).`);

} catch (e) {
    console.error("Script execution error:", e);
}
