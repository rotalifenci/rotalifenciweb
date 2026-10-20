const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('switchExperiment')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
