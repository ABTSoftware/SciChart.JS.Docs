import fs from "fs";
import path from "path";

/**
 * ADD trailing slashes to internal markdown links.
 * Example: [Link](/my/path) -> [Link](/my/path/)
 */
const DOCS_DIR = path.join(process.cwd(), "docs");

function fixLinksInMarkdown(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    const updated = content.replace(
        /]\((\/[^\s)#?]+)\)/g, // match ](/path)
        (match, p1) => {
            if (p1 === "/") return match;
            if (p1.endsWith("/")) return match;
            if (/\.(png|jpg|jpeg|gif|svg|md|js|ts|pdf|ico|zip)$/i.test(p1)) {
                return match;
            }
            return `](${p1}/)`;
        }
    );

    if (updated !== content) {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log("Fixed:", filePath);
    }
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
            fixLinksInMarkdown(fullPath);
        }
    }
}

console.log("Adding trailing slashes to internal markdown links...");
walk(DOCS_DIR);
console.log("Done!");
