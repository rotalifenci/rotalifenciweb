const fs = require('fs');

const code = fs.readFileSync('js/app.js', 'utf8');
const lines = code.split('\n');

const modalStart = lines.findIndex(l => l.includes('function openInteractiveTestModal'));
console.log('openInteractiveTestModal starts at line:', modalStart + 1);

lines.slice(modalStart, modalStart + 80).forEach((l, i) => {
  console.log((modalStart + 1 + i) + ': ' + l);
});
