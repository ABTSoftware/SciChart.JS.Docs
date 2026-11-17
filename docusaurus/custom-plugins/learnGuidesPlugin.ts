import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { LoadContext, Plugin } from "@docusaurus/types";

// Reads the front matter of every learning center guide (docs/learn/**/index.md) and makes it available to
// the site as global data, for the "Related guides" cards at the end of each guide (src/components/RelatedGuides.tsx)
// and the "introduce SciChart" card beside the table of contents.
//
// - A guide is an index.md whose folder holds no other index.md. Hubs (docs/learn/index.md and each section's
//   index.md) contain guides, so they are left out.
// - A guide lists related guides by slug (its folder name) in its front matter: `related: [box-plot, histogram]`.
//   An unknown slug fails the build, so a renamed or misspelt guide is caught.
// - The card summary is the front matter `card_summary` if set, otherwise the first sentence of `description`.

export const LEARN_GUIDES_PLUGIN_NAME = "learn-guides";

export type LearnGuide = {
    // Folder name, e.g. "violin-plot". Unique across the learning center
    slug: string;
    // Doc id without "/index", e.g. "learn/chart-types/cartesian/violin-plot"
    id: string;
    // Folder group, e.g. "learn/chart-types/cartesian", for the fallback when a guide lists no related guides
    group: string;
    // Site path without the baseUrl, e.g. "/learn/chart-types/cartesian/violin-plot/"
    permalink: string;
    label: string;
    summary: string;
    image?: string;
    // Small card image, static/img/learn/thumbs/<slug>.webp (480 px wide, a few KB). Falls back to image if missing.
    thumbnail?: string;
    position: number;
    related: string[];
};

export type LearnGuidesData = { guides: LearnGuide[] };

function findIndexFiles(dir: string): string[] {
    const found: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) found.push(...findIndexFiles(full));
        else if (entry.name === "index.md" || entry.name === "index.mdx") found.push(full);
    }
    return found;
}

function firstSentence(text: string): string {
    const match = text.match(/^(.+?[.!?])(\s|$)/);
    return (match ? match[1] : text).trim();
}

export function loadLearnGuides(learnDir: string, docsDir: string): LearnGuide[] {
    const indexFiles = findIndexFiles(learnDir);
    const dirs = indexFiles.map((f) => path.dirname(f));
    const guideFiles = indexFiles.filter((f) => {
        const dir = path.dirname(f);
        return !dirs.some((other) => other !== dir && other.startsWith(dir + path.sep));
    });

    const isProduction = process.env.NODE_ENV === "production";
    const guides: LearnGuide[] = [];
    for (const file of guideFiles) {
        const { data } = matter(fs.readFileSync(file, "utf8"));
        if (isProduction && (data.draft === true || data.unlisted === true)) continue;
        const relDir = path.relative(docsDir, path.dirname(file)).split(path.sep).join("/");
        const related = data.related ?? [];
        if (!Array.isArray(related) || related.some((s) => typeof s !== "string")) {
            throw new Error(`[${LEARN_GUIDES_PLUGIN_NAME}] ${file}: "related" must be a list of guide slugs`);
        }
        guides.push({
            slug: path.basename(relDir),
            id: relDir,
            group: path.dirname(relDir).split(path.sep).join("/"),
            permalink: `/${relDir}/`,
            label: String(data.sidebar_label ?? data.title ?? path.basename(relDir)),
            summary: String(data.card_summary ?? firstSentence(String(data.description ?? ""))),
            image: data.image ? String(data.image) : undefined,
            thumbnail: fs.existsSync(path.join(docsDir, "..", "static", "img", "learn", "thumbs", `${path.basename(relDir)}.webp`))
                ? `/img/learn/thumbs/${path.basename(relDir)}.webp`
                : undefined,
            position: typeof data.sidebar_position === "number" ? data.sidebar_position : 0,
            related
        });
    }
    guides.sort((a, b) => a.group.localeCompare(b.group) || a.position - b.position);

    const bySlug = new Map<string, LearnGuide>();
    for (const g of guides) {
        const existing = bySlug.get(g.slug);
        if (existing) {
            throw new Error(`[${LEARN_GUIDES_PLUGIN_NAME}] Two learn guides share the slug "${g.slug}": ${existing.id} and ${g.id}`);
        }
        bySlug.set(g.slug, g);
    }
    const problems: string[] = [];
    for (const g of guides) {
        for (const slug of g.related) {
            if (slug === g.slug) problems.push(`${g.id}: "related" lists the guide itself (${slug})`);
            else if (!bySlug.has(slug)) problems.push(`${g.id}: "related" lists "${slug}", which is not a learn guide slug`);
        }
    }
    if (problems.length > 0) {
        throw new Error(`[${LEARN_GUIDES_PLUGIN_NAME}] Bad related guides in front matter:\n  - ${problems.join("\n  - ")}`);
    }
    return guides;
}

export default function learnGuidesPlugin(context: LoadContext): Plugin<LearnGuidesData> {
    const docsDir = path.join(context.siteDir, "docs");
    const learnDir = path.join(docsDir, "learn");
    return {
        name: LEARN_GUIDES_PLUGIN_NAME,
        getPathsToWatch() {
            return [path.join(learnDir, "**/index.{md,mdx}")];
        },
        async loadContent() {
            return { guides: loadLearnGuides(learnDir, docsDir) };
        },
        async contentLoaded({ content, actions }) {
            actions.setGlobalData(content);
        }
    };
}
