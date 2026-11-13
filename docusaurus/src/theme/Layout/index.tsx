import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

// This site is an older, archived version of the docs. Every page here has a page at the same path
// under /documentation/js/current/, so each page:
// - stays readable for customers still on this version;
// - points search engines at the current page (canonical). No noindex yet: combining noindex with a
//   canonical is a mixed signal. Add <meta name="robots" content="noindex, follow" /> below once Google
//   has moved rankings to /current/;
// - shows a banner linking to the same page in the current docs.
const CURRENT_DOCS_URL = 'https://www.scichart.com/documentation/js/current/';

function useCurrentDocsUrl(): { currentUrl: string; versionLabel: string } {
    const { siteConfig } = useDocusaurusContext();
    const { pathname } = useLocation();
    const baseUrl = siteConfig.baseUrl; // e.g. /documentation/js/v5/
    const relativePath = pathname.startsWith(baseUrl) ? pathname.slice(baseUrl.length) : pathname.replace(/^\//, '');
    const versionLabel = baseUrl.split('/').filter(Boolean).pop() ?? 'an older version';
    return { currentUrl: CURRENT_DOCS_URL + relativePath, versionLabel };
}

function OldVersionBanner({ currentUrl, versionLabel }: { currentUrl: string; versionLabel: string }) {
    return (
        <div
            role="note"
            style={{
                padding: '0.6rem 1rem',
                textAlign: 'center',
                fontSize: '0.95rem',
                background: 'var(--ifm-color-warning-contrast-background)',
                color: 'var(--ifm-color-warning-contrast-foreground)',
                borderBottom: '1px solid var(--ifm-color-warning-dark)'
            }}
        >
            You are viewing the SciChart.js {versionLabel} docs, which are no longer the latest.{' '}
            <a href={currentUrl} style={{ fontWeight: 600 }}>
                See this page in the current docs
            </a>
            .
        </div>
    );
}

export default function LayoutWrapper(props) {
    const { currentUrl, versionLabel } = useCurrentDocsUrl();

    useEffect(() => {
        if (!ExecutionEnvironment.canUseDOM) return;

        const gtmScript = document.createElement('script');
        gtmScript.innerHTML = `
            (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M8FXVD7');
        `;
        document.head.appendChild(gtmScript);

        const noscript = document.createElement('noscript');
        noscript.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M8FXVD7" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
        document.body.insertBefore(noscript, document.body.firstChild);
    }, []);

    return (
        <Layout {...props}>
            {/* Rendered inside Layout, after the theme's own head tags, so this canonical replaces the default self-canonical. */}
            <Head>
                <link rel="canonical" href={currentUrl} />
            </Head>
            <OldVersionBanner currentUrl={currentUrl} versionLabel={versionLabel} />
            {props.children}
        </Layout>
    );
}
