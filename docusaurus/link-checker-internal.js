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

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico'];

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
    
    // Resolve relative to current file's directory
    const currentDir = path.dirname(currentFilePath);
    
    // Handle different path formats
    let resolvedPath;
    if (cleanPath.startsWith('/')) {
        // Already absolute path from project root
        resolvedPath = path.join(projectRoot, cleanPath);
    } else {
        // Relative path from current file
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
            // Check for index files in directory
            const indexFiles = ['index.md', 'index.mdx', 'README.md'];
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

function convertToAbsolutePath(currentFilePath, linkPath) {
    // Extract hash and query parameters
    const hashIndex = linkPath.indexOf('#');
    const queryIndex = linkPath.indexOf('?');
    
    let cleanPath = linkPath;
    let hash = '';
    let query = '';
    
    // Handle hash
    if (hashIndex !== -1) {
        hash = linkPath.substring(hashIndex);
        cleanPath = linkPath.substring(0, hashIndex);
    }
    
    // Handle query (could be before or after hash)
    const cleanPathQueryIndex = cleanPath.indexOf('?');
    if (cleanPathQueryIndex !== -1) {
        query = cleanPath.substring(cleanPathQueryIndex, cleanPath.length);
        cleanPath = cleanPath.substring(0, cleanPathQueryIndex);
    }
    
    if (!cleanPath || cleanPath.startsWith('/')) {
        return linkPath; // Already absolute or empty path
    }
    
    // Convert relative path to project-root relative absolute path
    const currentDir = path.dirname(currentFilePath);
    const resolvedPath = path.resolve(currentDir, cleanPath);
    const relativePath = path.relative(projectRoot, resolvedPath).replace(/\\/g, '/');
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
        
        // Only process internal links
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
    
    // Process links in reverse order to maintain correct indices
    links.reverse();
    
    for (const link of links) {
        const result = checkInternalLink(filePath, link.url);
        linkCount++;
        
        if (result.exists) {
            const absolutePath = convertToAbsolutePath(filePath, link.url);
            
            if (absolutePath !== link.url) {
                // Replace the link in content
                const newLink = `[${link.text}](${absolutePath})`;
                modifiedContent = modifiedContent.substring(0, link.index) + 
                                newLink + 
                                modifiedContent.substring(link.index + link.fullMatch.length);
                
                conversionCount++;
                hasChanges = true;
            }
        } else {
            console.log(`❌ ${path.relative(projectRoot, filePath)}: ${link.url} - ${result.error}`);
            errorCount++;
        }
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
    }
}

// IIFE 
(async () => {
    const files = [];
    walkDir(docsDir, file => files.push(file));
    
    if (files.length === 0) {
        console.log('No markdown files found');
        return;
    }
    
    for (const file of files) {
        await processLinksInFile(file);
    }

    console.log(`\nFiles: ${fileCount},\nLinks: ${linkCount},\nConversions: ${conversionCount},\nErrors: ${errorCount}`);

    if (errorCount === 0) {
        console.log('\n✅ All internal links processed successfully.');
    }
})();