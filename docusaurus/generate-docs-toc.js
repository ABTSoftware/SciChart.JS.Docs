const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const DOCS_DIR = path.join(__dirname, "docs");
const BASE_ROUTE = "/docs";
const TARGET_FILENAMES = ["index.md", "index.mdx", "readme.md", "readme.mdx"];
const CATEGORY_FILE = "_category_.json";

function readCategoryData(dir) {
    const filePath = path.join(dir, CATEGORY_FILE);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(content);
        } catch {
            console.warn(`⚠️ Failed to parse _category_.json in ${dir}`);
            return {};
        }
    }
    return {};
}

function getFileMetadata(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    const title = data.title || body.match(/^# (.+)$/m)?.[1]?.trim() || path.basename(filePath);
    const position = typeof data.sidebar_position === "number" ? data.sidebar_position : null;

    const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/");
    const permalink = `${BASE_ROUTE}/${relativePath.replace(/\.mdx?$/, "").replace(/\/(index|readme)$/i, "")}`;

    return { title, position, permalink };
}

function walkDir(dir) {
    const items = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const category = readCategoryData(fullPath);
            const label = category.label || entry.name;
            const position = typeof category.position === "number" ? category.position : null;
            const children = walkDir(fullPath);

            if (children.length > 0) {
                items.push({
                    type: "folder",
                    title: label,
                    position,
                    children
                });
            }
        }

        if (entry.isFile() && TARGET_FILENAMES.includes(entry.name.toLowerCase())) {
            const { title, position, permalink } = getFileMetadata(fullPath);
            items.push({
                type: "file",
                title,
                position,
                permalink
            });
        }
    }

    // Sort by sidebar_position or fallback to title
    return items.sort((a, b) => {
        const aPos = a.position ?? Infinity;
        const bPos = b.position ?? Infinity;
        if (aPos !== bPos) return aPos - bPos;
        return (a.title || "").localeCompare(b.title || "");
    });
}

function renderMarkdownToc(items, depth = 0) {
    const indent = "  ".repeat(depth);

    return items
        .map(item => {
            if (item.type === "folder") {
                if (item.children.length === 1) {
                    return renderMarkdownToc(item.children, depth); // flatten if only one child
                } else {
                    return `${indent}- **${item.title}**\n${renderMarkdownToc(item.children, depth + 1)}`;
                }
            } else if (item.type === "file") {
                return `${indent}- [${item.title}](${item.permalink})`;
            }
            return "";
        })
        .join("\n");
}

function saveMarkdownToc(items) {
    const output = `# Global Table of Contents\n\n${renderMarkdownToc(items)}\n`;
    const outputPath = path.join(
        __dirname,
        "docs",
        "user-manual",
        "scichart-js-javascript-charts-user-manual",
        "index.md"
    );
    const newContent = `<!-- generate-docs-toc.js start -->
${output}
<!-- generate-docs-toc.js end -->`;

    // Read the file
    fs.readFile(outputPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // Regex to find content between the markers
        const regex = /<!-- generate-docs-toc.js start -->[\s\S]*?<!-- generate-docs-toc.js end -->/g;

        // Replace the content
        const updatedContent = data.replace(regex, newContent);

        // Write back to the file
        fs.writeFile(outputPath, updatedContent, "utf8", err => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log("Table of content updated successfully!");
        });
    });
}

// Run
const tocItems = walkDir(DOCS_DIR);
saveMarkdownToc(tocItems);
