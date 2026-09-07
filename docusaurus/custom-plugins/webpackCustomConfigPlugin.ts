const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

/** @type {import('@docusaurus/types').PluginModule} */
export default function () {
    return {
        name: "custom-copy-plugin",
        configureWebpack: (config, isServer, utils) => {
            return {
                plugins: [
                    new CopyWebpackPlugin({
                        patterns: [
                            { from: "node_modules/scichart/_glue/scichart.browser.mjs", to: "scichart.browser.js" },
                            { from: "node_modules/scichart-financial-tools/scichart-financial-tools.browser.mjs", to: "scichart-financial-tools.browser.js" },
                            // From v6 every servable binary lives in _wasm/ - the unified 2D+3D core, its
                            // nosimd and wasm64 variants, and the side modules fetched at runtime. Copy the
                            // directory so adding a module needs no change here.
                            { from: "node_modules/scichart/_wasm/", to: "" },
                            {
                                from: "docs/**/*.@(ts|html|js|css)",
                                to({ context, absoluteFilename }) {
                                    const relativePath = path.relative(path.join(context, "docs"), absoluteFilename);
                                    return relativePath;
                                },
                                noErrorOnMissing: false
                            }
                        ]
                    })
                ]
            };
        }
    };
}
