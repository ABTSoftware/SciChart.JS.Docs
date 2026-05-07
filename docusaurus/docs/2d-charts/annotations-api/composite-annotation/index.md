---
sidebar_position: 25
---

# CompositeAnnotation

`CompositeAnnotation` groups existing annotations and keeps the child annotations positioned relative to a parent box. The parent box can be transparent, so the visible result can be a clean line, label, marker or any other child annotation combination.

It is intentionally much simpler than `MultiPointAnnotationBase`. A composite annotation does not provide multi-point geometry, label anchors, segment labels, snapping or generated drag grips. It is a container for other annotations.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {21,31} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use `CompositeAnnotation` when several annotations should move and resize as one grouped object. Use a multi-point annotation when the annotation itself is defined by multiple points and needs labels, snapping or custom point grips.

```ts
composite.add(new TextAnnotation({ x1: 0.5, y1: 0.5, text: "New child" }));
composite.remove(composite.annotations[0]);
composite.clear();
```
