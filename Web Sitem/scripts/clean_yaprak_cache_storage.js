const fs = require('fs');

const files = [
  'js/yaprak-test.js',
  '../js/yaprak-test.js',
  '../Yaprak Test/public/js/yaprak-test.js'
];

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  // Remove rotali_test_html_ setItem lines so it never caches raw HTML in localStorage
  code = code.replace(/if\s*\(data\.htmlContent\)\s*\{[\s\S]*?localStorage\.setItem\('rotali_test_html_'[\s\S]*?\}/m,
    `// Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir, localStorage önbelleklenmez.`);
  fs.writeFileSync(p, code, 'utf8');
  console.log('Cleaned localStorage caching in:', p);
});
