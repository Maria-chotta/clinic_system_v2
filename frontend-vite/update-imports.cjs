const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src');
const extensions = ['.js', '.jsx'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Update import statements with single quotes
    content = content.replace(
        /(import\s+.*\s+from\s+['"]\.\.?\/[^.'"]+)\.js(['"])/g,
        '$1.jsx$2'
    );
    
    // Update import statements with double quotes
    content = content.replace(
        /(import\s+.*\s+from\s+["']\.\.?\/[^."']+)\.js(["'])/g,
        '$1.jsx$2'
    );
    
    // Update export statements
    content = content.replace(
        /(export\s+.*\s+from\s+['"]\.\.?\/[^.'"]+)\.js(['"])/g,
        '$1.jsx$2'
    );
    
    // Update dynamic imports
    content = content.replace(
        /(import\(['"]\.\.?\/[^.'"]+)\.js['"]\)/g,
        '$1.jsx")'
    );
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        return true;
    }
    return false;
}

function walkDir(dir) {
    let updatedCount = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            updatedCount += walkDir(filePath);
        } else if (extensions.includes(path.extname(file))) {
            if (processFile(filePath)) {
                updatedCount++;
            }
        }
    });
    
    return updatedCount;
}

console.log('Updating imports from .js to .jsx...');
console.log('Root directory:', rootDir);

try {
    const count = walkDir(rootDir);
    console.log(`Completed! Updated ${count} files.`);
} catch (error) {
    console.error('Error:', error.message);
}