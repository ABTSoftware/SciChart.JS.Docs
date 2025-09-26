import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function LayoutWrapper(props) {
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
        <>
            <Layout {...props} />
        </>
    );
}