import { baseUrl } from "@site/config";
import { CodePenLauncher } from "./CodePenLauncher";
import { libraryVersion } from "scichart";
import { useEffect, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import financialToolsPackage from "scichart-financial-tools/package.json";

const USE_LOCAL_PACKAGE = false; // for testing purposes

// scichart-financial-tools is versioned on its own (e.g. 6.0.14 beside scichart 6.0.15): use its installed version
const financialToolsVersion: string = financialToolsPackage.version;

// SciTrader (scichart-scitrader) has no browser bundle yet, so it loads from jsDelivr's "+esm" build.
// That build imports its peers from pinned jsDelivr URLs, which the import map below points at the
// scichart-financial-tools browser bundle, so the page has one copy of SciChart. That bundle includes
// SciChart; SciChartSurface.useWasmFromCDN() loads the WebAssembly for that same version.
// If you change SCITRADER_VERSION, re-check which URLs its +esm build imports:
// https://cdn.jsdelivr.net/npm/scichart-scitrader@<version>/+esm
const SCITRADER_VERSION = "0.0.4";
const SCITRADER_FINTOOLS_VERSION = "6.0.14"; // its browser bundle contains scichart 6.0.14
const SCITRADER_ESM_PEER_URLS = [
    "https://cdn.jsdelivr.net/npm/scichart@6.0.15/+esm",
    "https://cdn.jsdelivr.net/npm/scichart-financial-tools@6.0.14/+esm"
];
// The jsDelivr +esm builds import each other by root-relative path, e.g. "/npm/rxjs@7.8.2/+esm". Those
// should resolve against cdn.jsdelivr.net, but in a CodePen preview some browsers (seen in Safari)
// resolve them against the pen's base, codepen.io, and the import 404s. A key starting with "/" is
// resolved against the page's base too, so mapping each path to its full jsDelivr URL catches that
// case, and is never matched otherwise. The scichart and fin-tools paths go to the one bundle, as above.
// This is the whole graph below scichart-scitrader(-react)@0.0.4: re-check it if a version changes.
const SCITRADER_ESM_PATHS = [
    "/npm/scichart-scitrader@0.0.4/+esm",
    "/npm/rxjs@7.8.2/+esm",
    "/npm/rxjs@7.8.2/operators/+esm",
    "/npm/idb@7.1.1/+esm",
    "/npm/technicalindicators@3.1.0/+esm",
    "/npm/tslib@2.8.1/+esm"
];
const SCITRADER_REACT_ESM_PATHS = ["/npm/react@19.3.1/+esm", "/npm/react-dom@19.3.1/+esm", "/npm/scheduler@0.28.0/+esm"];
const SCITRADER_FINTOOLS_BUNDLE = `https://cdn.jsdelivr.net/npm/scichart-financial-tools@${SCITRADER_FINTOOLS_VERSION}/scichart-financial-tools.browser.mjs`;
// SciTrader samples use the dark theme: give the page its background, so it isn't white while the
// bundles load (a couple of seconds), and its font, for any text a sample doesn't style itself.
// The page around every live snippet and CodePen gets a sans-serif font, so HTML inside a chart (the legend,
// tooltips) doesn't fall back to the browser's default serif (Times New Roman). Matches the docs' system font stack.
// SCITRADER_PAGE_STYLE, added after it, overrides it for SciTrader samples.
const PAGE_FONT_STYLE = `body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif; }`;
const SCITRADER_PAGE_STYLE = `body { background: #2b2839; color: #ffffff; font-family: "DM Sans", sans-serif; }`;
const SCITRADER_CSS = `https://cdn.jsdelivr.net/npm/scichart-scitrader@${SCITRADER_VERSION}/styles/scitrader.css`;
// scichart-scitrader-react's +esm build imports react@REACT_VERSION and react-dom@REACT_VERSION. Map
// "react" to that same URL, so the sample and the wrapper share one copy of React.
const REACT_VERSION = "19.3.1";
const REACT_IMPORTS = [
    `"react": "https://cdn.jsdelivr.net/npm/react@${REACT_VERSION}/+esm"`,
    `"react-dom/client": "https://cdn.jsdelivr.net/npm/react-dom@${REACT_VERSION}/client/+esm"`,
    `"scichart-scitrader-react": "https://cdn.jsdelivr.net/npm/scichart-scitrader-react@${SCITRADER_VERSION}/+esm"`
];

/** Code appended to a React sample to render `component` into `#root`. The sample must import React as `React`. */
const reactMountTs = (component: string) => `
// Render the component into the page
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(<${component} />);
`;
const reactMountJs = (component: string) => `
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(React.createElement(${component}));
`;

/** Remove `import "….css";` lines: a browser can't import CSS as a module, so the page links the stylesheet instead. */
const stripCssImports = (source?: string) => source?.replace(/^import\s+["'][^"']+\.css["'];?[ \t]*\r?\n/gm, "");

/**
 * Fetch a snippet's source file. The dev server answers a file it doesn't serve with the site's HTML
 * page and a 200, which would otherwise end up in the iframe and in CodePen as the "code".
 */
const fetchSource = async (url: string) => {
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok || /^\s*<!doctype html/i.test(text)) {
        throw new Error(`LiveDocSnippet: ${url} was not found (got ${res.status}${res.ok ? ", an HTML page" : ""})`);
    }
    return text;
};

