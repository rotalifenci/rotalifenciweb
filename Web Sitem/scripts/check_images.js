const fs = require('fs');

const html = fs.readFileSync('sunumlar/5-sinif-1-unite-gunes-dunya-ay.html', 'utf8');
const imgRegex = /src=["']([^"']+\.(?:png|jpg|jpeg|svg|webp))["']/gi;
let m;
const missing = [];
let total = 0;

while ((m = imgRegex.exec(html)) !== null) {
  total++;
  const src = m[1];
  if (!src.startsWith('http') && !src.startsWith('data:')) {
    const fromSunumlar = 'sunumlar/' + src;
    const fromRoot = src.startsWith('../') ? src.slice(3) : src;
    const exists = fs.existsSync(fromSunumlar) || fs.existsSync(fromRoot) || fs.existsSync(src);
    if (!exists) {
      missing.push(src);
    }
  }
}

console.log('Total images:', total);
console.log('Missing images:', missing.length);
if (missing.length > 0) {
  console.log('Missing samples:', missing.slice(0, 5));
}
