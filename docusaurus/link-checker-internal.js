const fs = require('fs');
const path = require('path');

// This script checks all internal links in markdown files
// Internal links are relative paths that reference other files in the project.

const docsDir = path.join(__dirname, '.', 'docs');
const projectRoot = path.join(__dirname, '.');

const internalLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // [text](path)
const relativePathRegex = /^(?!https?:\/\/|mailto:|tel:|#)([^#?]*)/; // No external URLs

let fileCount = 0;
let linkCount = 0;
let errorCount = 0;

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory does not exist: ${dir}`);
        return;
    }
    
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, callback);
        } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
            callback(fullPath);
        }
    });
}

function isInternalLink(url) {
    const match = url.match(relativePathRegex);
    return match && match[1];
}

function resolveInternalPath(currentFilePath, linkPath) {
    const cleanPath = linkPath.split('#')[0].split('?')[0];
    if (!cleanPath) return null;
    
    const currentDir = path.dirname(currentFilePath);
    s
    let resolvedPath;
    if (cleanPath.startsWith('/')) {
        // Absolute
        resolvedPath = path.join(projectRoot, cleanPath);
    } else {
        // Relative
        resolvedPath = path.resolve(currentDir, cleanPath);
    }
    
    return resolvedPath;
}

function checkInternalLink(currentFilePath, linkPath) {
    const resolvedPath = resolveInternalPath(currentFilePath, linkPath);
    
    if (!resolvedPath) {
        return { exists: false, error: 'Empty path' };
    }
    
    // Check if file exists
    if (fs.existsSync(resolvedPath)) {
        const stats = fs.statSync(resolvedPath);
        if (stats.isFile()) {
            return { exists: true, resolvedPath };
        } else if (stats.isDirectory()) {
            const indexFiles = ['index.md', 'README.md', "readme.md"];
            for (const indexFile of indexFiles) {
                const indexPath = path.join(resolvedPath, indexFile);
                if (fs.existsSync(indexPath)) {
                    return { exists: true, resolvedPath: indexPath };
                }
            }
            return { exists: false, error: 'Directory exists but no index file found' };
        }
    }
    
    return { exists: false, error: 'File not found' };
}

async function checkLinksInFile(filePath) {
    fileCount++;
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];
    let match;
    
    // Reset regex
    internalLinkRegex.lastIndex = 0;
    
    // console.log(`\nChecking file: ${path.relative(projectRoot, filePath)}`);
    
    while ((match = internalLinkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        
        // Only process internal links
        if (isInternalLink(linkUrl)) {
            links.push({ text: linkText, url: linkUrl });
        }
    }
    
    if (links.length === 0) {
        // console.log('  No internal links found');
        return;
    }
    
    for (const link of links) {
        const result = checkInternalLink(filePath, link.url);
        linkCount++;
        
        if (result.exists) {
            const relativePath = path.relative(projectRoot, result.resolvedPath);
            const absolutePath = path.resolve(result.resolvedPath);
            console.log(`  ✅ ${link.url}`);
            console.log(`     → Relative: ${relativePath}`);
            console.log(`     → Absolute: ${absolutePath}`);
        } else {
            console.log(`  ❌ ${link.url} - ${result.error}`);
            console.log(`     Link text: "${link.text}"`);
            const attemptedPath = resolveInternalPath(filePath, link.url);
            if (attemptedPath) {
                console.log(`     → Attempted absolute: ${path.resolve(attemptedPath)}`);
            }
            errorCount++;
        }
    }
}

// Main execution
(async () => {
    console.log('Starting internal link checking in "/docs" directory...');
    console.log(`Project root: ${projectRoot}`);
    console.log(`Docs directory: ${docsDir}`);
    
    const files = [];
    walkDir(docsDir, file => files.push(file));
    
    if (files.length === 0) {
        console.log('No markdown files found in docs directory');
        return;
    }
    
    console.log(`Found ${files.length} markdown files to check\n`);
    
    for (const file of files) {
        await checkLinksInFile(file);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('Internal link check complete.');
    console.log(`Total files checked: ${fileCount}`);
    console.log(`Total internal links checked: ${linkCount}`);
    
    if (errorCount > 0) {
        console.error(`\x1b[31mTotal errors found: ${errorCount}\x1b[0m`);
        process.exit(1); // Exit with error code for CI/CD
    } else {
        console.log('\x1b[32mAll internal links are valid!\x1b[0m');
    }
})();