const fs = require('fs');
const js = fs.readFileSync('js/yaprak-test.js', 'utf8');
const html = fs.readFileSync('yaprak-test.html', 'utf8');

const matches = js.match(/document\.getElementById\(['"][^'"]+['"]\)/g) || [];
const ids = new Set(matches.map(m => m.match(/['"]([^'"]+)['"]/)[1]));

const missing = [];
ids.forEach(id => {
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missing.push(id);
  }
});
console.log('Total IDs found in JS:', ids.size);
console.log('Missing IDs in yaprak-test.html:', missing);
