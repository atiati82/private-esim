/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ADMIN_DIR = path.join(ROOT, "src", "app", "admin");

// 1) find all files in /src/app/admin
function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (entry.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) out.push(full);
    }
    return out;
}

// 2) find Link href targets (simple heuristic)
const LINK_REGEX = /<Link[^>]+href={(?:"([^"]+)"|'([^']+)'|`([^`]+)`)}|<Link[^>]+href="([^"]+)"/g;

// 3) check if route exists (filesystem-based for Next.js app router)
function routeExists(href) {
    // ignore external
    if (href.startsWith("http")) return true;

    // remove query/hash
    const clean = href.split("?")[0].split("#")[0];

    // normalize trailing slash
    const normalized = clean.endsWith("/") && clean !== "/" ? clean.slice(0, -1) : clean;

    const parts = normalized.split("/").filter(Boolean);

    // Construct potential file path
    const routeFolder = path.join(ROOT, "src", "app", ...parts);

    // valid if page.tsx exists somewhere for that route
    const pageFile = path.join(routeFolder, "page.tsx");
    const pageFileTs = path.join(routeFolder, "page.ts");

    return fs.existsSync(pageFile) || fs.existsSync(pageFileTs);
}

// 4) enforce: links from dashboard for status filters MUST include query param "status="
function requireStatusParamIfLabelLooksLikeStatus(labelContext, href) {
    const lower = labelContext.toLowerCase();
    const looksLikeStatus =
        lower.includes("draft") ||
        lower.includes("published") ||
        lower.includes("active") ||
        lower.includes("archived");

    if (!looksLikeStatus) return null;
    if (!href.includes("status=")) {
        return `Missing default filter: link looks like status ("${labelContext.trim()}") but has no ?status= : ${href}`;
    }
    return null;
}

function main() {
    const files = walk(ADMIN_DIR);
    const errors = [];

    for (const file of files) {
        const txt = fs.readFileSync(file, "utf8");

        let match;
        while ((match = LINK_REGEX.exec(txt))) {
            const href = match[1] || match[2] || match[3] || match[4] || "";
            const idx = match.index;

            const context = txt.slice(Math.max(0, idx - 80), Math.min(txt.length, idx + 120));

            if (!routeExists(href)) {
                if (!href.includes("${")) {
                    errors.push(`Broken admin route link in ${file} → ${href}`);
                }
            }

            const statusErr = requireStatusParamIfLabelLooksLikeStatus(context, href);
            if (statusErr) {
                errors.push(`Filter contract fail in ${file}: ${statusErr}`);
            }
        }
    }

    if (errors.length) {
        console.error("\n❌ AI Integration Guard FAILED:\n");
        for (const e of errors) console.error(" - " + e);
        console.error("\nFix the issues above. Do not ship partial integrations.\n");
        process.exit(1);
    }

    console.log("✅ AI Integration Guard PASSED (links/routes/filters look consistent).");
}

main();
