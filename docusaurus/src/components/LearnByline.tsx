import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import styles from "./LearnByline.module.css";

// Byline and article schema for learning center pages (docs/learn/).
//
// Shows "By <author> · Published <date> · Updated <date>" under the page's H1, with the author's name linked to
// their author page, and adds JSON-LD with a TechArticle whose author is a Person. The Person (and the
// Organization it works for) are included in the markup, each with one ID used site-wide, matching scichart.com.
//
// Front matter on a learn page:
//   datePublished: 2026-11-13        first published (required for the Published date)
//   author: andrew                    optional, a key of AUTHORS; defaults to DEFAULT_AUTHOR
//   reviewer: <key of AUTHORS>        optional: adds "Technical review: <name>" and WebPage.reviewedBy
//   lastReviewed: 2026-11-22          optional, the review date (with reviewer)
// The Updated date is the page's last update from git (showLastUpdateTime in docusaurus.config.ts).

type Person = {
    id: string;
    name: string;
    url: string;
    jobTitle: string;
    sameAs: string[];
};

const ORGANIZATION = {
    "@type": "Organization",
    "@id": "https://www.scichart.com/#organization",
    name: "SciChart",
    url: "https://www.scichart.com/"
};

export const AUTHORS: Record<string, Person> = {
    andrew: {
        id: "https://www.scichart.com/#/schema/person/andrew",
        name: "Andrew Burnett-Thompson",
        url: "https://www.scichart.com/author/andrew/",
        jobTitle: "CEO / Founder, SciChart",
        sameAs: [
            "https://www.linkedin.com/in/dr-andrew-burnett-thompson",
            "https://github.com/andyb1979",
            "https://x.com/drandrewbt"
        ]
    }
};

const DEFAULT_AUTHOR = "andrew";

function formatDate(value?: string | number | Date): string | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function isoDate(value?: string | number | Date): string | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function personSchema(p: Person) {
    return {
        "@type": "Person",
        "@id": p.id,
        name: p.name,
        url: p.url,
        jobTitle: p.jobTitle,
        worksFor: { "@id": ORGANIZATION["@id"] },
        sameAs: p.sameAs
    };
}

export default function LearnByline(): React.ReactElement | null {
    const { metadata, frontMatter } = useDoc();
    const { siteConfig } = useDocusaurusContext();
    const fm = frontMatter as Record<string, unknown>;

    const author = AUTHORS[(fm.author as string) ?? DEFAULT_AUTHOR] ?? AUTHORS[DEFAULT_AUTHOR];
    const reviewer = fm.reviewer ? AUTHORS[fm.reviewer as string] : undefined;

    const published = fm.datePublished as string | undefined;
    const updated = metadata.lastUpdatedAt ?? undefined;
    const lastReviewed = fm.lastReviewed as string | undefined;

    const pageUrl = new URL(metadata.permalink, siteConfig.url).toString();
    const imagePath = useBaseUrl((fm.image as string) ?? "/img/Default-Social-Image.jpg");
    const imageUrl = new URL(imagePath, siteConfig.url).toString();

    const people = [author, ...(reviewer && reviewer.id !== author.id ? [reviewer] : [])];
    const graph: object[] = [
        {
            "@type": "TechArticle",
            "@id": `${pageUrl}#article`,
            headline: metadata.title,
            description: metadata.description,
            url: pageUrl,
            mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
            image: imageUrl,
            datePublished: isoDate(published),
            dateModified: isoDate(updated) ?? isoDate(published),
            author: { "@id": author.id },
            publisher: { "@id": ORGANIZATION["@id"] }
        },
        {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: metadata.title,
            ...(reviewer ? { reviewedBy: { "@id": reviewer.id }, lastReviewed: isoDate(lastReviewed) } : {})
        },
        ...people.map(personSchema),
        ORGANIZATION
    ];

    const publishedText = formatDate(published);
    const updatedText = formatDate(updated);

    return (
        <>
            <Head>
                <script type="application/ld+json">
                    {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
                </script>
            </Head>
            <p className={styles.byline}>
                By <a href={author.url}>{author.name}</a>
                {publishedText && (
                    <>
                        {" · "}Published <time dateTime={isoDate(published)}>{publishedText}</time>
                    </>
                )}
                {updatedText && updatedText !== publishedText && (
                    <>
                        {" · "}Updated <time dateTime={isoDate(updated)}>{updatedText}</time>
                    </>
                )}
                {reviewer && (
                    <>
                        <br />
                        Technical review: <a href={reviewer.url}>{reviewer.name}</a>
                    </>
                )}
            </p>
        </>
    );
}
