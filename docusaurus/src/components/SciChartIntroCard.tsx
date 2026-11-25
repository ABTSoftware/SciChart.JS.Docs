import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useCurrentLearnGuide } from "./learnGuides";
import {
    DEMOS_URL,
    FULL_VIDEO_URL,
    GET_STARTED_URL,
    PREVIEW_VIDEO_URL,
    PREVIEW_POSTER_URL,
    PRODUCTS
} from "../data/scichartSite";
import styles from "./SciChartIntroCard.module.css";

// A small card under the right-hand table of contents (desktop only), introducing SciChart to docs readers:
// a silent looping video preview, one line on what SciChart is, and links to the demos, the products and
// getting started. Rendered by src/theme/DocItem/TOC/Desktop. On learn guides it starts with a link to the
// guide's own "How to create ... in JavaScript, React or Angular" section.
//
// Performance: the video has no src until the page has loaded and the browser is idle, the card is on screen
// and the window is desktop width. It never plays when the reader prefers reduced motion or has data saving on.
// Each link carries data-cta, so Google Tag Manager can count clicks.

const DESKTOP_QUERY = "(min-width: 997px)";

type VideoState = "waiting" | "playing" | "poster";

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
}

// The guide's code section: its "How to create ... in JavaScript, React or Angular" heading
function useBuildLink(): { href: string; text: string; slug: string } | undefined {
    const guide = useCurrentLearnGuide();
    const { toc } = useDoc();
    if (!guide) return undefined;
    const heading = toc.find((t) => t.level === 2 && /in JavaScript, React or Angular/i.test(stripHtml(t.value)));
    if (!heading) return undefined;
    const title = stripHtml(heading.value).replace(/\s+in JavaScript, React or Angular.*$/i, "");
    const create = title.match(/^How to create (.+)$/i);
    return {
        href: `#${heading.id}`,
        text: create ? `Build ${create[1]}: see the code` : `${title}: see the code`,
        slug: guide.slug
    };
}

function useIdleVisibleDesktop(target: React.RefObject<HTMLElement>, onReady: () => void, onHidden: () => void) {
    useEffect(() => {
        const el = target.current;
        if (!el || typeof window === "undefined") return;
        const desktop = window.matchMedia(DESKTOP_QUERY);
        let idle = false;
        let visible = false;
        let idleHandle: number | undefined;
        const check = () => {
            if (idle && visible && desktop.matches && document.visibilityState === "visible") onReady();
            else onHidden();
        };
        const whenIdle = () => {
            const ric = (window as any).requestIdleCallback as ((cb: () => void, opts?: { timeout: number }) => number) | undefined;
            const done = () => {
                idle = true;
                check();
            };
            idleHandle = ric ? ric(done, { timeout: 4000 }) : window.setTimeout(done, 1500);
        };
        if (document.readyState === "complete") whenIdle();
        else window.addEventListener("load", whenIdle, { once: true });

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            check();
        });
        observer.observe(el);
        desktop.addEventListener("change", check);
        document.addEventListener("visibilitychange", check);
        return () => {
            window.removeEventListener("load", whenIdle);
            const cic = (window as any).cancelIdleCallback as ((h: number) => void) | undefined;
            if (idleHandle !== undefined) (cic ? cic(idleHandle) : window.clearTimeout(idleHandle));
            observer.disconnect();
            desktop.removeEventListener("change", check);
            document.removeEventListener("visibilitychange", check);
        };
    }, [target, onReady, onHidden]);
}

function VideoDialog({ onClose }: { onClose: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();
        closeRef.current?.focus();
        return () => {
            if (dialog.open) dialog.close();
        };
    }, []);
    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-label="SciChart video"
            onClose={onClose}
            onClick={(e) => {
                // A click on the backdrop (outside the video) closes the dialog
                if (e.target === dialogRef.current) onClose();
            }}
        >
            <div className={styles.dialogInner}>
                <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close video">
                    ×
                </button>
                <video className={styles.dialogVideo} src={FULL_VIDEO_URL} controls autoPlay playsInline />
            </div>
        </dialog>
    );
}

