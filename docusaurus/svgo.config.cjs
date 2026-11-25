// svgo settings for the learning center's SVG diagrams (docs/learn/**/*.svg). Run from the docusaurus folder:
//   npx -y svgo@3.3.2 --config svgo.config.cjs <file>.svg
// Keeps <title>, <desc>, ids and viewBox (needed for accessibility and scaling) and doesn't merge or convert shapes.
module.exports = {
    multipass: true,
    floatPrecision: 2,
    js2svg: { indent: 0, pretty: false },
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {
                    removeDesc: false,
                    removeTitle: false,
                    removeViewBox: false,
                    cleanupIds: false,
                    mergePaths: false,
                    convertShapeToPath: false
                }
            }
        }
    ]
};
