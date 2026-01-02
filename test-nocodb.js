
const NOCODB_BASE_URL = "https://app.nocodb.com";
const TABLE_ID = "m7lq2fxiwp128u3";
const VIEW_ID = "vw72ijpqe2aptx4g";
const API_TOKEN = "cNX5C7FYuJ7u3_L8AGP1AP3G0KBiPyhGBSQww8bQ";

async function test() {
    const url = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records?viewId=${VIEW_ID}&limit=1`;
    try {
        const res = await fetch(url, {
            headers: {
                "xc-token": API_TOKEN,
                "Content-Type": "application/json"
            }
        });
        console.log("STATUS_CODE:" + res.status);
        if (res.status !== 200) {
            const text = await res.text();
            console.log("ERROR_BODY:" + text.substring(0, 100));
        }
    } catch (e) {
        console.log("EXCEPTION:" + e.message);
    }
}

test();
