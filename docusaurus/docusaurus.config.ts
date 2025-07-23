import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import CustomCopyPlugin from "./custom-plugins/webpackCustomConfigPlugin";
import remarkCodeSnippets from "remark-code-snippets";
import { baseUrl } from "./config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const gitHubUrl = "https://github.com/ABTSoftware/SciChart.JS.Docs/tree/master/docusaurus";

const config: Config = {
    title: "SciChart JS Docs",
    tagline: "The Ultimate JavaScript Chart Library",
    favicon: "img/cropped-favicon-32x32.png",
    markdown: {
        mermaid: true
    },
    themes: ["@docusaurus/theme-mermaid"],

    // Set the production url of your site here
    url: "https://scichart.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: baseUrl,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "scichart", // Usually your GitHub org/user name.
    projectName: "scichart.js", // Usually your repo name.

    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    scripts: [
        {
            src: "https://chat.scichart.com/chatbot.js",
            defer: true
        }
    ],

    presets: [
        [
            "classic",
            {
                docs: {
                    routeBasePath: "/",
                    sidebarPath: "./sidebars.ts",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: gitHubUrl,
                    remarkPlugins: [remarkCodeSnippets]
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css"
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "images/SciChartLogo.png",
        navbar: {
            title: "SciChart.js Docs v4",
            logo: {
                alt: "SciChart LOGO",
                src: "img/logo.svg"
            },
            items: [
                {
                    to: "/intro",
                    label: "Home",
                    position: "left"
                },
                {
                    to: "/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js",
                    label: "Tutorials",
                    position: "left"
                },
                { to: "/2d-charts/surface/scichart-surface-type-overview", label: "2D Docs", position: "left" },
                {
                    to: "/3d-charts/scichart-3d-basics/scichart-3d-basics-overview",
                    label: "3D Docs",
                    position: "left"
                },
                {
                    href: "https://www.scichart.com/documentation/js/v4/typedoc/index.html",
                    label: "API Docs",
                    position: "left"
                },
                {
                    href: "https://www.scichart.com/documentation/js/current/webframe.html",
                    label: "Docs v3",
                    position: "right"
                },
                {
                    href: gitHubUrl,
                    label: "GitHub",
                    position: "right"
                }
            ]
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Home",
                            to: "/intro"
                        },
                        {
                            label: "API Documentation",
                            href: "https://www.scichart.com/documentation/js/v4/typedoc/index.html"
                        }
                    ]
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "SciChart Forum",
                            href: "https://www.scichart.com/questions"
                        },
                        {
                            label: "Stack Overflow",
                            href: "https://stackoverflow.com/questions/tagged/scichart"
                        }
                    ]
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "SciChart website",
                            href: "https://www.scichart.com"
                        },
                        {
                            label: "SciChart GitHub",
                            href: "https://github.com/ABTSoftware"
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} SciChart. Built with Docusaurus.`
        },
        prism: {
            theme: prismThemes.vsLight,
            darkTheme: prismThemes.vsDark
        }
    } satisfies Preset.ThemeConfig,

    plugins: [
        function customWebpackPlugin() {
            return {
                name: "custom-wasm-loader",
                configureWebpack(config, isServer, utils) {
                    return {
                        module: {
                            rules: [
                                // prevents an error when using scichart import
                                {
                                    test: /\.wasm$/,
                                    type: "asset/resource" // simply copies the file without processing
                                }
                            ],
                            noParse: /\.wasm$/ // optional: avoid parsing entirely
                        }
                    };
                }
            };
        },
        CustomCopyPlugin,
        [
            require.resolve("@cmfcmf/docusaurus-search-local"),
            {
                indexDocs: true,
                indexDocSidebarParentCategories: 0,
                includeParentCategoriesInPageTitle: false,
                indexBlog: false,
                indexPages: false,
                language: "en",
                maxSearchResults: 10,

                // lunr.js-specific settings
                lunr: {
                    // When indexing your documents, their content is split into "tokens".
                    // Text entered into the search box is also tokenized.
                    // This setting configures the separator used to determine where to split the text into tokens.
                    // By default, it splits the text at whitespace and dashes.
                    //
                    // Note: Does not work for "ja" and "th" languages, since these use a different tokenizer.
                    tokenizerSeparator: /[\s\-]+/,
                    // https://lunrjs.com/guides/customising.html#similarity-tuning
                    //
                    // This parameter controls the importance given to the length of a document and its fields. This
                    // value must be between 0 and 1, and by default it has a value of 0.75. Reducing this value
                    // reduces the effect of different length documents on a term’s importance to that document.
                    b: 0.75,
                    // This controls how quickly the boost given by a common word reaches saturation. Increasing it
                    // will slow down the rate of saturation and lower values result in quicker saturation. The
                    // default value is 1.2. If the collection of documents being indexed have high occurrences
                    // of words that are not covered by a stop word filter, these words can quickly dominate any
                    // similarity calculation. In these cases, this value can be reduced to get more balanced results.
                    k1: 1.2,
                    // By default, we rank pages where the search term appears in the title higher than pages where
                    // the search term appears in just the text. This is done by "boosting" title matches with a
                    // higher value than content matches. The concrete boosting behavior can be controlled by changing
                    // the following settings.
                    titleBoost: 5,
                    contentBoost: 0,
                    tagsBoost: 3,
                    parentCategoriesBoost: 2 // Only used when indexDocSidebarParentCategories > 0
                }
            }
        ]
    ]
};

export default config;
