const fs = require('fs');
const path = require('path');

// This script adds a bookmark emoji 📘 (if missing) to links in markdown files that point to SciChart TSDoc documentation.

const docsDir = path.join(__dirname, '.', 'docs');
const RegEx = /\]\(https:\/\/www\.scichart\.com\/documentation\/[^)]+\)(?!\s*📘)/g;

function addBookmarkEmojiToLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(RegEx, match => match + '📘');
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
            addBookmarkEmojiToLinks(fullPath);
        }
    });
}

console.log(`Starting to add bookmark emojis in links in ${docsDir}`);
walkDir(docsDir);
