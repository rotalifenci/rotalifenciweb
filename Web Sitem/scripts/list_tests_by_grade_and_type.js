const fs = require('fs');
const path = require('path');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
const tests = mat.filter(m => m.category === 'denemeler');

console.log('--- DENEMELER IN MATERIALS.JSON ---');
tests.forEach(t => {
  console.log(`Grade: ${t.grade} | TargetSec: ${t.targetSection} | Title: ${t.title} | Format: ${t.format} | File: ${t.fileName}`);
});

console.log('\n--- FILES IN testler/ DIRECTORY ---');
const files = fs.readdirSync('testler').filter(f => f.endsWith('.html'));
files.forEach(f => {
  console.log(f);
});
