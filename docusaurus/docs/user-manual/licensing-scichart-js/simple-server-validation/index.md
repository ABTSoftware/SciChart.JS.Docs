---
sidebar_position: 6.5
---

# Simple Server Validation

:::info
Simple Server Validation is an Advanced Licensing option that requires no native DLL, no FFI, and no challenge/response handshake.
Your server computes an HMAC-SHA256 token and returns it to SciChart.js, which verifies it in WASM.

This requires a license with the **`SV` (Simple Validation) feature flag**. Contact [technical sales](https://www.scichart.com/contact-us#pre-sales) to have this enabled on your order,
or [submit a support request](https://www.scichart.com/contact-us#tech-support) if you are unsure which Advanced Licensing solution is right for your use case.
:::

## When to use this

Simple Server Validation is the right choice if:

- You have a **web server you control** and want to deploy SciChart.js to unknown or user-controlled domains (OEM scenarios).
- You are building an **Electron** or **Tauri** desktop application and want to keep the HMAC secret in the privileged process.
- You want the **simplest possible integration** — a few lines in any language that supports HMAC-SHA256.

If you need strong challenge-based domain binding enforced at the cryptographic level rather than by CORS, see [Deploying with Advanced Licensing (Native Server)](/user-manual/licensing-scichart-js/deploying-with-advanced-licensing/).

## How it works

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>
  ← 200 OK  nonce:expiry:hmac

SciChart WASM verifies the HMAC, caches the result for 7 days.
Re-validates automatically every 24 hours.
```

1. Set your runtime license key (the one with the `SV` flag) using `SciChartSurface.setRuntimeLicenseKey(...)`.
2. On first chart creation SciChart calls `GET /api/license?orderid=<X>` (the default endpoint; override with `SciChartSurface.setServerLicenseEndpoint(...)`).
3. Your server uses the **Server Secret** associated with your runtime key, computes `HMAC-SHA256(serverSecret, "nonce:expiry")`, and returns the token `nonce:expiry:hmac`.
4. SciChart verifies the token in WASM and caches it in a cookie. No further server round-trips are needed for 7 days.

No challenge parameter is sent from the client — CORS provides the domain-binding security. The token is symmetric: only servers that hold the Server Secret can produce a valid token.

:::warning
Always **hex-decode the Server Secret to raw bytes** before using it as the HMAC key. Do not pass the hex string directly.
:::

## What you need

### Server Secret

Find your **Server Secret** in [SciChart MyAccount](https://www.scichart.com/my-account/) under **Orders & Keys → Manage Licenses → Advanced Licensing**.
It is a 64-character hex string (32 bytes). It will only be present if Simple Validation is enabled on your order.

Keep this value secret — it is analogous to a private key. Never expose it to the browser, commit it to source control, or include it in client-side bundles.

### Client license key

This is the full license key string you pass to `SciChartSurface.setRuntimeLicenseKey(...)`, the same key you would use for a normal deployment. It must have the `SV` feature flag.

## Token format

The server must return a plain-text response body in the format:

```
nonce:expiry:hmac
```

Where:
- `nonce` — 8 random bytes encoded as 16 lowercase hex characters
- `expiry` — Unix timestamp (seconds), 7 days from now
- `hmac` — `HMAC-SHA256(rawKeyBytes, "nonce:expiry")` as 64 lowercase hex characters

Tokens are not user-specific. It is safe (and recommended) to cache one token per server process and reuse it across all requests, regenerating when fewer than 2 days remain before expiry.

## Implementation

### Node.js

```typescript
import { createHmac, randomBytes } from "crypto";

const SCICHART_SERVER_SECRET = process.env.SCICHART_SERVER_SECRET!;

let cachedToken = "";
let cachedExpiry = 0;

app.get("/api/license", (_req, res) => {
    const now = Math.floor(Date.now() / 1000);
    if (!cachedToken || cachedExpiry - now < 2 * 24 * 3600) {
        const key    = Buffer.from(SCICHART_SERVER_SECRET, "hex");
        const nonce  = randomBytes(8).toString("hex");
        const expiry = now + 7 * 24 * 3600;
        const hmac   = createHmac("sha256", key).update(`${nonce}:${expiry}`).digest("hex");
        cachedToken  = `${nonce}:${expiry}:${hmac}`;
        cachedExpiry = expiry;
    }
    res.send(cachedToken);
});
```

### .NET (C#) — Minimal API

```csharp
using System.Security.Cryptography;
using System.Text;

const string secret = Environment.GetEnvironmentVariable("SCICHART_SERVER_SECRET")!;
string? cachedToken = null;
long cachedExpiry = 0;

app.MapGet("/api/license", () =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    if (cachedToken is null || cachedExpiry - now < 2 * 24 * 3600)
    {
        var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
        var expiry = now + 7 * 24 * 3600;
        var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
        var key    = Convert.FromHexString(secret);
        using var hmac = new HMACSHA256(key);
        var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
        cachedToken  = $"{nonce}:{expiry}:{mac}";
        cachedExpiry = expiry;
    }
    return cachedToken;
});
```

### .NET (C#) — MVC Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    private static readonly string Secret =
        Environment.GetEnvironmentVariable("SCICHART_SERVER_SECRET")!;

    private static string? _cachedToken;
    private static long _cachedExpiry;

    [HttpGet]
    public string Get()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        if (_cachedToken is null || _cachedExpiry - now < 2 * 24 * 3600)
        {
            var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
            var expiry = now + 7 * 24 * 3600;
            var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
            var key    = Convert.FromHexString(Secret);
            using var hmac = new HMACSHA256(key);
            var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
            _cachedToken  = $"{nonce}:{expiry}:{mac}";
            _cachedExpiry = expiry;
        }
        return _cachedToken;
    }
}
```

### Spring Boot (Java)

```java
@RestController
public class LicenseController {

    private static final String SECRET =
        System.getenv("SCICHART_SERVER_SECRET");

    private static String cachedToken = null;
    private static long cachedExpiry = 0;

    @GetMapping("/api/license")
    public synchronized String get() throws Exception {
        long now = System.currentTimeMillis() / 1000;
        if (cachedToken == null || cachedExpiry - now < 2 * 24 * 3600) {
            var hex    = HexFormat.of();
            var nonce  = hex.formatHex(SecureRandom.getSeed(8));
            var expiry = now + 7 * 24 * 3600;
            var msg    = (nonce + ":" + expiry).getBytes(StandardCharsets.UTF_8);
            var key    = hex.parseHex(SECRET);
            var mac    = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            cachedToken  = nonce + ":" + expiry + ":" + hex.formatHex(mac.doFinal(msg));
            cachedExpiry = expiry;
        }
        return cachedToken;
    }
}
```

### Other languages

The pattern is the same in any language: hex-decode the Server Secret, generate a random 8-byte nonce, set an expiry 7 days from now, compute `HMAC-SHA256(key, "nonce:expiry")`, return `nonce:expiry:hmac`.

Runnable snippets for Python, Go, Ruby, PHP, and Rust are included in the [SimpleServerSideLicensing README](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/SimpleServerSideLicensing) on GitHub.

### Client-side setup

On the browser side, the only change from a standard license setup is adding the server endpoint URL if it differs from the default `api/license`:

```typescript
// SciChart automatically calls GET /api/license?orderid=... on startup.
// Only needed if your endpoint is at a different path:
SciChartSurface.setServerLicenseEndpoint("/your/custom/path");

SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");
```

## Desktop apps (Electron and Tauri)

Desktop apps don't have a traditional HTTP server, but can use the same HMAC pattern by computing the token in the privileged process and delivering it to the renderer via IPC, bypassing the HTTP fetch entirely.

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

ipcMain.handle("get-license-token", (): string => {
    const key    = Buffer.from(SCICHART_SERVER_SECRET, "hex");
    const nonce  = randomBytes(8).toString("hex");
    const expiry = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
    const hmac   = createHmac("sha256", key).update(`${nonce}:${expiry}`).digest("hex");
    return `${nonce}:${expiry}:${hmac}`;
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
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

#[tauri::command]
fn get_license_token(cache: tauri::State<Mutex<LicenseCache>>) -> String {
    let key = hex::decode(SCICHART_SERVER_SECRET).expect("valid hex");
    let nonce = hex::encode(rand::thread_rng().gen::<[u8; 8]>());
    let expiry = unix_now() + 7 * 24 * 3600;
    let msg = format!("{}:{}", nonce, expiry);
    let mut mac = HmacSha256::new_from_slice(&key).unwrap();
    mac.update(msg.as_bytes());
    format!("{}:{}:{}", nonce, expiry, hex::encode(mac.finalize().into_bytes()))
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

| Folder | Stack |
|--------|-------|
| [`nodejs-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/nodejs-simple-server-licensing) | Node.js + Express |
| [`dotnet-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/dotnet-simple-server-licensing) | ASP.NET Core Minimal API |
| [`dotnet-mvc-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/dotnet-mvc-simple-server-licensing) | ASP.NET Core MVC |
| [`java-spring-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/java-spring-simple-server-licensing) | Spring Boot 3 |
| [`electron-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/electron-simple-server-licensing) | Electron (IPC) |
| [`tauri-simple-server-licensing`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/tauri-simple-server-licensing) | Tauri (Rust invoke bridge) |

Each folder contains a `README.md` with setup instructions and a complete runnable app you can use to verify your keys before integrating into your own project.

:::info
The validation result is stored in a cookie, so each client browser only needs to contact your `/api/license` endpoint once per week. Re-validation happens automatically in the background every 24 hours.
:::
