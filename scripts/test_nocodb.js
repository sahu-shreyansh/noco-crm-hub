// Simple Node script to call a NocoDB-related Edge/Supabase Function and print status + body
// Usage (PowerShell):
//   $env:NOCODB_FUNCTION_URL = "http://localhost:8000/"; node scripts/test_nocodb.js
// Or for deployed Supabase function:
//   $env:NOCODB_FUNCTION_URL = "https://<project>.supabase.co/functions/v1/fetch-nocodb-leads"; node scripts/test_nocodb.js

const url = process.env.NOCODB_FUNCTION_URL || 'http://localhost:8000/';
const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

console.log(`Calling function URL: ${url}`);

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

(async () => {
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    const bodyText = await res.text();

    console.log('HTTP status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));

    try {
      const parsed = JSON.parse(bodyText);
      console.log('Body (JSON):', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Body (text):', bodyText);
    }

    if (!res.ok) process.exit(2);
    process.exit(0);
  } catch (err) {
    console.error('Request failed:', err?.message || err);
    process.exit(3);
  } finally {
    clearTimeout(timer);
  }
})();
