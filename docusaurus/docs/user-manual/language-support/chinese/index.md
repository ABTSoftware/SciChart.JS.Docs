---
title: "SciChart 是否支持中文"
sidebar_position: 1 # Lower numbers appear first
---

# SciChart 是否支持中文

SciChart JS 完全支持中文字符显示，因为它基于 Unicode 字符编码系统构建。作为一个现代的 JavaScript 图表库，SciChart 能够正确渲染和显示各种语言的字符，包括中文简体、繁体以及其他 Unicode 字符集。

## Unicode 支持原理

SciChart JS 利用浏览器的原生 Unicode 支持来处理多语言文本渲染。由于现代浏览器都遵循 Unicode 标准，SciChart 可以无缝地显示中文字符，无需额外的配置或插件。


## 2D 图表中的中文字符实现

以下代码示例展示了如何在 SciChart 2D 图表中使用中文标签和文本：

```ts {2} showLineNumbers file=./two-d/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet maxWidth={"100%"} name="./two-d/demo" />

## 文本注释和标签

SciChart 还支持在图表上添加中文文本注释：

```ts {3} showLineNumbers file=./two-d/demo.ts start=region_B_start end=region_B_end
```

## 3D 图表中的中文字符实现

要在 Scichart 3d 中使用中文字符，请参阅本文 - [Native Text Api](https://www.scichart.com/documentation/js/v4/2d-charts/miscellaneous-apis/native-text-api/)


## 最佳实践建议

- 字体选择：使用系统默认的中文字体，如 Microsoft YaHei（微软雅黑）或 SimHei（黑体）

- 编码设置：确保 HTML 页面使用 UTF-8 编码

- 字体大小：根据图表大小调整合适的字体大小，确保中文字符清晰可读

- 浏览器兼容性：测试不同浏览器中的中文显示效果

通过以上配置和代码示例，您可以在 SciChart JS 应用程序中完美地显示和使用中文字符，创建本地化的图表界面。
