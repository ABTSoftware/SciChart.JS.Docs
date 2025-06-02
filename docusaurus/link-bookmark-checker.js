const fs = require('fs');
const path = require('path');

// This script adds a bookmark emoji :blue_book: (if missing) to links in markdown files that point to SciChart TSDoc documentation.
// To run: "npm run bookmark"

let changedLinkCount = 0;
let bookmarkedLinkCount = 0;

const docsDir = path.join(__dirname, '.', 'docs');
const RegEx = /\[([^\]]+)\]\(https:\/\/www\.scichart\.com\/documentation\/[^)]+\)/g;

function addBookmarkEmojiToLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(RegEx, (match, linkText) => {

        if (linkText.includes(':blue_book:')) {
            bookmarkedLinkCount++;
            return match; // Don't modify if already present
        }

        changedLinkCount++;
        return match.replace(`[${linkText}]`, `[${linkText}:blue_book:]`);
    });
    
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

if (changedLinkCount === 0) {
    console.log(`\x1b[33m\nNo links were modified. All links already have a bookmark emoji.\x1b[0m`);
} else {
    console.log(`\x1b[32m\nFinished processing links.\nAdded a Book to ${changedLinkCount}/${bookmarkedLinkCount} links.\x1b[0m`);
}