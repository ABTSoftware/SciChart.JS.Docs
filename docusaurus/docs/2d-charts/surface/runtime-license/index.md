---
sidebar_position: 3
---

# Setting a Runtime License on a SciChartSurface

Another static method which allows you to license SciChart (apply a trial or paid production or test license) is SciChartSurface.setRuntimeLicenseKey()

All of our instructions for licensing can be found at the page [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js). A quick code sample is below. Ensure that you call this function once before any SciChartSurface is shown with a valid runtime key.


```ts
import { SciChartSurface } from "scichart";

// Set a runtime key in JavaScript once before any SciChartSurface is created
SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY_HERE");
```

### Notes on Licensing

1.  **SciChart licensing is two-step.** We have a developer license for localhost and a runtime key for production or staging sites.
2.  The Runtime Key controls how your app works on a website (with encoded domain in the key). This applies to production and staging (test) sites.
3.  Staging (test) sites will have a watermark. This is expected & by design. Production sites will not have a watermark.
4.  Development activity carried out on your local PC will require an activated developer license.

:::tip
Full instructions how to activate developer licenses, how to add production & test domains to your account and how to include Runtime keys can be found at [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).
:::

### Resolving Wasm errors on load

If you get an error when loading a SciChartSurface as follows:

:::warning
**Error**: Could not load SciChart WebAssembly module. Check your build process and ensure that your scichart2d.wasm and scichart2d.js files are from the same version
:::

Please see our related article [Deploying Wasm or WebAssembly Data Files with your app](/docs/2d-charts/surface/deploying-wasm)

#### See Also

* [The SciChartSurface Type](/docs/2d-charts/surface/scichart-surface-type-overview)
* [Creating a new SciChartSurface and loading Wasm](/docs/2d-charts/surface/new-scichart-surface)
* [Deploying Wasm (WebAssembly) and Data Files with your app](/docs/2d-charts/surface/deploying-wasm)
