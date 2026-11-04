const fs = require('fs');
const h = fs.readFileSync('testler/7-sinif-1-unite-test-no-1-acik-uclu-klasik.html', 'utf8');
const parts = h.split(/<section[^>]+class=["'][^"']*rf-question-slide/);
const s11 = parts[11];
console.log(s11.match(/<div class="rf-visual-box">([\s\S]*?)<\/div>/)[1]);
