const fs = require('fs');

const files = [
  'yaprak-test.html',
  '../yaprak-test.html',
  '../Yaprak Test/public/index.html'
];

const v = Date.now();

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace(/js\/yaprak-test\.js\?v=[^"']+/g, `js/yaprak-test.js?v=${v}`);
  html = html.replace(/js\/curriculum-data\.js\?v=[^"']+/g, `js/curriculum-data.js?v=${v}`);
  fs.writeFileSync(f, html, 'utf8');
  console.log(`Updated cache-buster in ${f} to ${v}`);
});