enum EHtmlType {
    Default = "Default",
    WithResult = "WithResult"
}

type Props = {
    maxWidth?: string | number;
    name?: string;
    htmlPath?: string;
    cssPath?: string;
    extraJSPaths?: string[];
    htmlType?: EHtmlType;
    includeFinTools?: boolean;
    /** Load scichart-scitrader (and its peers) from jsDelivr, with its stylesheet. */
    includeSciTrader?: boolean;
    /** The page's HTML. Default: a `#scichart-root` div, or a `#root` div for a React sample. */
    html?: string;
    /**
     * Render a React sample: the name of the component it exports. The sample is `${name}.tsx`, and the
     * component is rendered into `#root`. Needs `includeSciTrader`.
     */
    reactComponent?: string;
    /** A fixed height for the snippet, instead of a 3:2 aspect ratio. */
    height?: string | number;
};

type ExtraJs = { path: string; content: string };

export default function LiveDocSnippet(props?: Props) {
    const filenameBase = props?.name ?? "demo";
    const cssUrl = props?.cssPath;
    const htmlUrl = props?.htmlPath;
    const extraJSPaths = props?.extraJSPaths ?? [];
    const reactComponent = props?.reactComponent;
    const tsUrl = `${filenameBase}.${reactComponent ? "tsx" : "ts"}`;
    const jsUrl = `${filenameBase}.js`;

    const [files, setFiles] = useState<{ html?: string; ts?: string; js?: string; css?: string; extraJs?: ExtraJs[] }>({});
    const [isLoading, setIsLoading] = useState(false);

    let htmlString = props.html ?? (reactComponent ? `<div id="root" style="height: 100%"></div>` : `<div id="scichart-root" ></div>`);
    if (props.htmlType === EHtmlType.WithResult) {
        htmlString = `<div><div id="scichart-root" ></div><div id="result" style="height: 20px; color: red"></div><div>`
    }

    const htmlTemplate = files?.html ?? htmlString;
    const cssTemplate = files?.css ?? "";
    const sciTrader = props.includeSciTrader;
    const withMount = (source: string | undefined, mount: (component: string) => string) =>
        source && reactComponent ? source + mount(reactComponent) : source;
    const jsSource = withMount(sciTrader ? stripCssImports(files.js) : files.js, reactMountJs);
    const tsSource = withMount(sciTrader ? stripCssImports(files.ts) : files.ts, reactMountTs);
    const inlineJs = files.extraJs?.length && jsSource ? inlineExtraJs(jsSource, files.extraJs) : sciTrader ? jsSource : undefined;
    const htmlContent = getIframeSrc(htmlTemplate, filenameBase, cssUrl, props.htmlType, props.includeFinTools, inlineJs, sciTrader, !!reactComponent);
    const sandboxHtml = getSandboxSrc(htmlTemplate, props.htmlType, props.includeFinTools, sciTrader, !!reactComponent);

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);

            const [html, ts, js, css, ...extraJs] = await Promise.all([
                htmlUrl ? fetch(htmlUrl).then(res => res.text()) : null,
                fetchSource(tsUrl),
                fetchSource(jsUrl),
                cssUrl ? fetchSource(cssUrl) : null,
                ...extraJSPaths.map(path => fetchSource(path))
            ]);

            setFiles({ html, ts, js, css, extraJs: extraJSPaths.map((path, index) => ({ path, content: extraJs[index] })) });
            setIsLoading(false);
        };

        fetchFiles().catch(err => {
            console.error("Failed to load files:", err);
            setIsLoading(false);
        });
    }, []);

    return (
        <div style={{ width: "100%", maxWidth: props?.maxWidth, ...(props?.height ? { height: props.height } : { aspectRatio: 3 / 2 }), display: "flex", flexDirection: "column", marginBottom: '1rem', background: "#8881" }}>
            <CodePenLauncher js={files.extraJs?.length ? inlineJs : tsSource} html={sandboxHtml} css={files.css} />
            <BrowserOnly>
                {() => (sciTrader && !inlineJs) ? null : <iframe width="100%" height="100%" srcDoc={htmlContent}></iframe>}
            </BrowserOnly>
        </div>
    );
}

