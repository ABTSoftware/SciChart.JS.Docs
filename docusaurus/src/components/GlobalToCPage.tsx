import React from 'react';
import {useAllDocsData, useDocById } from '@docusaurus/plugin-content-docs/client';

export default function GlobalToCPage() {
  const allDocsData = useAllDocsData();
  console.log('allDocsData', allDocsData)
//   const docId = useDocById();

  // Flatten and extract doc links
  const allLinks = allDocsData['default'].versions[0].docs;
  // Object.values(allDocsData).flatMap(plugin => Object.values(plugin.docs).map(doc => ({ id: doc.id, title: doc.title, permalink: doc.permalink })));

  return (
      <div className="container">
        <h1>Global Table of Contents</h1>
        <ul>
          {allLinks.map(doc => (
            <li key={doc.id}>
              <a href={doc.path}>{doc.id}</a>
            </li>
          ))}
        </ul>
      </div>
  );
}