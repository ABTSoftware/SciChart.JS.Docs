import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useCurrentLearnGuide, useLearnGuides, type LearnGuide } from "./learnGuides";
import styles from "./RelatedGuides.module.css";

// "Related guides" cards at the end of every learning center guide (not the hubs, not the other docs).
// Rendered automatically by src/theme/DocItem/Content. Each guide lists its related guides by slug in its
// front matter (`related: [box-plot, density-plot, histogram]`); with none listed, the next guides in the
// same group are shown. Card details come from the guides' own front matter, via the learn-guides plugin.

const MAX_CARDS = 4;
const FALLBACK_CARDS = 3;

function pickRelated(current: LearnGuide, guides: LearnGuide[]): LearnGuide[] {
    if (current.related.length > 0) {
        return current.related
            .map((slug) => guides.find((g) => g.slug === slug))
            .filter((g): g is LearnGuide => !!g)
            .slice(0, MAX_CARDS);
    }
    // Fallback: the guides after this one in its group, wrapping round to the start
    const siblings = guides.filter((g) => g.group === current.group);
    const at = siblings.findIndex((g) => g.slug === current.slug);
    const ordered = [...siblings.slice(at + 1), ...siblings.slice(0, at)];
    return ordered.slice(0, FALLBACK_CARDS);
}

function GuideCard({ guide }: { guide: LearnGuide }) {
    const image = useBaseUrl(guide.thumbnail ?? guide.image ?? "/img/Default-Social-Image.jpg");
    return (
        <li className={styles.item}>
            <Link className={styles.card} to={guide.permalink} data-cta={`learn-related-${guide.slug}`}>
                <img className={styles.image} src={image} alt="" width={480} height={252} loading="lazy" decoding="async" />
                <span className={styles.body}>
                    <span className={styles.title}>{guide.label}</span>
                    <span className={styles.summary}>{guide.summary}</span>
                </span>
            </Link>
        </li>
    );
}

export default function RelatedGuides() {
    const current = useCurrentLearnGuide();
    const guides = useLearnGuides();
    if (!current) return null;
    const picks = pickRelated(current, guides);
    if (picks.length === 0) return null;
    return (
        <section className={styles.related} aria-labelledby="related-guides">
            <h2 id="related-guides" className={styles.heading}>
                Related guides
            </h2>
            <ul className={styles.grid}>
                {picks.map((g) => (
                    <GuideCard key={g.slug} guide={g} />
                ))}
            </ul>
        </section>
    );
}
