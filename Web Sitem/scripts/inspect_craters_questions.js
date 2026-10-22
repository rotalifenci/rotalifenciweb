const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

console.log('--- CRATER SEARCH ---');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('krater') || l.toLowerCase().includes('crater')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

console.log('--- QUESTION / QUIZ SEARCH ---');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('question') || l.toLowerCase().includes('soru') || l.toLowerCase().includes('quiz')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
