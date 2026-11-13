import React from "react";
import Head from "@docusaurus/Head";
import { Redirect } from "@docusaurus/router";

// Archived version: point search engines at the current docs (see src/theme/Layout).
export default function Home() {
    return (
        <>
            <Head>
                <link rel="canonical" href="https://www.scichart.com/documentation/js/current/intro/" />
            </Head>
            <Redirect to="intro" />
        </>
    );
}
