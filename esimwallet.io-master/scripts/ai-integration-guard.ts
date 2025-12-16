/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ADMIN_DIR = path.join(ROOT, "src", "app", "admin"); // Adjusted path to src/app/admin

// 1) find all files in /src/app/admin
function walk(dir: string, out: string[] = []) {
    if (!fs.existsSync(dir)) return out; // Safety check if admin dir doesn't exist yet
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
function routeExists(href: string) {
    // ignore external
    if (href.startsWith("http")) return true;

    // remove query/hash
    const clean = href.split("?")[0].split("#")[0];

    // normalize trailing slash
    const normalized = clean.endsWith("/") && clean !== "/" ? clean.slice(0, -1) : clean;

    // map URL -> app route folder
    // /admin/pages -> src/app/admin/pages/page.tsx (or layout.tsx etc)
    // Need to handle /admin mapping to src/app/admin
    // If href is /admin/pages, we want src/app/admin/pages

    const parts = normalized.split("/").filter(Boolean);
    // Assuming routes start with / (root relative)

    // Construct potential file path
    // If we are in src/app structure:
    // /admin -> src/app/admin
    // / -> src/app

    const routeFolder = path.join(ROOT, "src", "app", ...parts);

    // valid if page.tsx exists somewhere for that route
    const pageFile = path.join(routeFolder, "page.tsx");
    const pageFileTs = path.join(routeFolder, "page.ts");

    // Also check for dynamic routes [slug] etc?
    // This simple check might fail for dynamic routes if not handled carefully, 
    // but let's stick to the user's logic for now and refine if needed.
    // Ideally, Next.js routing is complex to match 100% statically without access to build manifest.
    // But strictly looking for file existence on specific paths is a good first step.

    return fs.existsSync(pageFile) || fs.existsSync(pageFileTs);
}

// 4) enforce: links from dashboard for status filters MUST include query param "status="
function requireStatusParamIfLabelLooksLikeStatus(labelContext: string, href: string) {
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
    const errors: string[] = [];

    for (const file of files) {
        const txt = fs.readFileSync(file, "utf8");

        // crude context capture: look for common status button labels near Link (optional)
        // we just take a slice around each match
        let match: RegExpExecArray | null;
        while ((match = LINK_REGEX.exec(txt))) {
            const href = match[1] || match[2] || match[3] || match[4] || "";
            const idx = match.index;

            const context = txt.slice(Math.max(0, idx - 80), Math.min(txt.length, idx + 120));

            // route existence check
            // For dynamic routes and complex cases, this might flag false positives.
            // But we want to be strict for known admin routes.
            if (!routeExists(href)) {
                // Maybe just warn for now or try to be smarter? 
                // Let's assume standard routes. 
                // If it's a dynamic link like `/admin/products/${id}`, this static check will fail because `${id}` is not a folder.
                // We should probably skip strings with template interpolation for the existence check?
                // The regex captures `...` so it might contain ${}.
                if (!href.includes("${")) {
                    errors.push(`Broken admin route link in ${file} → ${href}`);
                }
            }

            // status default filter check (heuristic)
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
