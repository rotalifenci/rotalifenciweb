const fs = require('fs');

const html = fs.readFileSync('testler/7-sinif-1-unite-test-no-9-kisa-cevapli-bosluk-doldurma.html', 'utf8');
const regex = /<div class="zk-question-stem[^"]*">([\s\S]*?)<\/div>/g;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null && count < 5) {
  count++;
  console.log(`Q${count}:`, m[1].replace(/<[^>]+>/g, '').trim().slice(0, 120));
}
console.log('Total question stems found:', count);
