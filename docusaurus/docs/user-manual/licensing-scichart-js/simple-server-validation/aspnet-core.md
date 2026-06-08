---
sidebar_position: 1
title: ASP.NET Core (drop-in package)
---

# Simple Server Validation in ASP.NET Core

:::info
ASP.NET Core is the only stack with a pre-packaged SciChart integration. The [`SciChart.AspNetCore.SimpleLicensing`](https://www.nuget.org/packages/SciChart.AspNetCore.SimpleLicensing) NuGet package replaces the hand-written controller, HMAC code, and per-view ceremony with a service registration, a tag helper, and an endpoint mapper. For other stacks see the cross-language [Simple Server Validation](.) page.
:::

The package gives you three pieces:

| | |
| --- | --- |
| `AddSciChartSimpleLicensing(...)` | Registers the token service in DI and binds your Server Secret. |
| `<scichart-license />` | Razor tag helper. One line in `_Layout.cshtml`; emits a fresh `<meta name="x-scichart-license" content="v2:..." />` on every render. SciChart's WASM runtime reads it at chart-create time and validates without an XHR. |
| `app.MapSciChartLicenseEndpoint()` | Maps `GET /api/license` for re-validation when the cached cookie expires (long-running SPAs) and for licences with `validate_nonce=1`. |

The package targets `net8.0` and works with any ASP.NET Core host (`net8.0` and newer). It has no native dependency — just `System.Security.Cryptography.HMACSHA256` from the BCL.

## Install

```bash
dotnet add package SciChart.AspNetCore.SimpleLicensing
```

## Configure your Server Secret

`appsettings.json`:

```json
{
  "SciChart": {
    "ServerSecret": "YOUR_64_CHAR_HEX_SERVER_SECRET"
  }
}
```

For production, override via the standard ASP.NET Core configuration sources (user secrets, environment variables, Azure Key Vault, etc.). Find your Server Secret in [SciChart MyAccount](https://www.scichart.com/my-account/) under **Orders & Keys → Manage Licenses → Runtime License Key**, in the **Server Secret** section — see "What you need" on the [main Simple Server Validation page](.).

## Register the service and endpoint

`Program.cs`:

```csharp
using SciChart.AspNetCore.SimpleLicensing;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

// Token service. Reads SciChart:ServerSecret from configuration.
builder.Services.AddSciChartSimpleLicensing(builder.Configuration.GetSection("SciChart"));

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

// Re-validation endpoint. Covers the case where a long-running SPA outlives
// valid_time, and is the only path used with validate_nonce=1.
app.MapSciChartLicenseEndpoint();

app.Run();
```

Inline configuration also works if you don't want to round-trip through `IConfiguration`:

```csharp
builder.Services.AddSciChartSimpleLicensing(opts =>
    opts.ServerSecret = "0123456789abcdef...");
```

## Wire up the tag helper

`Views/_ViewImports.cshtml`:

```cshtml
@addTagHelper *, SciChart.AspNetCore.SimpleLicensing
```

`Views/Shared/_Layout.cshtml`:

```cshtml
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <scichart-license />
    <title>@ViewData["Title"]</title>
</head>
<body>
    @RenderBody()
</body>
</html>
```

That's the whole server-side integration. Every page rendered through the layout now carries a fresh server-signed v2 token in its `<head>`.

## Client side

No SciChart-specific JavaScript changes are needed beyond setting your runtime license key as usual:

```typescript
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY");
```

The SciChart WASM runtime finds the meta tag during `SciChartSurface.create(...)`, verifies the HMAC against the runtime licence key's embedded secret, checks clock skew, and caches the result in the `scLicense` cookie.

## How it works

**Initial validation, every full page load — no XHR:**

```
ASP.NET Core MVC renders:
  <head>
    <scichart-license />   →   <meta name="x-scichart-license"
                                     content="v2:<serverNonce>:<serverNow>:<hmac>" />
  </head>

Browser → SciChart WASM reads the meta tag, verifies the HMAC against the
runtime licence key's embedded secret, checks clock skew against max_skew,
and caches the result in `scLicense` until valid_time has elapsed.
```

**Re-validation (cached cookie expired without a page reload, or `validate_nonce=1`):**

```
Browser (SciChart.js)
  → GET /api/license[?nonce=<hex>]
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac

Served by MapSciChartLicenseEndpoint() from the same package.
```

A SPA that stays open past `valid_time` will hit the second path automatically — the meta tag from the original page render is no longer fresh enough to satisfy `max_skew`. Licences with `validate_nonce=1` use the second path exclusively and additionally echo a client-generated nonce.

## Why a tag helper instead of middleware?

The tag helper is the canonical ASP.NET Core extension point for "snippet in the layout head". It runs during view rendering, is auto-discovered via `@addTagHelper`, and avoids the response-buffering cost and HTML-rewriting fragility of middleware-based injection. New views that use `_Layout.cshtml` get server-side license validation automatically with no per-view ceremony.

## Configuration reference

`SciChartSimpleLicensingOptions`:

| Property | Type | Required | Notes |
| --- | --- | :---: | --- |
| `ServerSecret` | `string` | Yes | 64-character hex. Hex-decoded to bytes once at first resolution; the singleton service holds the bytes thereafter. To rotate the secret, restart the host. |

The service throws `InvalidOperationException` on first resolution if `ServerSecret` is missing, empty, or not valid hex — so misconfiguration fails fast at startup rather than producing broken tokens at runtime.

## Verification

- View source on a rendered page — you should see `<meta name="x-scichart-license" content="v2:..." />` in `<head>`.
- Open browser DevTools → Network. With `validate_nonce=0` you'll see no `/api/license` request on a cold load — the meta tag does the work. With `validate_nonce=1` you'll see `GET /api/license?nonce=<hex>` returning `200`.
- In Application → Cookies, `scLicense` is set with a future expiry.
- The console should log `Simple server license validated`.

## Source and example

- **Package:** [`SciChart.AspNetCore.SimpleLicensing`](https://www.nuget.org/packages/SciChart.AspNetCore.SimpleLicensing) on NuGet
- **Source:** [`AdvancedLicensing/SciChart.AspNetCore.SimpleLicensing/`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/SciChart.AspNetCore.SimpleLicensing) in the SciChart.JS.Examples repository
- **Runnable example:** [`AdvancedLicensing/dotnet-mvc-simple-server-licensing/`](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/AdvancedLicensing/dotnet-mvc-simple-server-licensing) — a complete ASP.NET Core MVC app that consumes the package via `ProjectReference`

If you'd rather hand-roll the controller (for instance, to embed the HMAC code in an existing project without taking a dependency), the **.NET (C#) — MVC Controller** snippet on the [main Simple Server Validation page](.) is functionally equivalent to what the package does internally.
