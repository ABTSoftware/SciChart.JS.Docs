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
                            { from: "node_modules/scichart/_wasm/scichart.browser.mjs", to: "static" },
                            { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "static" },
                            { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "static" }
                        ]
                    })
                ]
            };
        }
    };
};
