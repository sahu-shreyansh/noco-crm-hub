// Direct NocoDB tester (Node)
// Usage (PowerShell):
//   # set token in session or ensure .env at repo root contains NOCODB_API_TOKEN
//   $env:NOCODB_API_TOKEN = "<token>"; node scripts/test_nocodb_direct.js
// Notes: Node 18+ is recommended (global fetch available). This script will try to read .env if token not set.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function loadEnvFile(envPath) {
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    for (const l of lines) {
      const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.*))\s*$/);
      if (m) {
        const key = m[1];
        const val = m[2] ?? m[3] ?? m[4] ?? '';
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch (e) {
    // ignore
  }
}

(async function main() {
  // Try load .env in repo root
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '..');
  const envPath = path.join(repoRoot, '.env');
  if (!process.env.NOCODB_API_TOKEN) loadEnvFile(envPath);

  const apiToken = process.env.NOCODB_API_TOKEN;
  if (!apiToken) {
    console.error('Missing NOCODB_API_TOKEN. Set env or add to .env in repo root.');
    process.exit(2);
  }

  // Defaults taken from supabase/functions/fetch-nocodb-leads/index.ts
  const baseUrl = process.env.NOCODB_BASE_URL || 'https://app.nocodb.com';
  const tableId = process.env.NOCODB_TABLE_ID || 'm7lq2fxiwp128u3';
  const viewId = process.env.NOCODB_VIEW_ID || 'vw72ijpqe2aptx4g';

  const url = `${baseUrl}/api/v2/tables/${tableId}/records?viewId=${viewId}&limit=10`;

  console.log('Calling NocoDB URL (redacted):', url.replace(tableId, '***'));

  try {
    const res = await fetch(url, {
      headers: {
        'xc-token': apiToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('HTTP status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Body JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Body text:', text);
    }

    if (!res.ok) process.exit(3);
    process.exit(0);
  } catch (err) {
    console.error('Request failed:', err && err.message ? err.message : err);
    process.exit(4);
  }
})();
