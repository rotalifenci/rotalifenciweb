const fs = require('fs');
const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const ids = ['hud-val-right', 'hud-val-left', 'hud-val-net', 'force-math-compact', 'hud-balance-badge', 'hud-balance-text', 'hud-motion-text'];
ids.forEach(id => {
  console.log(id + ' in html: ' + html.includes('id="' + id + '"'));
});
