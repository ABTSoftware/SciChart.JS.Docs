---
sidebar_position: 10
---

# FAQ: Generating a Standalone SciChart HTML File

Sometimes you may want to share your **SciChart.js chart** with someone who doesn’t want to install npm packages, run a dev server, or manage multiple files.  
Good news: you can package **all of SciChart.js (JavaScript + WebAssembly)** and your chart configuration into a **single HTML file** that runs offline in any modern browser 🚀.

This approach works by embedding the `.wasm` file as **Base64 text** instead of a binary file.  
The result is slightly larger (≈3 MB vs ≈2.3 MB) but guarantees **only one portable file**.

---

## When to Use This?

- ✅ Sharing a chart via email or file transfer  
- ✅ Embedding SciChart inside offline docs or reports  
- ✅ Creating demos for clients with no external dependencies  
- ❌ Not recommended for production deployment (prefer CDNs or proper bundling)

---

## Step 1: Clone repo & Install dependencies

```bash
# Clone this repo:
git clone https://github.com/ABTSoftware/scichart.js-standalone_html_embeder

# and install dependencies:
npm install
```

---

## Step 2: Configure your chart

The repo includes a **playground file** `drawExample.js` where you place your chart configuration.

We recommend starting in CodePen (e.g. [Base Template](https://codepen.io/vasculandrei/pen/gbOqXGE)) to quickly iterate. Once you’re happy, copy your chart setup code into `drawExample.js`.

---

## Step 3: Build the offline HTML file

Run the build script:

```bash
npm run build
```

For **3D charts**, run:

```bash
npm run build3d
```

---

## Step 4: Done! 🎉

The script will generate:

```
output.html
```

This single file includes:

* Your chart config (`drawExample.js`)
* SciChart library (`index.min.js`)
* WebAssembly runtime (Base64 encoded)

You can now open `output.html` in Chrome, Firefox, Edge, or Safari **without internet**.
It’s completely self-contained and portable.

---

:::note
* **Copy-paste workflow:** Start in CodePen → copy your code → paste into `drawExample.js`.
* **Offline ready:** No npm, no web server, no extra files required.
* **3D support:** Works the same way, just run `npm run build3d`.
* **Customization:** You can style `output.html` like any normal webpage
:::