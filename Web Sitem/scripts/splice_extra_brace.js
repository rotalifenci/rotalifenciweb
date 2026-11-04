const fs = require('fs');

const files = [
  'js/yaprak-test.js',
  '../js/yaprak-test.js',
  '../Yaprak Test/public/js/yaprak-test.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const raw = fs.readFileSync(f, 'utf8');
  // Normalize CRLF to LF temporarily
  const lines = raw.split(/\r?\n/);
  
  // Find the line that has "// Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir"
  const commentIdx = lines.findIndex(l => l.includes('// Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir'));
  if (commentIdx !== -1) {
    console.log(`Found comment in ${f} at line ${commentIdx + 1}`);
    // Check if the next line is just "}" or whitespace + "}"
    if (lines[commentIdx + 1].trim() === '}') {
      lines.splice(commentIdx + 1, 1);
      console.log(`Removed extra brace at line ${commentIdx + 2} in ${f}`);
    }
  }

  fs.writeFileSync(f, lines.join('\n'), 'utf8');
});