const getImportMap = (includeFinTools?: boolean, includeSciTrader?: boolean, includeReact?: boolean) => {
    const imports = [];

    if (includeSciTrader) {
        imports.push(
            `"scichart": "${SCITRADER_FINTOOLS_BUNDLE}"`,
            `"scichart-financial-tools": "${SCITRADER_FINTOOLS_BUNDLE}"`,
            `"scichart-scitrader": "https://cdn.jsdelivr.net/npm/scichart-scitrader@${SCITRADER_VERSION}/+esm"`,
            // Samples that import rxjs themselves (e.g. an IOrderBookSource) get the same copy SciTrader uses
            `"rxjs": "https://cdn.jsdelivr.net/npm/rxjs@7.8.2/+esm"`,
            ...SCITRADER_ESM_PEER_URLS.map((url) => `"${url}": "${SCITRADER_FINTOOLS_BUNDLE}"`),
            ...SCITRADER_ESM_PEER_URLS.map((url) => `"${new URL(url).pathname}": "${SCITRADER_FINTOOLS_BUNDLE}"`),
            ...SCITRADER_ESM_PATHS.map((path) => `"${path}": "https://cdn.jsdelivr.net${path}"`),
            ...(includeReact ? REACT_IMPORTS : []),
            ...(includeReact ? SCITRADER_REACT_ESM_PATHS.map((path) => `"${path}": "https://cdn.jsdelivr.net${path}"`) : [])
        );
        return imports.join(",\n\t\t\t\t\t\t");
    }

    if (USE_LOCAL_PACKAGE) { // for testing purposes
        if (!includeFinTools) {
            imports.push(
                `"scichart": "${baseUrl}scichart.browser.js"`
            )
        }
        if (includeFinTools) {
            imports.push(
                `"scichart": "${baseUrl}scichart-financial-tools.browser.js"`,
                `"scichart-financial-tools": "${baseUrl}scichart-financial-tools.browser.js"`,
            );
        } 
    } else {
        if (!includeFinTools) {
            imports.push(
                `"scichart": "https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_glue/scichart.browser.mjs?v=${libraryVersion}"`
            )
        }
        if (includeFinTools) {
            imports.push(
                `"scichart": "https://cdn.jsdelivr.net/npm/scichart-financial-tools@${financialToolsVersion}/scichart-financial-tools.browser.mjs?v=${financialToolsVersion}"`,
                `"scichart-financial-tools": "https://cdn.jsdelivr.net/npm/scichart-financial-tools@${financialToolsVersion}/scichart-financial-tools.browser.mjs?v=${financialToolsVersion}"`
            );
        } 
    }

    return imports.join(",\n\t\t\t\t\t\t");
};

