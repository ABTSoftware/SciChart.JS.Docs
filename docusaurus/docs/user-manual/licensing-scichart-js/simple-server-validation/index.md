---
sidebar_position: 6.5
---

# Simple Server Validation

:::info
Simple Server Validation is an Advanced Licensing option that requires no native DLL, no FFI, and no asymmetric challenge/response.
Your server computes an HMAC-SHA256 token and returns it to SciChart.js, which verifies it in WASM.

This requires a license with the **`SV:H:V:N` feature flag**. Contact [technical sales](https://www.scichart.com/contact-us#pre-sales) to have this enabled on your order,
or [submit a support request](https://www.scichart.com/contact-us#tech-support) if you are unsure which Advanced Licensing solution is right for your use case.
:::

:::tip On ASP.NET Core?
There's a drop-in NuGet package: [**`SciChart.AspNetCore.SimpleLicensing`**](./aspnet-core) gives you a token service, a `<scichart-license />` tag helper for the layout, and a `MapSciChartLicenseEndpoint()` extension &mdash; the cross-language guidance below is still worth reading, but you won't need to write the HMAC code yourself.
:::

## When to use this

Simple Server Validation is the right choice if:

- You have a **web server you control** and want to deploy SciChart.js to unknown or user-controlled domains (OEM scenarios).
- You are building an **Electron** or **Tauri** desktop application and want to keep the HMAC secret in the privileged process.
- You want the **simplest possible integration** — a few lines in any language that supports HMAC-SHA256.

If you need cryptographically enforced domain binding (rather than relying on CORS + client nonce), see [Deploying with Advanced Licensing (Native Server)](/user-manual/licensing-scichart-js/deploying-with-advanced-licensing/).

## Two delivery shapes

A v2 token can take one of two shapes on the wire:

- **Inline** (4 fields) — `v2:serverNonce:serverNow:hmac`. Independent of any client state. Can be served to many clients or embedded in served HTML via a `<meta>` tag for a zero-round-trip first paint. Should still be signed per request — the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the token is older than the licence's tolerance, so caching past that point causes valid clients to reject otherwise-correct tokens.
- **Round-trip** (5 fields) — `v2:clientNonce:serverNonce:serverNow:hmac`. The client generates a random nonce inside the SciChart WASM module and sends it as `?nonce=<hex>`; the server echoes it into the signed token. A captured response is bound to the requesting client and cannot be replayed on another origin.

For most deployments the two shapes are **interchangeable under a single licence**: your server can hand out an inline token embedded in HTML for first paint *and* a round-trip token for subsequent re-validation; the SciChart client accepts whichever arrives. This is the common case.

The exception is deployments that cannot keep server and client clocks in reasonable alignment. There, inline delivery becomes risky — a token cached on a CDN or pinned into a long-lived HTML response can drift outside the skew envelope before it's verified, whereas a round-trip token is signed against the request that produced it and never has time to go stale. Such deployments should be locked to round-trip only.

The fourth field of the `SV:H:V:N` feature flag captures this:

- `validate_nonce=0` (the permissive default) — the licence accepts either shape. Your server is free to use both delivery channels.
- `validate_nonce=1` (the restricted SKU) — the licence accepts the round-trip shape only. The inline meta-tag delivery path is disabled, because the server has no client nonce at HTML render time.

The server is permissive about which shape to emit: if the request carries `?nonce=<hex>`, sign a round-trip token; otherwise sign an inline token. The licence on the client side decides what it'll accept.

## How it works

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>[&nonce=<hex>]    (nonce only in round-trip mode)
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac

SciChart WASM verifies the HMAC, checks the server/client clock skew against
max_skew, enforces server-time monotonicity across re-validations, and
caches the result in a cookie until valid_time has elapsed.
```

1. Set your runtime license key (carrying an `SV:H:V:N` feature) using `SciChartSurface.setRuntimeLicenseKey(...)`.
2. On first chart creation SciChart calls `GET /api/license?orderid=<X>`. In round-trip mode it also appends `&nonce=<hex>` — the nonce is generated inside the WASM module.
3. Your server uses the **Server Secret** associated with your runtime key, computes `HMAC-SHA256(serverSecret, payload)`, and returns the signed token.
4. SciChart verifies the token in WASM and caches it in a cookie. Re-validation happens automatically before the cookie expires.

:::warning
Always **hex-decode the Server Secret to raw bytes** before using it as the HMAC key. Do not pass the hex string directly.
:::

## Feature-flag parameters

The SV feature string is `SV:<max_skew>:<valid_time>:<validate_nonce>`. The three parameters give SciChart product control of the security/UX trade-off per licence SKU:

| Parameter        | Format       | Range          | Meaning                                                                                                                                                                                                              |
| ---------------- | ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_skew`       | `H` or `H.MM`| 0 to 8760.00   | Accepted absolute difference between server time and client wall clock at token acceptance, written as hours-dot-minutes (`MM` is a literal minute count, 00–59 — not a fractional hour). Upper bound is 8760 hours (1 year). `0` disables the skew check entirely — an escape hatch for embedded or air-gapped devices with unreliable clocks. |
| `valid_time`     | `H` or `H.MM`| 0.01 to 168.00 | Duration the token remains valid in the client's wall clock after acceptance, same `H.MM` format. Upper bound is 168 hours (1 week). Shorter values bound the replay window if a token is captured.                  |
| `validate_nonce` | `0` or `1`   | —              | `0` — permissive: the licence accepts either inline or round-trip tokens. `1` — restricted: only round-trip tokens are accepted, inline delivery is disabled. The restricted setting is for deployments where client/server clock alignment can't be guaranteed (see "Two delivery shapes" above).         |

The `H.MM` format is two integer parses split on a dot: `0.05` is 5 minutes, `1.30` is 1 hour 30 minutes, `168` is 168 hours, `168.00` is also 168 hours. Bare `H` (no dot) is equivalent to `H.00`.

Example licences:

- `SV:1:168:0` — 1-hour skew tolerance, 7-day validity, permissive. Default web deployment.
- `SV:24:24:1` — 24-hour skew tolerance, 24-hour validity, restricted to round-trip. Strong security for OEM deployments where clocks may drift.
- `SV:0:0.05:1` — no skew check, 5-minute validity, restricted to round-trip. Embedded devices with no reliable clock; the short window and client-nonce binding carry the security weight.
- `SV:0.30:1.30:0` — 30-minute skew tolerance, 90-minute validity, permissive.

## What you need

### Server Secret

Find your **Server Secret** in [SciChart MyAccount](https://www.scichart.com/my-account/) under **Orders & Keys → Manage Licenses → Advanced Licensing**.
It is a 64-character hex string (32 bytes). It will only be present if Simple Validation is enabled on your order.

Keep this value secret — it is analogous to a private key. Never expose it to the browser, commit it to source control, or include it in client-side bundles.

### Client license key

This is the full license key string you pass to `SciChartSurface.setRuntimeLicenseKey(...)`, the same key you would use for a normal deployment. It must carry an `SV:H:V:N` feature.

## Token format

The server returns a plain-text response body. The format depends on the mode:

**Inline mode** — 4 colon-separated fields:

```
v2:<serverNonce>:<serverNow>:<hmac>
```

**Round-trip mode** — 5 colon-separated fields:

```
v2:<clientNonce>:<serverNonce>:<serverNow>:<hmac>
```

Where:

- `v2` — literal version marker
- `clientNonce` (round-trip only) — verbatim echo of the request's `?nonce=` query parameter
- `serverNonce` — 8 random bytes encoded as 16 lowercase hex characters
- `serverNow` — server wall-clock Unix timestamp (seconds), decimal
- `hmac` — `HMAC-SHA256(serverSecretBytes, payload)` as 64 lowercase hex characters, where `payload` is the entire token text up to (but not including) the final `:` and HMAC field

Inline tokens are not bound to a particular client, but should still be signed per request — the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the token is older than the licence's tolerance, so caching past that point causes valid clients to reject otherwise-correct tokens. Round-trip responses must not be cached either — each request gets its own signed token.

## Implementation

### Node.js

```typescript
import express from "express";
import { createHmac, randomBytes } from "crypto";

const SCICHART_SERVER_SECRET = process.env.SCICHART_SERVER_SECRET!;
const secretBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");

const CLIENT_NONCE_PATTERN = /^[0-9a-fA-F]{8,64}$/;

const signToken = (payload: string): string => {
    const hmac = createHmac("sha256", secretBuffer).update(payload).digest("hex");
    return `${payload}:${hmac}`;
};

app.get("/api/license", (req, res) => {
    const now = Math.floor(Date.now() / 1000);
    const rawNonce = typeof req.query.nonce === "string" ? req.query.nonce : "";
    const serverNonce = randomBytes(8).toString("hex");

    if (rawNonce) {
        if (!CLIENT_NONCE_PATTERN.test(rawNonce)) {
            res.status(400).send("Error: malformed client nonce");
            return;
        }
        res.send(signToken(`v2:${rawNonce}:${serverNonce}:${now}`));
        return;
    }

    res.send(signToken(`v2:${serverNonce}:${now}`));
});
```

:::tip ASP.NET Core users
Skip the hand-written snippets below and use the drop-in [**`SciChart.AspNetCore.SimpleLicensing`**](./aspnet-core) package: one line of DI registration, a `<scichart-license />` tag helper for the layout, and a `MapSciChartLicenseEndpoint()` extension. It also handles the inline meta-tag delivery so SciChart validates without an XHR on initial page load. The snippets below remain accurate if you'd rather hand-roll the controller in an existing project.
:::

### .NET (C#) — Minimal API

```csharp
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

var secret      = Environment.GetEnvironmentVariable("SCICHART_SERVER_SECRET")!;
var secretBytes = Convert.FromHexString(secret);
var noncePattern = new Regex("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

string Sign(string payload)
{
    var mac = HMACSHA256.HashData(secretBytes, Encoding.UTF8.GetBytes(payload));
    return $"{payload}:{Convert.ToHexString(mac).ToLowerInvariant()}";
}

app.MapGet("/api/license", (HttpContext ctx) =>
{
    var now         = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var clientNonce = ctx.Request.Query["nonce"].ToString();
    var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();

    if (!string.IsNullOrEmpty(clientNonce))
    {
        if (!noncePattern.IsMatch(clientNonce))
            return Results.BadRequest("Error: malformed client nonce");
        return Results.Content(Sign($"v2:{clientNonce}:{serverNonce}:{now}"), "text/plain");
    }

    return Results.Content(Sign($"v2:{serverNonce}:{now}"), "text/plain");
});
```

### .NET (C#) — MVC Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    private static readonly byte[] SecretBytes =
        Convert.FromHexString(Environment.GetEnvironmentVariable("SCICHART_SERVER_SECRET")!);

    private static readonly Regex NoncePattern =
        new("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

    private static string Sign(string payload)
    {
        var mac = HMACSHA256.HashData(SecretBytes, Encoding.UTF8.GetBytes(payload));
        return $"{payload}:{Convert.ToHexString(mac).ToLowerInvariant()}";
    }

    [HttpGet]
    public ActionResult Get([FromQuery] string? nonce)
    {
        var now         = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();

        if (!string.IsNullOrEmpty(nonce))
        {
            if (!NoncePattern.IsMatch(nonce))
                return BadRequest("Error: malformed client nonce");
            return Content(Sign($"v2:{nonce}:{serverNonce}:{now}"), "text/plain");
        }

        return Content(Sign($"v2:{serverNonce}:{now}"), "text/plain");
    }
}
```

### Spring Boot (Java)

```java
@RestController
public class LicenseController {

    private static final byte[] SECRET_BYTES =
        HexFormat.of().parseHex(System.getenv("SCICHART_SERVER_SECRET"));

    private static final Pattern NONCE_PATTERN =
        Pattern.compile("^[0-9a-fA-F]{8,64}$");

    private static final SecureRandom RNG = new SecureRandom();

    private static String sign(String payload) throws Exception {
        var mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET_BYTES, "HmacSHA256"));
        return payload + ":" + HexFormat.of()
            .formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    }

    private static String randHex(int n) {
        var bytes = new byte[n];
        RNG.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    @GetMapping(value = "/api/license", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> get(
            @RequestParam(name = "nonce", required = false) String clientNonce) throws Exception {
        long now           = System.currentTimeMillis() / 1000;
        var  serverNonce   = randHex(8);

        if (clientNonce != null && !clientNonce.isEmpty()) {
            if (!NONCE_PATTERN.matcher(clientNonce).matches())
                return ResponseEntity.badRequest().body("Error: malformed client nonce");
            return ResponseEntity.ok(sign("v2:" + clientNonce + ":" + serverNonce + ":" + now));
        }

        return ResponseEntity.ok(sign("v2:" + serverNonce + ":" + now));
    }
}
```

### Other languages

The pattern is the same in any language:

1. Hex-decode the Server Secret to bytes once at startup.
2. Validate `?nonce=<value>` against `^[0-9a-fA-F]{8,64}$` if present; return 400 on mismatch.
3. Build the payload (`v2:<clientNonce>:<serverNonce>:<serverNow>` for round-trip, or `v2:<serverNonce>:<serverNow>` for inline).
4. Compute `HMAC-SHA256(secret, payload)` and append as `:<hex>`.

Runnable snippets for Python (Flask, Django), Go, Ruby, PHP, and Rust are included in the [SimpleServerSideLicensing README](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/SimpleServerSideLicensing-Readme.md) on GitHub.

### Client-side setup

On the browser side, no special configuration is needed for either mode. The SciChart runtime decides what to send based on the licence's feature flag:

```typescript
// SciChart automatically calls GET /api/license?orderid=...
// In round-trip mode it also appends &nonce=<hex> generated inside WASM.
// Only call setServerLicenseEndpoint if your endpoint is at a non-default path:
SciChartSurface.setServerLicenseEndpoint("/your/custom/path");

SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");
```

## Desktop apps (Electron and Tauri)

Desktop apps don't have a traditional HTTP server. They can use the same HMAC pattern by computing the token in the privileged process and delivering it to the renderer via IPC, bypassing the HTTP fetch entirely.

:::info
Desktop integrations that use `setLicenseCallback` or the inline-token bypass run **inline mode only** (`validate_nonce=0`). The privileged-process callback has no opportunity to receive a client nonce from the WASM runtime, so round-trip mode is not available on this path. Since the token is generated in a trusted local process and never traverses an untrusted network, the cross-origin replay defence round-trip mode provides isn't meaningful here anyway.
:::

:::tip
In a desktop app the Server Secret never needs to be stored on a remote server — it lives in the native binary or main process alongside your other app secrets.
Tauri's Rust backend is particularly strong here: the compiled binary makes the secret significantly harder to extract than JavaScript in an Electron main process.
:::

### Electron

Use `SciChartSurface.setLicenseCallback` to replace SciChart's normal HTTP fetch with an IPC call. The HMAC is computed in the Electron main process; the renderer never sees the Server Secret.

**Main process (`main.ts`):**

```typescript
import { ipcMain } from "electron";
import { createHmac, randomBytes } from "crypto";

const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";
const secretBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");

ipcMain.handle("get-license-token", (): string => {
    const serverNonce = randomBytes(8).toString("hex");
    const serverNow   = Math.floor(Date.now() / 1000);
    const payload     = `v2:${serverNonce}:${serverNow}`;
    const hmac        = createHmac("sha256", secretBuffer).update(payload).digest("hex");
    return `${payload}:${hmac}`;
});
```

**Preload (`preload.ts`):**

```typescript
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    getLicenseToken: () => ipcRenderer.invoke("get-license-token"),
});
```

**Renderer (`renderer.ts`):**

```typescript
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");

SciChartSurface.setLicenseCallback(async (): Promise<Response> => {
    const token = await window.electronAPI.getLicenseToken();
    return new Response(token);
});
```

### Tauri

The pattern is identical in concept. The HMAC is computed in the Rust backend using the `hmac` and `sha2` crates; the webview calls it via `invoke`.

**Rust backend (`src-tauri/src/lib.rs`):**

```rust
use hmac::{Hmac, Mac};
use rand::RngCore;
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

#[tauri::command]
fn get_license_token() -> String {
    let key = hex::decode(SCICHART_SERVER_SECRET).expect("valid hex");
    let mut nonce_bytes = [0u8; 8];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let server_nonce = hex::encode(nonce_bytes);
    let server_now   = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    let payload      = format!("v2:{server_nonce}:{server_now}");
    let mut mac = HmacSha256::new_from_slice(&key).unwrap();
    mac.update(payload.as_bytes());
    format!("{payload}:{}", hex::encode(mac.finalize().into_bytes()))
}
```

**Frontend (`renderer.ts`):**

```typescript
import { invoke } from "@tauri-apps/api/core";

SciChartSurface.setLicenseCallback(async (): Promise<Response> => {
    const token = await invoke<string>("get_license_token");
    return new Response(token);
});
```

## Runnable examples

Full working projects for each stack are in the [SciChart.JS.Examples GitHub repository](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing):

| Folder                                                                                                                                                | Stack                      | Mode                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------- |
| [`SciChart.AspNetCore.SimpleLicensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/SciChart.AspNetCore.SimpleLicensing)     | ASP.NET Core (package)     | Inline meta tag + round-trip endpoint &mdash; see [ASP.NET Core](./aspnet-core) |
| [`nodejs-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/nodejs-simple-server-licensing)             | Node.js + Express          | Inline + round-trip               |
| [`dotnet-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/dotnet-simple-server-licensing)             | ASP.NET Core Minimal API   | Inline + round-trip               |
| [`dotnet-mvc-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/dotnet-mvc-simple-server-licensing)     | ASP.NET Core MVC (consumes the package) | Inline + round-trip               |
| [`java-spring-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/java-spring-simple-server-licensing)   | Spring Boot 3              | Inline + round-trip               |
| [`electron-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/electron-simple-server-licensing)         | Electron (IPC)             | Inline only                       |
| [`tauri-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/tauri-simple-server-licensing)               | Tauri (Rust invoke bridge) | Inline only                       |

Each folder contains a `README.md` with setup instructions and a complete runnable app you can use to verify your keys before integrating into your own project.

:::info
The validation result is stored in a cookie, so each client browser only needs to contact your `/api/license` endpoint once per `valid_time`. Re-validation happens automatically in the background every 24 hours (or sooner if `valid_time` is shorter).
:::
