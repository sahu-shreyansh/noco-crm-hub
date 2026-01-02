# Debugging NocoDB Edge Function non-2xx responses

This note contains quick steps to diagnose why a deployed or local Edge/Supabase Function that talks to NocoDB returns a non-2xx status.

1) Reproduce the failure from your machine

PowerShell example (call your locally-running Deno function):

```powershell
 # ensure token is available to the function when running locally
 # $env:NOCODB_API_TOKEN = "<your-token>"

 # run the function with Deno (from repo root)
 deno run --allow-net --allow-env supabase/functions/debug-nocodb/index.ts

 # In another shell, call the function
 # $env:NOCODB_FUNCTION_URL = "http://localhost:8000/"
 node scripts/test_nocodb.js
```

Or call your deployed Supabase function URL (no token in client request required if function uses server-side secret):

```powershell
 # $env:NOCODB_FUNCTION_URL = "https://<project>.supabase.co/functions/v1/fetch-nocodb-leads"
 node scripts/test_nocodb.js
```

2) Inspect the HTTP response and body

- The `scripts/test_nocodb.js` script prints status and the response body (JSON or text). If the function returned 500, the body usually contains the error message (see `debug` properties in `fetch-nocodb-leads`).
- If the body is empty or opaque, check function logs.

3) Check function logs

- If you're using Supabase: open the Supabase dashboard -> Functions -> select the function -> Logs. Look for exceptions or messages like "Missing NOCODB_API_TOKEN".
- If you run the Deno file locally, you'll see console.log output in the same terminal where Deno is running.

4) Common causes and fixes

- Missing/incorrect NOCODB_API_TOKEN in the environment (most common). Ensure the function has the secret configured in the deployment environment. Locally, set $env:NOCODB_API_TOKEN before running Deno. In Supabase, use Project settings -> Environment variables or `supabase secrets set`.
- CORS or missing OPTIONS handling — both functions include simple CORS headers and handle OPTIONS; ensure your client is not blocked by browser CORS errors (look in browser console).
- Wrong endpoint/path — confirm you're calling the function URL exactly as deployed (path and case-sensitive name).
- NocoDB API errors — token may be revoked or NocoDB table/view IDs changed. The function prints the API error response; inspect the body for details.

5) Quick checks to run now

- Use `node scripts/test_nocodb.js` against your running function to get the status and body.
- If you see an error message like `Missing NOCODB_API_TOKEN`, set it and re-run.

6) If you want, I can:

- Add extra logging in `supabase/functions/fetch-nocodb-leads/index.ts` to surface the error body in responses.
- Create a small server-side wrapper to run tests in Node instead of Deno.

If you'd like, tell me whether you want me to (A) add logging changes to the function, (B) create a Node-based NocoDB tester that calls NocoDB directly (requires NOCODB_API_TOKEN locally), or (C) help set the secret in Supabase via CLI instructions.
