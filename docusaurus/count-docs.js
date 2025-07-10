#!/usr/bin/env node
const fs = require('fs');
const path = require('path');


function analyzeDocs(dir) {
  const docPatterns = [
    'index.md',
    'index.mdx',
    'readme.md',
    'readme.mdx'
  ];
  
  let results = {
    counts: {
      'index.md': 0,
      'index.mdx': 0,
      'readme.md': 0,
      'readme.mdx': 0,
      total: 0
    },
    filesToUpdate: [],
    filesComplete: []
  };


  function walkDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);


      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else {
        const lowerName = item.toLowerCase();
        if (docPatterns.includes(lowerName)) {
          results.counts[lowerName]++;
          results.counts.total++;
          
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('⚠️')) {
            results.filesToUpdate.push(fullPath);
          } else {
            results.filesComplete.push(fullPath);
          }
        }
      }
    });
  }


  walkDirectory(dir);
  return results;
}


// Main execution
if (require.main === module) {
  try {
    const docsPath = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsPath)) {
      throw new Error('"docs" directory not found');
    }


    const { counts, filesToUpdate, filesComplete } = analyzeDocs(docsPath);
    
    console.log('Documentation File Count:');
    console.table({
      'index.md': counts['index.md'],
      'index.mdx': counts['index.mdx'],
      'readme.md': counts['readme.md'],
      'readme.mdx': counts['readme.mdx']
    });
    console.log(`\n`);
    console.log(`These documents require update:`);
    filesToUpdate.forEach(file => console.log(`- ${path.relative(docsPath, file)}`));
    console.log(`\n`);
    console.log(`Total ${counts.total}`);
    console.log(`Docs complete ${filesComplete.length}`);
    console.log(`Docs to update ${filesToUpdate.length}`);
    const percentage = counts.total > 0 ? (100 * filesComplete.length / counts.total).toFixed(2) : "0.00";
    console.log(`Completion ${percentage}%`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = analyzeDocs;