// Regroups the learning center's Applications guides by sector in the sidebar, and shows the Machine Learning and
// Signal Processing sections as sectors too. Only the sidebar tree changes: folders, doc ids and URLs stay as they are
// (/learn/applications/<slug>/, /learn/machine-learning/<slug>/ and /learn/signal-processing/<slug>/).
//
// Everything else in the docs sidebar is still generated from the folder structure. To file a new Applications
// guide under a sector, add its folder name to APPLICATION_SECTORS below. A guide that isn't listed still appears,
// in an "Other applications" group, so nothing goes missing from the sidebar.
//
// A sector can also list guides that live in another section, by reference (REFERENCED_GUIDES): the guide stays in its
// own section and keeps its URL, and also appears in the sector (e.g. the financial chart types under Finance and Trading).
//
// Order: sectors alphabetically; guides within a sector alphabetically by label.

type Item = any;
type GeneratorArgs = { defaultSidebarItemsGenerator: (args: any) => Promise<Item[]> | Item[] } & Record<string, any>;

const LEARN_INDEX = "learn/index";
const APPLICATIONS_INDEX = "learn/applications/index";
// Whole learning center sections shown as sectors inside Applications: section hub doc id -> sector label
const SECTIONS_AS_SECTORS: Record<string, string> = {
    "learn/machine-learning/index": "Machine Learning",
    "learn/signal-processing/index": "Signal Processing"
};
const OTHER_SECTOR = "Other applications";

/** Sector label for each Applications guide, by folder name under docs/learn/applications/. */
export const APPLICATION_SECTORS: Record<string, string> = {
    "antenna-radiation-pattern": "Aerospace and Defence",
    telemetry: "Aerospace and Defence",
    "kpi-dashboard": "Business",
    "hmi-scada": "Industrial and Energy",
    "pid-control": "Industrial and Energy",
    "power-quality": "Industrial and Energy",
    chromatogram: "Life Sciences",
    "mass-spectrum": "Life Sciences",
    spectroscopy: "Life Sciences",
    "capnography-pulse-oximetry": "Medical",
    ecg: "Medical",
    "motorsport-telemetry": "Motorsport",
    "drawdown-and-equity-curve": "Finance and Trading",
    "market-depth": "Finance and Trading",
    "options-payoff-diagram": "Finance and Trading",
    "volatility-surface": "Finance and Trading",
    "hr-diagram": "Science and Mathematics",
    "riemann-hypothesis": "Science and Mathematics",
    "non-destructive-testing": "Test and Measurement",
    oscilloscope: "Test and Measurement",
    "stress-strain-curve": "Test and Measurement",
    "vibration-analysis": "Test and Measurement"
};

/** Guides from other sections also listed in a sector, by doc id (they keep their own section and URL). */
export const REFERENCED_GUIDES: Record<string, string> = {
    "learn/chart-types/cartesian/candlestick-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/footprint-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/ohlc-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/renko-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/tick-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/waterfall-chart/index": "Finance and Trading"
};

const linkId = (item: Item): string | undefined => (item?.type === "category" ? item.link?.id : undefined);
const itemLabel = (item: Item): string => item.label ?? item.id ?? "";

/** Doc id without a trailing "/index", so "a/b/index" and "a/b" match. */
const baseId = (id: string): string => id.replace(/\/index$/, "");

/**
 * Finds the sidebar entries for referenced guides anywhere in the tree, so their labels and real doc ids can be reused.
 * A guide can appear as a doc item or as a category whose link is the guide.
 */
function findDocs(items: Item[], ids: Set<string>, found: Map<string, { id: string; label: string }> = new Map()) {
    for (const item of items) {
        if (item?.type === "doc" && ids.has(baseId(item.id))) found.set(baseId(item.id), { id: item.id, label: item.label });
        if (item?.type === "category") {
            const link = linkId(item);
            if (link && ids.has(baseId(link))) found.set(baseId(link), { id: link, label: item.label });
            findDocs(item.items, ids, found);
        }
    }
    return found;
}

function regroupApplications(learnItems: Item[]): Item[] {
    const applications = learnItems.find((i) => linkId(i) === APPLICATIONS_INDEX);
    const sections = learnItems.filter((i) => (linkId(i) ?? "") in SECTIONS_AS_SECTORS);
    if (!applications) return learnItems;

    const groups = new Map<string, Item[]>();
    for (const item of applications.items as Item[]) {
        const id: string = item.type === "doc" ? item.id : (linkId(item) ?? "");
        const folder = id.replace(/^learn\/applications\//, "").split("/")[0];
        const sector = APPLICATION_SECTORS[folder] ?? OTHER_SECTOR;
        if (!groups.has(sector)) groups.set(sector, []);
        groups.get(sector)!.push(item);
    }

    // Guides listed by reference: a "ref" item links to the doc without moving it out of its own section
    const referenced = findDocs(learnItems, new Set(Object.keys(REFERENCED_GUIDES).map(baseId)));
    for (const [id, sector] of Object.entries(REFERENCED_GUIDES)) {
        const doc = referenced.get(baseId(id));
        if (!doc) continue;
        if (!groups.has(sector)) groups.set(sector, []);
        groups.get(sector)!.push({ type: "ref", id: doc.id, label: doc.label });
    }
    for (const items of groups.values()) items.sort((a, b) => itemLabel(a).localeCompare(itemLabel(b), "en"));

    const sectors: Item[] = [...groups.entries()].map(([label, items]) => ({
        type: "category",
        label,
        collapsed: true,
        collapsible: true,
        items
    }));
    for (const section of sections) sectors.push({ ...section, label: SECTIONS_AS_SECTORS[linkId(section)!] });

    sectors.sort((a, b) => {
        // "Other applications" always goes last
        if (a.label === OTHER_SECTOR) return 1;
        if (b.label === OTHER_SECTOR) return -1;
        return a.label.localeCompare(b.label, "en");
    });

    return learnItems
        .filter((i) => !sections.includes(i))
        .map((i) => (i === applications ? { ...applications, items: sectors } : i));
}

function walk(items: Item[]): Item[] {
    return items.map((item) => {
        if (item?.type !== "category") return item;
        if (linkId(item) === LEARN_INDEX) return { ...item, items: regroupApplications(item.items) };
        return { ...item, items: walk(item.items) };
    });
}

export default async function learnSidebarGenerator(args: GeneratorArgs): Promise<Item[]> {
    const items = await args.defaultSidebarItemsGenerator(args);
    return walk(items);
}
