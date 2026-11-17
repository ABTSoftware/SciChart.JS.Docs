// Links to the main SciChart website, shared by the navbar and footer (docusaurus.config.ts) and by the
// "introduce SciChart" card beside the table of contents (src/components/SciChartIntroCard.tsx).
// This file is imported by the config, which runs in Node.js, so keep it plain data: no React, no browser APIs.

export const SCICHART_HOME_URL = "https://www.scichart.com/";
export const DEMOS_URL = "https://www.scichart.com/demo/";
export const GET_STARTED_URL = "https://www.scichart.com/getting-started/scichart-javascript/";
export const CHANGELOG_URL = "https://www.scichart.com/changelog/scichart-js/";
export const CONTACT_URL = "https://www.scichart.com/contact-us/";
export const PRICING_URL = "https://www.scichart.com/shop/";

export type SciChartProduct = {
    // Used in data-cta attributes, e.g. "docs-card-products-react"
    key: string;
    // Link text: the search the product page targets
    label: string;
    url: string;
};

// The product pages, in the order the navbar, footer and card list them
export const PRODUCTS: SciChartProduct[] = [
    { key: "javascript", label: "JavaScript charts", url: "https://www.scichart.com/javascript-chart-features/" },
    { key: "react", label: "React charts", url: "https://www.scichart.com/react-charts/" },
    { key: "javascript-stock", label: "JavaScript stock charts", url: "https://www.scichart.com/javascript-stock-charts/" },
    { key: "wpf", label: "WPF charts", url: "https://www.scichart.com/wpf-chart-features/" },
    { key: "wpf-3d", label: "WPF 3D charts", url: "https://www.scichart.com/wpf-3d-chart-features/" },
    { key: "avalonia-xpf", label: "Avalonia XPF charts", url: "https://www.scichart.com/avalonia-xpf-chart-features/" },
    { key: "ios", label: "iOS charts", url: "https://www.scichart.com/ios-chart-features/" },
    { key: "android", label: "Android charts", url: "https://www.scichart.com/android-chart-features/" }
];

// The homepage video. The card plays PREVIEW_VIDEO_URL silently on a loop to catch the eye, and loads FULL_VIDEO_URL
// (about 14.6 MB) only when clicked, in a dialog with sound.
// PREVIEW_VIDEO_URL is a 20 s clip of the same video (2.5 to 22.5 s: charts, logo, GPU rendering, platforms, 3D),
// 420 px wide, H.264 MP4, no sound, about 234 KB, in static/video/. Never point it at the full video. Set it to null to
// show only the poster with a play button.
export const FULL_VIDEO_URL =
    "https://www.scichart.com/wp-content/uploads/2025/05/SciChart_full-video-compressed-720p-20-05-25.webm";
export const PREVIEW_VIDEO_URL: string | null = "/video/scichart-card-preview.mp4";
// Still frame shown until the clip plays (about 12 KB)
export const PREVIEW_POSTER_URL = "/video/scichart-card-preview-poster.jpg";
