import { Sandpack } from "@codesandbox/sandpack-react";
import commonJsContent from "!!raw-loader!./common.js";
import scichartBundle from "!!raw-loader!../../node_modules/scichart/_wasm/scichart.browser.mjs";
// import scichartWasm2D from "!!raw-loader!../../node_modules/scichart/_wasm/scichart2d.wasm";
// import scichartWasm3D from "!!raw-loader!../../node_modules/scichart/_wasm/scichart3d.wasm";

export default function ChartContainer(props?: { demoJsContent: string; htmlTemplate?: string, cssContent?: string }) {
    return (
        <Sandpack
            template="static"
            options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: false,
                showConsole: false,
                editorWidthPercentage: 0
            }}
            files={{
                "index.html": `
  <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name='robots' content='noindex,follow' />
        <script type="importmap">
                {
                    "imports": {
                        "scichart": "/scichart.browser.mjs"
                    }
                }
        </script>
        <script type="module" src="/scichart.browser.mjs"></script>
        <script type="module" src="/common.js"></script>
        <script type="module" src="demo.js"></script>
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
`,

                "demo.js": props.demoJsContent,
                "common.js": {
                    code: commonJsContent,
                    hidden: true
                },
                "scichart.browser.mjs": {
                    code: scichartBundle,
                    hidden: true
                },
                "demo.css": {
                    code: props?.cssContent ?? "",
                    hidden: !props?.cssContent
                },
                // "scichart2d.wasm": {
                //     code: scichartWasm2D,
                //     hidden: true
                // },
                // "scichart3d.wasm": {
                //     code: scichartWasm3D,
                //     hidden: true
                // }
            }}
        />
    );
}
