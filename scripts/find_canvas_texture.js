const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('createTextCanvasTexture')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
