// Regroups the learning center's Applications guides by sector in the sidebar. The Machine Learning and Signal
// Processing guides live in sub-folders of Applications (/learn/applications/machine-learning/<slug>/ and
// /learn/applications/signal-processing/<slug>/) and each sub-folder is shown as a sector as it is, in its own order.
// Only the sidebar tree changes: folders, doc ids and URLs stay as they are.
//
// Everything else in the docs sidebar is still generated from the folder structure. To file a new Applications
// guide under a sector, add its folder name to APPLICATION_SECTORS below. A guide that isn't listed still appears,
// in an "Other applications" group, so nothing goes missing from the sidebar.
//
// A sector can also list guides that live in another section, by reference (REFERENCED_GUIDES): the guide stays in its
// own section and keeps its URL, and also appears in the sector (e.g. the footprint, renko and tick charts under Finance and Trading).
//
// Order: sectors alphabetically; guides within a sector alphabetically by label.

type Item = any;
type GeneratorArgs = { defaultSidebarItemsGenerator: (args: any) => Promise<Item[]> | Item[] } & Record<string, any>;

const LEARN_INDEX = "learn/index";
const APPLICATIONS_INDEX = "learn/applications/index";
// Sub-folders of Applications shown as whole sectors: folder name -> sector label
const SUBFOLDER_SECTORS: Record<string, string> = {
    "machine-learning": "Machine Learning",
    "signal-processing": "Signal Processing"
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
    "stochastic-oscillator": "Finance and Trading",
    "volume-profile": "Finance and Trading",
    vwap: "Finance and Trading",
    "area-between-curves": "Science and Mathematics",
    "derivatives-and-integrals": "Science and Mathematics",
    "hr-diagram": "Science and Mathematics",
    "polar-curves": "Science and Mathematics",
    "riemann-hypothesis": "Science and Mathematics",
    "non-destructive-testing": "Test and Measurement",
    oscilloscope: "Test and Measurement",
    "stress-strain-curve": "Test and Measurement",
    "vibration-analysis": "Test and Measurement"
};

/** Guides from other sections also listed in a sector, by doc id (they keep their own section and URL). */
export const REFERENCED_GUIDES: Record<string, string> = {
    "learn/chart-types/cartesian/footprint-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/renko-chart/index": "Finance and Trading",
    "learn/chart-types/cartesian/tick-chart/index": "Finance and Trading"
};

const linkId = (item: Item): string | undefined => (item?.type === "category" ? item.link?.id : undefined);
const itemLabel = (item: Item): string => item.label ?? item.id ?? "";

/** Doc id without a trailing "/index", so "a/b/index" and "a/b" match. */
const baseId = (id: string): string => id.replace(/\/index$/, "");

/** Doc id of the first doc inside a sidebar item (the item itself, its link, or its first descendant). */
function firstDocId(item: Item): string {
    if (item?.type === "doc") return item.id;
    if (item?.type === "category") return linkId(item) ?? (item.items?.length ? firstDocId(item.items[0]) : "");
    return "";
}

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
    if (!applications) return learnItems;

    const groups = new Map<string, Item[]>();
    const subfolderSectors: Item[] = [];
    for (const item of applications.items as Item[]) {
        const folder = firstDocId(item).replace(/^learn\/applications\//, "").split("/")[0];
        if (item.type === "category" && !linkId(item) && folder in SUBFOLDER_SECTORS) {
            subfolderSectors.push({ ...item, label: SUBFOLDER_SECTORS[folder] });
            continue;
        }
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
    sectors.push(...subfolderSectors);

    sectors.sort((a, b) => {
        // "Other applications" always goes last
        if (a.label === OTHER_SECTOR) return 1;
        if (b.label === OTHER_SECTOR) return -1;
        return a.label.localeCompare(b.label, "en");
    });

    return learnItems.map((i) => (i === applications ? { ...applications, items: sectors } : i));
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
