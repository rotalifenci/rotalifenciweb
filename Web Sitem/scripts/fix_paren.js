const fs = require('fs');
let app = fs.readFileSync('js/app.js', 'utf8');

const targetBad = '|| resolvedKey === "oyun-gunes-sistemi-3d"))) {';
const targetGood = '|| resolvedKey === "oyun-gunes-sistemi-3d")) {';

if (app.includes(targetBad)) {
  app = app.replace(targetBad, targetGood);
  fs.writeFileSync('js/app.js', app, 'utf8');
  console.log('✔ Fixed syntax error in js/app.js');
} else {
  console.log('Target bad string not found');
}