const getIframeSrc = (htmlTemplate: string, jsUrl: string, cssUrl: string, htmlType: EHtmlType, includeFinTools?: boolean, inlineJs?: string, includeSciTrader?: boolean, includeReact?: boolean) => {
    let height = "100vh";
    if (htmlType === EHtmlType.WithResult) {
        height = `calc(100vh - 20px)`;
    }
    return `<html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name='robots' content='noindex,follow' />
        <script type="importmap">
            {
                "imports": {
                    ${getImportMap(includeFinTools, includeSciTrader, includeReact)}
                }
            }
        </script>
        ${includeSciTrader ? `<link rel="stylesheet" href="${SCITRADER_CSS}">` : ""}
        <script type="module">
            import {SciChartSurface, SciChartDefaults} from "scichart";

            SciChartSurface.UseCommunityLicense();

            // From v6 one wasm module serves both 2D and 3D, and its side modules (charting3d) are
            // fetched lazily from the same directory. Do not also call SciChart3DSurface.configure()
            // here - in v6 the second call overwrites the first.
            ${includeSciTrader
                ? `SciChartSurface.useWasmFromCDN(); // matches the SciChart version in the bundle`
                : `SciChartSurface.configure({
                wasmUrl: "${baseUrl}scichart.wasm",
                wasmNoSimdUrl: "${baseUrl}scichart-nosimd.wasm"
            });`}
            SciChartDefaults.performanceWarnings = false;
        </script>
        ${inlineJs ? `<script type="module">${inlineJs}</script>` : `<script type="module" src=${jsUrl}.js></script>`}
        ${cssUrl ? `<link rel="stylesheet" type="text/css" href="${cssUrl}">` : ""}
        <style>
            iframe { border: 0; }
            body { margin: 0; }
            ${PAGE_FONT_STYLE}
            #scichart-root { width: 100%; height: ${height}; }
            ${includeSciTrader ? SCITRADER_PAGE_STYLE : ""}
        </style>
    </head>
    <body>
    <div style="width: 100%; height: 100vh;">${htmlTemplate}</div>
    </body>
</html>`;
};

const inlineExtraJs = (mainJs: string, extraJs: ExtraJs[]) => {
    const localModulePaths = new Set(extraJs.flatMap(({ path }) => [path, path.replace(/\.js$/, "")]));
    const imports = new Map<string, Set<string>>();
    const stripLocalImports = (source: string) => source.replace(
        /^import\s+[\s\S]*?\s+from\s+["']([^"']+)["'];?\s*$/gm,
        (statement, path) => localModulePaths.has(path) ? "" : statement
    );
    const collectNamedImports = (source: string) => source.replace(
        /^import\s*{\s*([^}]+)\s*}\s*from\s*["']([^"']+)["'];?\s*$/gm,
        (_statement, names, path) => {
            const bindings = imports.get(path) ?? new Set<string>();
            names.split(",").forEach((name: string) => bindings.add(name.trim()));
            imports.set(path, bindings);
            return "";
        }
    );
    const stripExports = (source: string) => source
        .replace(/\bexport\s+(?=(?:async\s+)?(?:class|function|const|let|var)\b)/g, "")
        .replace(/^export\s*{[^}]*};?\s*$/gm, "");

    const body = [
        ...extraJs.map(({ content }) => stripExports(collectNamedImports(stripLocalImports(content)))),
        collectNamedImports(stripLocalImports(mainJs))
    ].join("\n");
    const externalImports = [...imports].map(([path, bindings]) => `import { ${[...bindings].join(", ")} } from "${path}";`).join("\n");

    return `${externalImports}\n${body}`;
};

const getSandboxSrc = (htmlTemplate: string, htmlType: EHtmlType, includeFinTools?: boolean, includeSciTrader?: boolean, includeReact?: boolean) => {
    let height = "100vh";
    if (htmlType === EHtmlType.WithResult) {
        height = `calc(100vh - 20px)`;
    }
    const libraryVersionMajor = libraryVersion.split(".")[0];
    return `
    <html lang="en-us">
        <head>
            <meta charset="utf-8" />
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta name='robots' content='noindex,follow' />
            <script type="importmap">
                    {
                        "imports": {
                            ${getImportMap(includeFinTools, includeSciTrader, includeReact)}
                        }
                    }
            </script>
            ${includeSciTrader ? `<link rel="stylesheet" href="${SCITRADER_CSS}">` : ""}
            <script type="module">
                import {SciChartSurface, SciChartDefaults} from "scichart";

                SciChartSurface.UseCommunityLicense();
                // Load the WebAssembly from jsDelivr, matching the SciChart version in use
                SciChartSurface.useWasmFromCDN();
                SciChartDefaults.performanceWarnings = false;
            </script>

            <style>
                iframe { border: 0; }
                body { margin: 0; }
                ${PAGE_FONT_STYLE}
                #scichart-root { width: 100%; height: ${height}; }
                ${includeSciTrader ? SCITRADER_PAGE_STYLE : ""}

            </style>
        </head>
        <body>
        <div style="width: 100%; height: 100vh;">${htmlTemplate}</div>
        </body>
    </html>
    `;
}
