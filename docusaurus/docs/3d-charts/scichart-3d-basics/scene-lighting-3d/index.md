---
sidebar_position: 5
---

# 3D Scene Lighting

SciChart3DSurface combines an ambient fill light with one main directional light. Ambient light keeps shadowed faces visible; the directional light reveals the shape of surface meshes, columns, and other lit 3D geometry.

## Interactive lighting controls

The scene below contains both a surface mesh and columns. Adjust ambient intensity, choose how the main light is positioned, and—when using global space—adjust its X, Y and Z direction.

<LiveDocSnippet maxWidth={"100%"} name="./demo" htmlPath="./demo.html" cssPath="./demo.css" />

## Configure lighting when creating the surface

Set `ambientLight` from `0` (no fill) to `1` (the default ambient level). Use `GlobalSpace` when a fixed direction is wanted, or `CameraForward` when the light should follow the camera.

<CodeSnippetBlock labels={["TS"]}>
```ts {5,7-8} showLineNumbers file=./demo.ts start=region_lighting_setup_start end=region_lighting_setup_end
```
</CodeSnippetBlock>

## Update the light at runtime

The `lightingController` redraws the scene when its settings change. `setLightDirection()` is relevant only in `GlobalSpace`; direction is normalized here so the sliders change direction rather than brightness.

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./demo.ts start=region_lighting_controls_start end=region_lighting_controls_end
```
</CodeSnippetBlock>

## Choosing a light mode

- `GlobalSpace`: the direction is fixed in the 3D world. Use this for a consistent studio-style light.
- `CameraForward`: the light follows the camera, which is useful when orbiting a scene for inspection.
- `None`: disables the directional light; ambient light still applies.

:::tip
Start with low ambient light (around `0.1`–`0.25`) and a diagonal global direction. High ambient intensity flattens contrast and makes surface shape harder to read.
:::
