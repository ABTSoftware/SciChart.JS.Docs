import { baseUrl } from "@site/config";
import { CodePenLauncher } from "./CodePenLauncher";
import { libraryVersion } from "scichart";
import { useEffect, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';

const USE_LOCAL_PACKAGE = false; // for testing purposes

const financialToolsVersion = libraryVersion;

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

    let htmlString = `<div id="scichart-root" ></div>`;
    if (props.htmlType === EHtmlType.WithResult) {
        htmlString = `<div><div id="scichart-root" ></div><div id="result" style="height: 20px; color: red"></div><div>`
    }

    const htmlTemplate = files?.html ?? htmlString;
    const cssTemplate = files?.css ?? "";
    const inlineJs = files.extraJs?.length && files.js ? inlineExtraJs(files.js, files.extraJs) : undefined;
    const htmlContent = getIframeSrc(htmlTemplate, filenameBase, cssUrl, props.htmlType, props.includeFinTools, inlineJs);
    const sandboxHtml = getSandboxSrc(htmlTemplate, props.htmlType, props.includeFinTools);

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
            <CodePenLauncher js={inlineJs ?? files.ts} html={sandboxHtml} css={files.css} />
            <BrowserOnly>
                {() => <iframe width="100%" height="100%" srcDoc={htmlContent}></iframe>}
            </BrowserOnly>
        </div>
    );
}

const getImportMap = (includeFinTools?: boolean) => {
    const imports = [];

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

const getIframeSrc = (htmlTemplate: string, jsUrl: string, cssUrl: string, htmlType: EHtmlType, includeFinTools?: boolean, inlineJs?: string) => {
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
                    ${getImportMap(includeFinTools)}
                }
            }
        </script>
        <script type="module">
            import {SciChartSurface, SciChartDefaults} from "scichart";

            SciChartSurface.UseCommunityLicense();

            // From v6 one wasm module serves both 2D and 3D, and its side modules (charting3d) are
            // fetched lazily from the same directory. Do not also call SciChart3DSurface.configure()
            // here - in v6 the second call overwrites the first.
            SciChartSurface.configure({
                wasmUrl: "${baseUrl}scichart.wasm",
                wasmNoSimdUrl: "${baseUrl}scichart-nosimd.wasm"
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

const getSandboxSrc = (htmlTemplate: string, htmlType: EHtmlType, includeFinTools?: boolean) => {
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
                            ${getImportMap(includeFinTools)}
                        }
                    }
            </script>
            <script type="module">
                import {SciChartSurface, SciChartDefaults} from "scichart";

                SciChartSurface.UseCommunityLicense();
                SciChartSurface.configure({
                    wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart.wasm",
                    wasmNoSimdUrl: "https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart-nosimd.wasm"
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
