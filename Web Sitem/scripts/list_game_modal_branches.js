const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const startIdx = app.indexOf('function openInteractiveGameModal(');
const endIdx = app.indexOf('function closeInteractiveGameModal()');
const block = app.substring(startIdx, endIdx);

const lines = block.split('\n');
lines.forEach((l, idx) => {
  if (l.trim().startsWith('if ') || l.trim().startsWith('} else if ') || l.trim().startsWith('//')) {
    console.log(idx + 1, l.trim());
  }
});