export default function SciChartIntroCard() {
    const build = useBuildLink();
    const poster = useBaseUrl(PREVIEW_POSTER_URL);
    const previewSrc = useBaseUrl(PREVIEW_VIDEO_URL ?? "");
    const previewSrcRef = useRef(previewSrc);
    previewSrcRef.current = previewSrc;
    const productsId = useId();
    const boxRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const openerRef = useRef<HTMLButtonElement>(null);
    const [videoState, setVideoState] = useState<VideoState>("waiting");
    const [productsOpen, setProductsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const dialogOpenRef = useRef(false);
    dialogOpenRef.current = dialogOpen;

    // Reduced motion or data saving: show the poster with a play button, never load the preview
    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const saveData = (navigator as any).connection?.saveData === true;
        if (reduced || saveData || !PREVIEW_VIDEO_URL) setVideoState("poster");
    }, []);

    const play = useCallback(() => {
        const video = videoRef.current;
        if (!video || dialogOpenRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator as any).connection?.saveData === true) return;
        if (!PREVIEW_VIDEO_URL) return;
        if (!video.getAttribute("src")) video.src = previewSrcRef.current;
        if (video.paused) {
            video.play().then(
                () => setVideoState("playing"),
                () => setVideoState("poster")
            );
        }
    }, []);
    const pause = useCallback(() => {
        const video = videoRef.current;
        if (video && !video.paused) video.pause();
    }, []);
    useIdleVisibleDesktop(boxRef, play, pause);

    const openDialog = () => {
        pause();
        setDialogOpen(true);
    };
    const closeDialog = () => {
        setDialogOpen(false);
        openerRef.current?.focus();
        if (videoState !== "poster") setTimeout(play, 0);
    };

    return (
        <aside className={styles.card} aria-label="About SciChart">
            {build && (
                <a className={styles.build} href={build.href} data-cta={`learn-card-build-${build.slug}`}>
                    {build.text} <span aria-hidden="true">→</span>
                </a>
            )}
            <div ref={boxRef} className={styles.videoBox}>
                <div className={styles.poster} aria-hidden="true">
                    <img className={styles.posterImage} src={poster} alt="" width={420} height={236} decoding="async" />
                </div>
                <video
                    ref={videoRef}
                    className={videoState === "playing" ? `${styles.video} ${styles.videoPlaying}` : styles.video}
                    preload="none"
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    tabIndex={-1}
                    // If the video can't load (blocked, offline), show the poster and its play button
                    onError={() => setVideoState("poster")}
                />
                <button
                    ref={openerRef}
                    type="button"
                    className={styles.videoButton}
                    onClick={openDialog}
                    aria-label="Watch the SciChart video with sound"
                    data-cta="docs-card-video"
                >
                    <span className={`${styles.playIcon} ${videoState === "playing" ? styles.playIconSmall : ""}`} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="100%" height="100%">
                            <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                    </span>
                </button>
            </div>
            <p className={styles.value}>
                Real-time charts with millions of points: JavaScript, React, WPF, iOS and Android.
            </p>
            <ul className={styles.links}>
                <li>
                    <a href={DEMOS_URL} data-cta="docs-card-demos">
                        Explore 100+ live demos
                    </a>
                </li>
                <li>
                    <button
                        type="button"
                        className={styles.disclosure}
                        aria-expanded={productsOpen}
                        aria-controls={productsId}
                        onClick={() => setProductsOpen((o) => !o)}
                        data-cta="docs-card-products"
                    >
                        See all products <span className={styles.chevron} aria-hidden="true">▾</span>
                    </button>
                    <ul id={productsId} className={styles.products} hidden={!productsOpen}>
                        {PRODUCTS.map((p) => (
                            <li key={p.key}>
                                <a href={p.url} data-cta={`docs-card-products-${p.key}`}>
                                    {p.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
            <a className={styles.getStarted} href={GET_STARTED_URL} data-cta="docs-card-get-started">
                Get started free
            </a>
            {dialogOpen && <VideoDialog onClose={closeDialog} />}
        </aside>
    );
}
