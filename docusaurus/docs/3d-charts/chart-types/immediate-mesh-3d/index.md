---
sidebar_position: 6
---

# Immediate Mesh 3D

`ImmediateLitMeshContext` draws custom lit geometry directly in a `SciChart3DSurface` scene. It is useful when a built-in 3D series cannot describe the shape: for example, a swept path, a non-uniform tube, or application-specific geometry.

Unlike a renderable series, an immediate mesh is a custom `BaseSceneEntity3D` added to `rootEntity.children`. The example below builds an aurora-like, banked helix as one triangle strip. Each emitted vertex has a position, normal, texture coordinate, and colour, so the default scene light reveals the ribbon's shape while the colour changes along its length.

## Creating an immediate mesh

<CodeSnippetBlock labels={["AuroraRibbonSceneEntity.ts", "drawExample.ts"]}>
```ts {9,22} showLineNumbers file=./AuroraRibbonSceneEntity.ts
```
```ts {12,33} showLineNumbers file=./demo.ts
```
</CodeSnippetBlock>

The render mode controls how SciChart joins emitted vertices. This example uses `TSR_RENDERMODE_TRIANGLESTRIP`: every pair of left and right vertices adds one ribbon segment. Other native render modes can be used for triangles, lines, and points where appropriate.

<LiveDocSnippet maxWidth={"100%"} name="./demo" extraJSPaths={["./AuroraRibbonSceneEntity.js"]} />

## Coordinate space: follow axes or stay in world space

`ImmediateLitMeshContext.setVertex3()` always accepts world-space coordinates. This example keeps the ribbon in **data space** and maps each vertex through the current render-pass axis calculators, so axis ranges and `worldDimensions` affect the mesh.

<CodeSnippetBlock labels={["TS"]}>
```ts {2} showLineNumbers file=./AuroraRibbonSceneEntity.ts start=region_coordinate_transform_start end=region_coordinate_transform_end
```
</CodeSnippetBlock>

If you want a mesh to follow axis zooming, panning, or range changes, keep its source vertices in data space and use this conversion in `Render()`. Recalculate normals after conversion, because axis scaling can alter their direction. If you instead want a fixed scene object such as a gizmo, annotation, or world-space overlay, pass its world coordinates directly to `setVertex3()` and omit the conversion.

## Features and tips

- `normal3()` supplies the lighting normal for subsequently emitted vertices. Normalize normals to avoid uneven lighting.
- `setVertexColor()` accepts a CSS colour or an ARGB `number`; use it to colour vertices individually.
- `texCoord2()` and `setSelectionId()` attach texture and selection data before `setVertex3()` emits a vertex.
- Create and dispose the context within `Render()`. `dispose()` submits the completed mesh and releases the native resources.
- Build static geometry once, as the example does. For changing geometry, update only the values that change before the next render.
