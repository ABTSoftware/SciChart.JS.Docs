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
    filesWithCheckmark: [],
    checkmarkCount: 0
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
          
          // Check for ✅ symbol
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('✅')) {
            results.filesWithCheckmark.push(fullPath);
            results.checkmarkCount += (content.match(/✅/g) || []).length;
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

    const { counts, filesWithCheckmark, checkmarkCount } = analyzeDocs(docsPath);
    
    console.log('Documentation File Count:');
    console.table({
      'index.md': counts['index.md'],
      'index.mdx': counts['index.mdx'],
      'readme.md': counts['readme.md'],
      'readme.mdx': counts['readme.mdx']
    });
    console.log(`\n`);
    console.log(`Files containing ✅ (${filesWithCheckmark.length}):`);
    filesWithCheckmark.forEach(file => console.log(`- ${path.relative(docsPath, file)}`));
    console.log(`\n`);
    console.log(`Total ${counts.total}`);
    console.log(`Complete ${filesWithCheckmark.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = analyzeDocs;