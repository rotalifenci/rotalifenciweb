const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');
const lines = content.split('\n');
console.log('Total lines in js/app.js:', lines.length);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('ROTALI FENCİ HUB') || line.includes('rotali-hub') || line.includes('STEM Keşfet') || line.includes('renderHome') || line.includes("hash === '#home'") || line.includes("hash === ''")) {
    console.log(`Line ${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}
