const fs = require('fs');
const js = fs.readFileSync('js/app.js', 'utf8');
const lines = js.split('\n');

lines.forEach((l, i) => {
  if (l.includes("soru-bankasi") || l.includes("denemeler")) {
    if (l.includes("filter") || l.includes("function") || l.includes("category") || l.includes("normSubTab") || l.includes("subTab ===")) {
      console.log((i+1) + ': ' + l.trim().slice(0, 140));
    }
  }
});
