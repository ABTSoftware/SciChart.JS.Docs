# CLAUDE.md: learning center pages (`docs/learn/`)

The rules for writing and changing learn pages are private. They're not in this repo. **Read them before doing any work in this folder, and follow them.**

1. **Look for `private/chart-type-keywords/CLAUDE.md` at the root of this repo** (`../../../private/chart-type-keywords/` from here). `/private/` is git-ignored, so the folder is only on machines where someone put it there. If it's there, read its `SYNCED-FROM.txt`, `README.md` and `CLAUDE.md`. If the copy is more than a few weeks old, tell the user and suggest getting a fresh one (step 2 or 3).
2. **If it's missing but the `Marketing` repo is cloned next to this one** (`../Marketing` from this repo's root), make the copy: run `node ../Marketing/keyword-research/chart-type-keywords/sync-to-docs.cjs` from this repo's root, then read it as in step 1.
3. **If neither is there, stop and tell the user:** "The learn page rules are private. Ask Andrew or Alicja for the learn page files, and unzip the `chart-type-keywords` folder into a folder called `private` at the root of SciChart.JS.Docs (so you have `private/chart-type-keywords/CLAUDE.md`). Then ask me again." Don't write or restructure learn pages without those rules.

**This repo is public.** Never commit anything from `private/` (never `git add -f` it), and never copy its rules, notes, research, data or scripts anywhere else in this repo. The same goes for commit messages, PR descriptions and code comments.

This file is excluded from the build (`exclude` in `docusaurus.config.ts`), so it is never published.
