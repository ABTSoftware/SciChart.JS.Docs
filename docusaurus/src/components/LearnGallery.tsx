import React from "react";
import { useLearnGuides, type LearnGuide } from "./learnGuides";
import { GuideCard } from "./RelatedGuides";
import styles from "./RelatedGuides.module.css";

// A gallery of learning center guides as thumbnail cards, for the hub pages (docs/learn/index.md).
// Card details (title, summary, thumbnail) come from each guide's front matter, via the learn-guides plugin.
//
// Pick the guides in one of two ways:
// - group: every guide directly in a folder, e.g. group="learn/axes-and-scales". Sorted by sidebar label,
//   so a new guide appears in the gallery without editing the hub.
// - slugs: a list of guide slugs (folder names), shown in the order given. For galleries that don't follow
//   the folders, such as the chart type groups. An unknown slug fails the production build, so a renamed guide
//   is caught. On the dev server it is skipped with a console warning instead, because the guide list can be
//   briefly out of date while the server reloads, and one missing card shouldn't crash the whole page.

type Props = { group?: string; slugs?: string[] };

function pickGuides(guides: LearnGuide[], { group, slugs }: Props): LearnGuide[] {
    if (slugs) {
        return slugs.flatMap((slug) => {
            const guide = guides.find((g) => g.slug === slug);
            if (guide) return [guide];
            const message = `LearnGallery: "${slug}" is not a learn guide slug`;
            if (process.env.NODE_ENV === "production") throw new Error(message);
            console.warn(message);
            return [];
        });
    }
    if (group) {
        return guides.filter((g) => g.group === group).sort((a, b) => a.label.localeCompare(b.label));
    }
    throw new Error("LearnGallery: set either group or slugs");
}

export default function LearnGallery(props: Props) {
    const picks = pickGuides(useLearnGuides(), props);
    if (picks.length === 0) return null;
    return (
        <ul className={`${styles.grid} ${styles.gallery}`}>
            {picks.map((g) => (
                <GuideCard key={g.slug} guide={g} ctaPrefix="learn-hub" />
            ))}
        </ul>
    );
}
