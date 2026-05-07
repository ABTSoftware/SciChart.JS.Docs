const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputFile = path.join(projectRoot, "static", "scichart-financial-tools.browser.js");

const sourceCandidates = [
    process.env.SCICHART_FINANCIAL_TOOLS_BROWSER_BUNDLE,
    path.resolve(
        projectRoot,
        "../../SciChart.Dev/Web/src/SciChart/Extensions/scichart-financial-tools/lib/scichart-financial-tools.browser.mjs"
    ),
    path.resolve(projectRoot, "node_modules/scichart-financial-tools/lib/scichart-financial-tools.browser.mjs")
].filter(Boolean);

const sourceFile = sourceCandidates.find(candidate => fs.existsSync(candidate));

if (!sourceFile) {
    console.error("Unable to find scichart-financial-tools browser bundle.");
    console.error("Checked:");
    for (const candidate of sourceCandidates) {
        console.error(`  ${candidate}`);
    }
    console.error(
        "Build scichart-financial-tools first, or set SCICHART_FINANCIAL_TOOLS_BROWSER_BUNDLE to the generated .mjs file."
    );
    process.exit(1);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.copyFileSync(sourceFile, outputFile);

console.log(`Copied ${sourceFile}`);
console.log(`    to ${outputFile}`);
