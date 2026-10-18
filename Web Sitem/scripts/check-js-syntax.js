const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
const content = fs.readFileSync(targetPath, 'utf8');

const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('No script tag found!');
    process.exit(1);
}

try {
    new vm.Script(scriptMatch[1]);
    console.log('JavaScript syntax is 100% valid!');
} catch (err) {
    console.error('JS Syntax Error:', err.message);
    process.exit(1);
}
