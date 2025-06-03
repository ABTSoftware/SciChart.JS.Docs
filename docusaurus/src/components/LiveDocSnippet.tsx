import { baseUrl } from "@site/config";
import { CodePenLauncher } from "./CodePenLauncher";
import { libraryVersion } from "scichart";
import { useEffect, useState } from "react";

type Props = {
    maxWidth?: string | number;
    name?: string;
    htmlPath?: string;
    cssPath?: string;
};

export default function LiveDocSnippet(props?: Props) {
    const filenameBase = props?.name ?? "demo";
    const cssUrl = props?.cssPath;
    const htmlUrl = props?.htmlPath;
    const tsUrl = `${filenameBase}.ts`;
    const jsUrl = `${filenameBase}.js`;

    const [files, setFiles] = useState<{ html?: string; ts?: string; js?: string; css?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const htmlTemplate = files?.html ?? `<div id="scichart-root" ></div>`;
    const cssTemplate = files?.css ?? "";
    const htmlContent = getIframeSrc(htmlTemplate, filenameBase, cssUrl);
    const sandboxHtml = getSandboxSrc(htmlTemplate);

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);

            const [html, ts, js, css] = await Promise.all([
                htmlUrl ? fetch(htmlUrl).then(res => res.text()) : null,
                fetch(tsUrl).then(res => res.text()),
                fetch(jsUrl).then(res => res.text()),
                cssUrl ? fetch(cssUrl).then(res => res.text()) : null
            ]);

            setFiles({ html, ts, js, css });
            setIsLoading(false);
        };

        fetchFiles().catch(err => {
            console.error("Failed to load files:", err);
            setIsLoading(false);
        });
    }, []);

    return (
        <div style={{ width: "100%", maxWidth: props?.maxWidth, aspectRatio: 3 / 2 }}>
            <CodePenLauncher js={files.ts} html={sandboxHtml} css={files.css} />
            <iframe width="100%" height="100%" srcDoc={htmlContent}></iframe>
        </div>
    );
}

const getIframeSrc = (htmlTemplate: string, jsUrl: string, cssUrl: string) => {
    return `
    <html lang="en-us">
        <head>
            <meta charset="utf-8" />
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta name='robots' content='noindex,follow' />
            <script type="importmap">
                    {
                        "imports": {
                            "scichart": "${baseUrl}scichart.browser.js"
                        }
                    }
            </script>
            <script type="module" src="${baseUrl}scichart.browser.js"></script>
            <script type="module">
                import {SciChartSurface, SciChart3DSurface, SciChartDefaults} from "scichart";

                SciChartSurface.configure({
                    wasmUrl: "${baseUrl}scichart2d.wasm"
                });
                SciChart3DSurface.configure({
                    wasmUrl: "${baseUrl}scichart3d.wasm"
                });
                SciChartDefaults.performanceWarnings = false;
            </script>
            <script type="module" src=${jsUrl}.js></script>
            <link rel="stylesheet" href="${cssUrl}" />
            <style>
                iframe { border: 0; }
                body { margin: 0; }
                #scichart-root { width: 100%; height: 100vh; }
            </style>
        </head>
        <body>
        <div style="width: 100%; height: 100vh;">${htmlTemplate}</div>
        </body>
    </html>
    `;
};

const getSandboxSrc = (htmlTemplate: string) => `
    <html lang="en-us">
        <head>
            <meta charset="utf-8" />
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta name='robots' content='noindex,follow' />
            <script type="importmap">
                    {
                        "imports": {
                            "scichart": "https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart.browser.mjs"
                        }
                    }
            </script>
            <script type="module" src="https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart.browser.mjs"></script>
            <script type="module">
                import {SciChartSurface, SciChart3DSurface, SciChartDefaults} from "scichart";

                SciChartSurface.useWasmFromCDN();
                SciChart3DSurface.useWasmFromCDN();
                SciChartDefaults.performanceWarnings = false;
            </script>

            <style>
                iframe { border: 0; }
                body { margin: 0; }
                #scichart-root { width: 100%; height: 100vh; }

            </style>
        </head>
        <body>
        <div style="width: 100%; height: 100vh;">${htmlTemplate}</div>
        </body>
    </html>
    `;
