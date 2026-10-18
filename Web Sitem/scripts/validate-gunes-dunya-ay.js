const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
const content = fs.readFileSync(targetPath, 'utf8');

// Find all document.getElementById calls in the script
const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const idsInJs = new Set();
let match;
while ((match = idRegex.exec(content)) !== null) {
    idsInJs.add(match[1]);
}

console.log('Total unique IDs queried in JS:', idsInJs.size);

const missingIds = [];
for (const id of idsInJs) {
    const idHtmlPattern = new RegExp(`id=["']${id}["']`);
    if (!idHtmlPattern.test(content)) {
        missingIds.push(id);
    }
}

if (missingIds.length > 0) {
    console.log('Missing IDs found in HTML:', missingIds);
} else {
    console.log('All queried IDs exist in the HTML!');
}
