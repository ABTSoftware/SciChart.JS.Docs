---
sidebar_position: 6
---

# Upgrading with the scichart-migrate tool

`scichart-migrate` is a command-line tool that migrates a project across SciChart.js breaking-change
boundaries, from v3 all the way to v6.

It reads your project's `scichart` version, works out which boundaries you are crossing, rewrites
what is safe to rewrite, and reports everything else with a `file:line` and the fix.

```bash
npx scichart-migrate                 # dry run of the current directory (nothing is written)
npx scichart-migrate --write         # apply the rewrites
npx scichart-migrate --path ./app    # somewhere other than "."
```

It is published separately from `scichart`, so there is nothing to install.

:::tip Read this before you run it

- **`--dry-run` is the default.** Nothing is written until you pass `--write`. Read the report
  first — it is the product, not a side effect.
- **Run it _before_ you install the new version.** Installing v6 is what breaks your wasm copy
  configuration, so the tool has zero runtime dependencies and never needs your `node_modules` to
  be correct. It also means you can run it on a project that no longer installs.
- **Commit or stash your work first.** The tool edits files in place and has no undo.

:::

## What the report looks like

Running a dry run against a small v5 project:

```text
Detected scichart 5.2.1 (from package.json dependencies)
scichart-migrate (DRY RUN — nothing written)
Boundaries applied: v5 -> v6

Would rewrite: 17 sites
  copy-files-from-to.json:4  scichart2d.wasm  ->  scichart.wasm
  copy-files-from-to.json:7  fileName drop scichart3d.wasm  ->  (entry removed)
  src/app.ts:2  import { ECoordinateMode, AnnotationBase } from "scichart/Charting/Visuals/Annotations/AnnotationBase";  ->  import { AnnotationBase } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
  src/app.ts:7  SciChart3DSurface.configure  ->  SciChartSurface.configure
  src/app.ts:9  SimdHelper  ->  FeatureDetectionHelper
  webpack.config.js:9  scichart2d.wasm  ->  scichart.wasm
  webpack.config.js:11  fileName drop scichart3d-nosimd.wasm  ->  (entry removed)

Needs your review: 1
  README.md:3  "scichart3d.wasm" no longer exists — the union build ships one binary for both 2D
              and 3D — but this line also mentions another payload, so it needs an edit rather
              than a deletion.

Cannot be detected automatically — check these by hand:
  - If you opt into wasm64, deploy scichart-64.wasm alongside scichart.wasm. It is not added to
    your copy list automatically because the tool cannot tell whether you want it.
  - To get tree-shaking in a TypeScript + webpack app, set module: "esnext" and
    moduleResolution: "bundler" in tsconfig.json.

Re-run with --write to apply the rewrites above.
```

## Options

| Option             | Meaning                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `--path <dir>`     | Project root to scan. Default `"."`.                                                                                         |
| `--from <version>` | Your current `scichart` version. Default: detected from `package.json`, falling back to `node_modules/scichart/package.json`. |
| `--to <version>`   | Target version. Default `"6.0.0"`.                                                                                           |
| `--write`          | Apply the rewrites. Without it, nothing is written.                                                                          |
| `--dry-run`        | Report only. This is the default; the flag exists so you can be explicit.                                                     |
| `-h`, `--help`     | Usage.                                                                                                                       |

Exit code is `0` whenever the run completed, including when it found review items. `1` means the run
could not start: an unknown flag, or a version it could not detect with no `--from` given.

:::note
A dependency of `"latest"` names no version, so those projects need `--from` — the tool will not
guess which boundaries you are crossing.
:::

## What it does and does not touch

Coverage matters less than being trustworthy about which changes are safe, so every rule falls into
one of three tiers.

### Rewritten for you

Deep-import paths for symbols that moved, wasm copy lists across five bundler dialects, the removed
`SciChart3DSurface` wasm statics, `SimdHelper` → `FeatureDetectionHelper`, the 3D-suffixed globals,
`HitTestInfo.dataSeriesName` → `seriesName`, and `subChartPadding` → `padding`.

### Reported, never edited

Some changes break working code if applied blindly. The clearest example: `parseColorToUIntArgb` must
become `parseColorToUIntAbgr` **only** inside `IAdvancedPaletteProvider.applyPaletting`. Everywhere
else — `overrideStrokeArgb`, `overrideFillArgb`, `overridePointMarkerArgb` — it is still ARGB, and
changing it swaps red and blue. No amount of text matching can tell those apart, so the tool does not
guess: it reports the site and leaves the decision to you.

### Printed once per run

Changes that leave no trace in your source to match against, so there is no `file:line` to report —
the tree-shaking `tsconfig` settings, for example.

:::info Generated and vendored files are skipped
A committed bundle, or a vendored copy of SciChart itself, is skipped — and the tool says so rather
than skipping silently. Rewriting a build artifact is pointless, and rewriting a vendored release
makes it disagree with the version it actually is.
:::

## Which boundaries it knows

`v3 → v4`, `v4 → v5`, `v5.1 → v5.2`, and `v5 → v6`.

Packs chain: a project on 4.1 going to 6 gets the v5, v5.2 and v6 packs, and correctly skips v4.
`v2 → v3` is out of scope.

Each boundary has a page of its own, and the tool is a companion to those pages rather than a
replacement for reading them:

- [Breaking Changes in v4.x from v3.x](/whats-new/breaking-changes-v3-v4/)
- [Breaking Changes in v5.x from v4.x](/whats-new/breaking-changes-v4-v5/)
- [Breaking Changes in v5.2 from v5.1](/whats-new/breaking-changes-v5.1-v5.2/)

## What it deliberately cannot do

- **Add** a file to a copy list. v5 introduced the no-SIMD fallback binaries, so copy lists _grew_;
  writing a syntactically correct new entry for every bundler dialect is a different and riskier job
  than editing one that already exists. If you stop at v5, add those two files by hand. Going on to
  v6 makes the final set `scichart.wasm` + `scichart-nosimd.wasm`, which the tool does rewrite.
- **Opt you into wasm64.** If you want it, deploy `scichart-64.wasm` yourself — it is a separate
  binary and is not contained within `scichart.wasm`. See
  [Deploying Wasm](/2d-charts/surface/deploying-wasm/#wasm64).
- **Delete a statement or a property.** When `SciChart3DSurface.configure(...)` becomes
  `SciChartSurface.configure(...)` you may be left with two identical calls where you previously had
  two different ones. That is harmless, and collapsing them is a judgement about your code that the
  tool will not make for you.
- **Prune a now-unused import.** After that same rewrite, a `SciChart3DSurface` import may be unused
  — or may still be needed by chart code on the next line. An unused import is harmless; a wrongly
  removed one is not.
- **Understand namespace imports.** `import * as x from "scichart/..."` has no brace list to
  partition, so it is reported rather than rewritten.
- **Choose your tree-shaking settings.** For tree-shaking in a TypeScript + webpack app you need
  `module: "esnext"` and `moduleResolution: "bundler"`; with `commonjs`, TypeScript downlevels your
  `import` to `require()` before webpack sees it and the whole library is bundled.
- **Tell you your fonts changed.** The default native font became Arimo in v5.
- **Restore the WebGL 1 fallback.** Removed in v5; v5 and later are WebGL 2 only.

## See Also

- [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/)
