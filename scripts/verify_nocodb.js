
const fs = require('fs');

async function main() {
    try {
        let envText = "";
        try {
            envText = fs.readFileSync(".env", "utf-8");
        } catch (e) {
            console.log("Could not read .env file directly.");
        }

        let token = process.env.NOCODB_API_TOKEN;
        let viteToken = "";

        if (envText) {
            envText.split("\n").forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith("NOCODB_API_TOKEN=")) {
                    token = trimmed.split("=")[1].trim().replace(/(^"|"$)/g, "");
                } else if (trimmed.startsWith("VITE_NOCODB_API_TOKEN=")) {
                    viteToken = trimmed.split("=")[1].trim().replace(/(^"|"$)/g, "");
                }
            });
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
            process.exit(1);
        }

        const NOCODB_BASE_URL = "https://app.nocodb.com";
        const TABLE_ID = "mm7lq2fxiwp128u3";
        const VIEW_ID = "vw72ijpqe2aptx4g";

        const url = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records?viewId=${VIEW_ID}&limit=1`;

        console.log(`\nTesting API Connection via Node.js...`);
        console.log(`URL: ${url}`);

        // Node 18+ has fetch
        const res = await fetch(url, {
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error(`❌ API Error: ${res.status}`);
            console.error(await res.text());
            process.exit(1);
        }

        const data = await res.json();
        console.log("✅ API Connection Successful!");
        console.log("Page Info:", data.pageInfo || "No page info");
        console.log(`Retrieved ${data.list?.length} record(s).`);

    } catch (e) {
        console.error("Script execution error:", e);
        // If fetch is not defined
        if (e.message.includes("fetch is not defined")) {
            console.error("Please use Node.js 18+ or install node-fetch.");
        }
    }
}

main();
