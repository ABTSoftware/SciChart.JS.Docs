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

## Moving or renaming pages: always add a redirect

The site uses `@docusaurus/plugin-client-redirects` (configured in `plugins` in `docusaurus/docusaurus.config.ts`). The hosting is static files uploaded over SFTP, so there are no server-side redirects: at build time the plugin writes a small page at each old URL with an instant meta refresh and a canonical link to the new URL.

- **Every page that is moved, renamed or deleted must get a redirect from its old URL,** in the same change. Old URLs may be indexed by Google, linked from other sites or bookmarked.
  - A moved or renamed page redirects to its new URL.
  - A deleted page (for example a hub folded into its parent) redirects to the closest page that replaces it.
- **One page:** add `{ from: "/old/path/", to: "/new/path/" }` to `redirects`. **A whole folder:** add a rule to `createRedirects`, which maps each new path to its old one, so pages added to that folder later get redirects too.
- Write paths without the `baseUrl` and with a trailing slash (`trailingSlash: true`).
- Update internal links to the new URL as well. Don't rely on the redirect for links inside the docs.
- Redirects only exist in production builds. Check them with `npm run build` (look for the old path under `docusaurus/build/`) or `npm run serve`, not `npm start`. The build fails if a `to` path doesn't exist.

## Small HTML (Bing SEO rule)

Bing's Site Scan can flag pages whose HTML is too large ("HTML size is too long"), so keep each page's HTML small. This applies to every page, not only the learning center.

- **Code samples are served as plain text, then coloured in the browser.** `docusaurus/src/theme/CodeBlock/Content/index.tsx` writes each code block into the HTML as plain text (one line per row, with line numbers and highlighted lines), and Prism colours it once the page has loaded. Build-time highlighting wrapped every token in a `<span>` with an inline colour style: on learn pages that was about two thirds of the HTML (a median of 288 KB of a 417 KB page, for about 17 KB of code).
  - **Keep all sample code in the HTML.** Search engines and AI crawlers index it, so never load it only on demand (when a tab is opened) or move it out to an external link.
  - **Put code in fenced code blocks**, on their own or inside `<CodeSnippetBlock>` tabs, so it goes through Docusaurus's `CodeBlock`. Don't highlight code at build time another way, for example with `prism-react-renderer`'s `Highlight`, or with hand-written `<span>` markup.
  - **Check the HTML after a change to code blocks:** in `npm run build` output, the code is in the page's HTML with no `class="token …"` spans, and is coloured after the page loads.

## React components: no hydration mismatches

Each page is rendered to HTML at build time, then React "hydrates" it in the browser. If the two don't match, React discards the built HTML and renders the whole page again in the browser, which slows the page down (React errors #418, #423 and #425 in the console).

- **Never put CSS as a text child of `<style>`** (`<style>{css}</style>`) in a component. React escapes `>` to `&gt;` in the built HTML, and a `<style>` element doesn't decode it, so the CSS breaks and hydration fails. Use `<style dangerouslySetInnerHTML={{ __html: css }} />`, or a CSS module.
- **Render the same thing on the server and in the browser's first render.** Anything that depends on the browser (`window`, the screen size, the current date) goes in a `useEffect`, `useIsBrowser` or `<BrowserOnly>`.
- **Check after changing a component:** load a production build (`npm run build`, then `npm run serve`) and look for React errors in the console. `npx docusaurus build --dev` gives the full messages, naming the text that doesn't match.

## Learning center (`/learn/`)

Guides to data visualisation ("What is a candlestick chart?", "How to read a log scale") at `/documentation/js/current/learn/`, in `docusaurus/docs/learn/`. Branch: `v6.x-learning-center`, off `v6.x`.

- `/learn/` is the Learning Center hub. It is organised in sections, each a folder with its own hub page and `_category_.json`: `chart-types/` ("Types of Charts and Graphs", grouped into `cartesian/`, `radial/`, `complex/` and `3d/`), `axes-and-scales/`, `real-time/`, `big-data/` and `applications/` (guides grouped by sector in the sidebar, with `machine-learning/` and `signal-processing/` as sub-folders that have no hub page of their own). A page's address follows its folder, for example `/learn/chart-types/cartesian/candlestick-chart/`. Don't override it with a `slug`: live demos load their code relative to the page address.
- The Learning Center is a section of the main docs sidebar, straight after "Get Started" (`docs/learn/_category_.json`). The "Learn" link in the top bar opens the hub.
- Keep slugs short and link between learn pages with the full path (`/learn/chart-types/cartesian/histogram/`).
- **Compress every image before committing it** (run from `docusaurus/`):
  - **PNG page images** (`static/img/learn/<slug>-og.png`, made by the page image script): run `sh scripts/compress-learn-images.sh` (or pass the new files as arguments), then `sh scripts/make-learn-thumbnails.sh`. It shrinks each image to a 256-colour palette with `pngquant`, then recompresses with `oxipng`. They stay 1200×630 PNGs at the same path, because they're also the share image (`og:image`). Expect about 60 to 200 KB each; an uncompressed one is 400 to 800 KB. Needs `brew install pngquant oxipng webp`.
  - **SVG diagrams** (in each page folder): minify with svgo using the repo's settings, which keep `<title>`, `<desc>`, IDs and `viewBox`: `npx -y svgo@3.3.2 --config svgo.config.cjs <file>.svg`. Look at the diagram afterwards.
  - **Other images** (JPG, PNG examples): no wider than twice the width they're shown at (a 240 px thumbnail → 480 px), JPEG quality about 80.
- **Moving learn pages:** a page's URL follows its folder, so moving a folder changes its URLs. Add a redirect for every page moved (see *Moving or renaming pages* above), and update the `related:` front matter, section hubs and the sidebar generator (`custom-plugins/learnSidebarGenerator.ts`) where needed.
- **Archived versions:** when a new version moves to `/current/`, the old version's copy of `/learn/` may stay in its archive (for example `/documentation/js/v6/learn/`). Like every archived page, each of those pages **must** carry a canonical link to the same path under `/documentation/js/current/learn/`.
- **Before writing or changing a learn page, read [docusaurus/docs/learn/CLAUDE.md](docusaurus/docs/learn/CLAUDE.md).** It points to the private rules, which are kept in the git-ignored `private/` folder.

**This repo is public.** Don't add internal planning, research or marketing material to it, including in commit messages, PR descriptions and code comments. Anything private goes in `/private/`, which is git-ignored: never commit it.
