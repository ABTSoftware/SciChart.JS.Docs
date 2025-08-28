---
title: "SciChartは日本語をサポートしていますか？"
sidebar_position: 2  # Lower numbers appear first
---

# SciChartは日本語をサポートしていますか？

はい、SciChartは日本語を完全にサポートしています。SciChartライブラリはUnicodeエンコーディングを使用しているため、日本語の文字（ひらがな、カタカナ、漢字）を含むすべてのUnicode文字セットを表示できます。


## Unicode文字サポート

SciChartは以下の理由で日本語文字を適切に処理できます：

- 完全なUnicodeサポート: UTF-8およびUTF-16エンコーディングに対応

- 国際化対応: 多言語テキストレンダリングエンジン内蔵

- フォント互換性: システムフォントおよびWebフォントとの完全な互換性

## 2Dチャートでの日本語実装

基本的な日本語テキストの設定

```ts {2} showLineNumbers file=./two-d/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet maxWidth={"100%"} name="./two-d/demo" />    


## 3Dチャートでの日本語実装

Scichart 3dで日本語文字を使用するには、この記事を参照してください。 - [Native Text Api:blue_book:](https://www.scichart.com/documentation/js/v4/2d-charts/miscellaneous-apis/native-text-api/)



## 重要な注意事項

- エンコーディング: HTMLファイルとJavaScriptファイルはUTF-8エンコーディングで保存してください

- ブラウザ互換性: すべての主要ブラウザで日本語表示がサポートされています

SciChartのUnicodeサポートにより、日本語を含む多言語チャートアプリケーションの開発が可能です。
