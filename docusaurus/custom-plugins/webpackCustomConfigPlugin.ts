const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type {import('@docusaurus/types').PluginModule} */
export default function () {
    return {
        name: "custom-copy-plugin",
        configureWebpack: (config, isServer, utils) => {
            return {
                plugins: [
                    new CopyWebpackPlugin({
                        patterns: [
                            { from: "node_modules/scichart/_wasm/scichart.browser.mjs", to: "scichart.browser.js" },
                            { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                            { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                            {
                                from: "docs/**/demo.@(js|css)",
                                to: "[path][name][ext]",
                                noErrorOnMissing: false
                            }
                        ]
                    })
                ]
            };
        }
    };
}
