import { baseUrl } from "@site/config";

export default function ChartPreviewWrapper(props?: { maxWidth?: string | number, htmlTemplate?: string, jsContent?: string }) {
    return (
        <div style={{ width: "100%", maxWidth: props?.maxWidth, aspectRatio: 3 / 2 }}>
            <iframe
                width="100%"
                height="100%"
                srcDoc={`
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
            <script type="module" ${props?.jsContent ? "" : `src="demo.js"`}>${props?.jsContent ?? ""}</script>
            <link rel="stylesheet" href="demo.css" />
            <style>
                iframe { border: 0; }
                body { margin: 0; }
                #scichart-root { width: 100%; height: 100vh; }
            </style>
        </head>
        <body>
        <div style="width: 100%; height: 100vh;">${
            props?.htmlTemplate ? props.htmlTemplate : `<div id="scichart-root" ></div>`
        }</div>
        </body>
    </html>
    `}
            ></iframe>
        </div>
    );
}
