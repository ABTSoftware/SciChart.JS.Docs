import { baseUrl } from "@site/config";
import { CodePenLauncher } from "./CodePenLauncher";
import { libraryVersion } from "scichart";
import { useEffect, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';

const USE_LOCAL_PACKAGE = false; // for testing purposes

const financialToolsVersion = libraryVersion;

// SciTrader (scichart-scitrader) has no browser bundle yet, so it loads from jsDelivr's "+esm" build.
// That build imports its peers from pinned jsDelivr URLs, which the import map below points at the
// scichart-financial-tools browser bundle, so the page has one copy of SciChart. That bundle includes
// SciChart, so the WebAssembly must come from the same SciChart version.
// If you change SCITRADER_VERSION, re-check which URLs its +esm build imports:
// https://cdn.jsdelivr.net/npm/scichart-scitrader@<version>/+esm
const SCITRADER_VERSION = "0.0.4";
const SCITRADER_FINTOOLS_VERSION = "6.0.14"; // its browser bundle contains scichart 6.0.14
const SCITRADER_ESM_PEER_URLS = [
    "https://cdn.jsdelivr.net/npm/scichart@6.0.15/+esm",
    "https://cdn.jsdelivr.net/npm/scichart-financial-tools@6.0.14/+esm"
];
const SCITRADER_FINTOOLS_BUNDLE = `https://cdn.jsdelivr.net/npm/scichart-financial-tools@${SCITRADER_FINTOOLS_VERSION}/scichart-financial-tools.browser.mjs`;
const SCITRADER_CSS = `https://cdn.jsdelivr.net/npm/scichart-scitrader@${SCITRADER_VERSION}/styles/scitrader.css`;
const SCITRADER_WASM = `https://cdn.jsdelivr.net/npm/scichart@${SCITRADER_FINTOOLS_VERSION}/_wasm/`;

/** Remove `import "….css";` lines: a browser can't import CSS as a module, so the page links the stylesheet instead. */
const stripCssImports = (source?: string) => source?.replace(/^import\s+["'][^"']+\.css["'];?[ \t]*\r?\n/gm, "");

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
    /** The page's HTML. Default: a `#scichart-root` div. */
    html?: string;
};

type ExtraJs = { path: string; content: string };

export default function LiveDocSnippet(props?: Props) {
    const filenameBase = props?.name ?? "demo";
    const cssUrl = props?.cssPath;
    const htmlUrl = props?.htmlPath;
    const extraJSPaths = props?.extraJSPaths ?? [];
    const tsUrl = `${filenameBase}.ts`;
    const jsUrl = `${filenameBase}.js`;

    const [files, setFiles] = useState<{ html?: string; ts?: string; js?: string; css?: string; extraJs?: ExtraJs[] }>({});
    const [isLoading, setIsLoading] = useState(false);

    let htmlString = props.html ?? `<div id="scichart-root" ></div>`;
    if (props.htmlType === EHtmlType.WithResult) {
        htmlString = `<div><div id="scichart-root" ></div><div id="result" style="height: 20px; color: red"></div><div>`
    }

    const htmlTemplate = files?.html ?? htmlString;
    const cssTemplate = files?.css ?? "";
    const sciTrader = props.includeSciTrader;
    const jsSource = sciTrader ? stripCssImports(files.js) : files.js;
    const tsSource = sciTrader ? stripCssImports(files.ts) : files.ts;
    const inlineJs = files.extraJs?.length && jsSource ? inlineExtraJs(jsSource, files.extraJs) : sciTrader ? jsSource : undefined;
    const htmlContent = getIframeSrc(htmlTemplate, filenameBase, cssUrl, props.htmlType, props.includeFinTools, inlineJs, sciTrader);
    const sandboxHtml = getSandboxSrc(htmlTemplate, props.htmlType, props.includeFinTools, sciTrader);

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);

            const [html, ts, js, css, ...extraJs] = await Promise.all([
                htmlUrl ? fetch(htmlUrl).then(res => res.text()) : null,
                fetch(tsUrl).then(res => res.text()),
                fetch(jsUrl).then(res => res.text()),
                cssUrl ? fetch(cssUrl).then(res => res.text()) : null,
                ...extraJSPaths.map(path => fetch(path).then(res => res.text()))
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
        <div style={{ width: "100%", maxWidth: props?.maxWidth, aspectRatio: 3 / 2, display: "flex", flexDirection: "column", marginBottom: '1rem', background: "#8881" }}>
            <CodePenLauncher js={files.extraJs?.length ? inlineJs : tsSource} html={sandboxHtml} css={files.css} />
            <BrowserOnly>
                {() => (sciTrader && !inlineJs) ? null : <iframe width="100%" height="100%" srcDoc={htmlContent}></iframe>}
            </BrowserOnly>
        </div>
    );
}

const getImportMap = (includeFinTools?: boolean, includeSciTrader?: boolean) => {
    const imports = [];

    if (includeSciTrader) {
        imports.push(
            `"scichart": "${SCITRADER_FINTOOLS_BUNDLE}"`,
            `"scichart-financial-tools": "${SCITRADER_FINTOOLS_BUNDLE}"`,
            `"scichart-scitrader": "https://cdn.jsdelivr.net/npm/scichart-scitrader@${SCITRADER_VERSION}/+esm"`,
            ...SCITRADER_ESM_PEER_URLS.map((url) => `"${url}": "${SCITRADER_FINTOOLS_BUNDLE}"`)
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

const getIframeSrc = (htmlTemplate: string, jsUrl: string, cssUrl: string, htmlType: EHtmlType, includeFinTools?: boolean, inlineJs?: string, includeSciTrader?: boolean) => {
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
                    ${getImportMap(includeFinTools, includeSciTrader)}
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
            SciChartSurface.configure({
                wasmUrl: "${includeSciTrader ? SCITRADER_WASM : baseUrl}scichart.wasm",
                wasmNoSimdUrl: "${includeSciTrader ? SCITRADER_WASM : baseUrl}scichart-nosimd.wasm"
            });
            SciChartDefaults.performanceWarnings = false;
        </script>
        ${inlineJs ? `<script type="module">${inlineJs}</script>` : `<script type="module" src=${jsUrl}.js></script>`}
        ${cssUrl ? `<link rel="stylesheet" type="text/css" href="${cssUrl}">` : ""}
        <style>
            iframe { border: 0; }
            body { margin: 0; }
            #scichart-root { width: 100%; height: ${height}; }
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

const getSandboxSrc = (htmlTemplate: string, htmlType: EHtmlType, includeFinTools?: boolean, includeSciTrader?: boolean) => {
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
                            ${getImportMap(includeFinTools, includeSciTrader)}
                        }
                    }
            </script>
            ${includeSciTrader ? `<link rel="stylesheet" href="${SCITRADER_CSS}">` : ""}
            <script type="module">
                import {SciChartSurface, SciChartDefaults} from "scichart";

                SciChartSurface.UseCommunityLicense();
                SciChartSurface.configure({
                    wasmUrl: "${includeSciTrader ? SCITRADER_WASM : `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/`}scichart.wasm",
                    wasmNoSimdUrl: "${includeSciTrader ? SCITRADER_WASM : `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/`}scichart-nosimd.wasm"
                });
                SciChartDefaults.performanceWarnings = false;
            </script>

            <style>
                iframe { border: 0; }
                body { margin: 0; }
                #scichart-root { width: 100%; height: ${height}; }

            </style>
        </head>
        <body>
        <div style="width: 100%; height: 100vh;">${htmlTemplate}</div>
        </body>
    </html>
    `;
}
