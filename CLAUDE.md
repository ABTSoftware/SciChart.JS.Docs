# CLAUDE.md: SciChart.js Docs

Policies for working in this repo. They were agreed with Andrew (CEO) on 13 Nov 2026. Follow them unless he changes them.

## Versions and URLs

| Version | Branch | Published at |
|---|---|---|
| Current (v6) | `v6.x` | `/documentation/js/current/` |
| v5 (archived) | `dev` | `/documentation/js/v5/` |
| v4 (archived) | `master` | `/documentation/js/v4/` |

The site's `baseUrl` is set in `docusaurus/config.ts`. TeamCity builds each branch and uploads it over SFTP to that path.

- **The latest docs always live at `/documentation/js/current/`.** Never publish the latest version under a version number.
- **When a version goes out of support,** move it to `/documentation/js/vN/` and publish the new version at `/current/`.
- **Every page of an archived version carries a canonical link to the same path under `/documentation/js/current/`.** This applies to every archived page, including `/learn/` pages (see below). It is done in `docusaurus/src/theme/Layout/index.tsx` (all pages) and `docusaurus/src/pages/index.tsx` (the version's home page). See the v4 and v5 branches for the reference implementation.
- **Archived versions also:**
  - show a banner linking to the same page in the current docs;
  - have the sitemap turned off (`sitemap: false` in `docusaurus.config.ts`).
- **Canonical only, no `noindex` yet.** Combining `noindex` with a canonical is a mixed signal to Google, and it can apply the `noindex` to the canonical target. Add `<meta name="robots" content="noindex, follow" />` only after Google Search Console shows most archived pages as "Alternate page with proper canonical tag", usually 3 to 4 weeks after the canonicals go live.
- **Before archiving a version,** check that every one of its pages has a page at the same path in the new current version. If a page was moved or renamed, point its canonical at the new path.
## Learning center (`/learn/`)

Chart-type guides ("What is a candlestick chart?") at `/documentation/js/current/learn/<chart-type>/`, in `docusaurus/docs/learn/`. Branch: `v6.x-learning-center`, off `v6.x`.

- `/learn/` is a section of the main docs sidebar, "Learn: Chart Types Guide", straight after "Get Started" (`docs/learn/_category_.json`). The "Learn" link in the top bar opens the hub.
- Keep the part of the address after `/learn/` short: `/learn/candlestick-chart/`.
- **Archived versions:** when a new version moves to `/current/`, the old version's copy of `/learn/` may stay in its archive (for example `/documentation/js/v6/learn/`). Like every archived page, each of those pages **must** carry a canonical link to the same path under `/documentation/js/current/learn/`.
- **Before writing or changing a learn page, read [docusaurus/docs/learn/CLAUDE.md](docusaurus/docs/learn/CLAUDE.md).**

**This repo is public.** Don't add internal planning, research or marketing material to it, including in commit messages, PR descriptions and code comments.
