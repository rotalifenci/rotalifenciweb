const fs = require('fs');
const path = require('path');

const lines = fs.readFileSync(path.join(process.cwd(), 'js/app.js'), 'utf8').split('\n');
console.log('Lines 1-50:');
for (let i = 0; i < 50 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
