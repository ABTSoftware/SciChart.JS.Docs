const fs = require('fs');
const path = require('path');

// This script checks all internal links in markdown files and converts relative paths to absolute paths.
// Internal links are relative paths that reference other files in the project.

// To run: "npm run linkcheck-internal"

const docsDir = path.join(__dirname, '.', 'docs');
const projectRoot = path.join(__dirname, '.');

const internalLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // [text](path)
const relativePathRegex = /^(?!https?:\/\/|mailto:|tel:|#)([^#?]*)/; // No external URLs

let fileCount = 0;
let linkCount = 0;
let errorCount = 0;
let conversionCount = 0;

const MARKDOWN_EXTENSIONS = ['.md', '.mdx'];
const INDEX_FILES = ['index.md', 'index.mdx', 'README.md'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico'];

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
    if (!match || !match[1]) return false;
    
    // Skip image files
    const imagePath = match[1].toLowerCase();
    if (IMAGE_EXTENSIONS.some(ext => imagePath.includes(ext))) {
        return false;
    }
    
    return true;
}

function resolveInternalPath(currentFilePath, linkPath) {
    const cleanPath = linkPath.split('#')[0].split('?')[0];
    if (!cleanPath) return null;
    
    const currentDir = path.dirname(currentFilePath);
    
    let resolvedPath;
    if (cleanPath.startsWith('/')) {
        resolvedPath = path.join(docsDir, cleanPath);
    } else {
        resolvedPath = path.resolve(currentDir, cleanPath);
    }
    
    return resolvedPath;
}

function findExistingFile(basePath) {
    if (fs.existsSync(basePath)) {
        const stats = fs.statSync(basePath);
        if (stats.isFile()) {
            return { exists: true, resolvedPath: basePath };
        } else if (stats.isDirectory()) {
            for (const indexFile of INDEX_FILES) {
                const indexPath = path.join(basePath, indexFile);
                if (fs.existsSync(indexPath)) {
                    return { exists: true, resolvedPath: indexPath };
                }
            }
            return { exists: false, error: 'Directory exists but no index file found' };
        }
    }
    
    for (const ext of MARKDOWN_EXTENSIONS) {
        const pathWithExt = basePath + ext;
        if (fs.existsSync(pathWithExt)) {
            return { exists: true, resolvedPath: pathWithExt };
        }
    }

    for (const indexFile of INDEX_FILES) {
        const indexPath = path.join(basePath, indexFile);
        if (fs.existsSync(indexPath)) {
            return { exists: true, resolvedPath: indexPath };
        }
    }
    
    return { exists: false, error: 'File not found (tried with extensions: ' + MARKDOWN_EXTENSIONS.join(', ') + ')' };
}

function checkInternalLink(currentFilePath, linkPath) {
    const resolvedPath = resolveInternalPath(currentFilePath, linkPath);
    
    if (!resolvedPath) {
        return { exists: false, error: 'Empty path' };
    }
    
    return findExistingFile(resolvedPath);
}

function convertToAbsolutePath(currentFilePath, linkPath) {
    const hashIndex = linkPath.indexOf('#');
    
    let cleanPath = linkPath;
    let hash = '';
    let query = '';
    
    if (hashIndex !== -1) {
        hash = linkPath.substring(hashIndex);
        cleanPath = linkPath.substring(0, hashIndex);
    }
    
    const cleanPathQueryIndex = cleanPath.indexOf('?');
    if (cleanPathQueryIndex !== -1) {
        query = cleanPath.substring(cleanPathQueryIndex);
        cleanPath = cleanPath.substring(0, cleanPathQueryIndex);
    }
    
    if (!cleanPath || cleanPath.startsWith('/')) {
        return linkPath;
    }
    
    const currentDir = path.dirname(currentFilePath);
    const resolvedPath = path.resolve(currentDir, cleanPath);
    
    const relativePath = path.relative(docsDir, resolvedPath).replace(/\\/g, '/');
    const absolutePath = '/' + relativePath;
    
    return absolutePath + query + hash;
}

async function processLinksInFile(filePath) {
    fileCount++;
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let hasChanges = false;
    
    const links = [];
    let match;
    internalLinkRegex.lastIndex = 0;
    
    while ((match = internalLinkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        const fullMatch = match[0];
        
        if (isInternalLink(linkUrl)) {
            links.push({ 
                text: linkText, 
                url: linkUrl, 
                fullMatch: fullMatch,
                index: match.index 
            });
        }
    }
    
    if (links.length === 0) {
        return;
    }
    
    links.reverse();
    
    for (const link of links) {
        const result = checkInternalLink(filePath, link.url);
        linkCount++;
        
        if (result.exists) {
            const absolutePath = convertToAbsolutePath(filePath, link.url);
            
            if (absolutePath !== link.url) {
                const newLink = `[${link.text}](${absolutePath})`;
                modifiedContent = modifiedContent.substring(0, link.index) + 
                                newLink + 
                                modifiedContent.substring(link.index + link.fullMatch.length);
                
                conversionCount++;
                hasChanges = true;
                console.log(`✓ ${path.relative(projectRoot, filePath)}: Converted ${link.url} → ${absolutePath}`);
            }
        } else {
            console.log(`❌ ${path.relative(projectRoot, filePath)}: ${link.url} - ${result.error}`);
            errorCount++;
        }
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log(`  📝 Updated file: ${path.relative(projectRoot, filePath)}`);
    }
}

(async () => {
    console.log('🔍 Internal Link Checker');
    console.log('========================');
    console.log(`Docs directory: ${docsDir}`);
    console.log(`Project root: ${projectRoot}\n`);
    
    const files = [];
    walkDir(docsDir, file => files.push(file));
    
    if (files.length === 0) {
        console.log('No markdown files found in', docsDir);
        return;
    }
    
    console.log(`Found ${files.length} markdown files to process\n`);
    
    for (const file of files) {
        await processLinksInFile(file);
    }
    
    console.log('\n========================');
    console.log('📊 Summary:');
    console.log(`Files processed: ${fileCount}`);
    console.log(`Links checked: ${linkCount}`);
    console.log(`Links converted: ${conversionCount}`);
    console.log(`Errors found: ${errorCount}`);
    
    if (errorCount === 0) {
        console.log('\n✅ All internal links processed successfully!');
    } else {
        console.log(`\n⚠️ Found ${errorCount} broken links that need attention.`);
        process.exit(1); 
    }
})();