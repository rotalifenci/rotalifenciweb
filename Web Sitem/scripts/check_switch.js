const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
let start = false;
lines.forEach((l, i) => {
  if (l.includes('function switchExperiment')) start = true;
  if (start && i < 1150) {
    console.log((i+1) + ': ' + l);
  }
});
