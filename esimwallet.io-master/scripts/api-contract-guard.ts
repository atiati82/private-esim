/* eslint-disable no-console */
import process from "node:process";

const BASE = process.env.BASE_URL || "http://localhost:3000";

type Check = { name: string; url: string; expectKeys: string[] };

const checks: Check[] = [
    { name: "Admin Pages list", url: `${BASE}/api/admin/pages`, expectKeys: ["items"] },
    { name: "Admin Products list", url: `${BASE}/api/admin/products`, expectKeys: ["items"] },
];

async function main() {
    const failures: string[] = [];

    console.log(`Checking API contracts against ${BASE}...`);

    for (const c of checks) {
        try {
            const res = await fetch(c.url);
            if (!res.ok) {
                // Only fail if it's 404 or 500, maybe 401/403 is okay if we are not auth'd?
                // But this is meant to be run in a dev env or CI where we can access it.
                failures.push(`${c.name}: HTTP ${res.status} (${c.url})`);
                continue;
            }
            const json = await res.json();
            for (const k of c.expectKeys) {
                if (!(k in json)) failures.push(`${c.name}: missing key "${k}" in response`);
            }
            if (!Array.isArray(json.items)) failures.push(`${c.name}: "items" is not an array`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            failures.push(`${c.name}: Network/Parse error - ${msg}`);
        }
    }

    if (failures.length) {
        console.error("\n❌ API Contract Guard FAILED:\n");
        failures.forEach((f) => console.error(" - " + f));
        process.exit(1);
    }

    console.log("✅ API Contract Guard PASSED.");
}

main();
