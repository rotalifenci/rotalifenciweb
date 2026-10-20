const fs = require('fs');

const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let i = 0;
while ((m = scriptRegex.exec(html)) !== null) {
  const full = m[0];
  const code = m[1];
  const src = full.match(/src=["']([^"']+)["']/i);
  if (src) {
    console.log(`Script ${i}: External (${src[1]})`);
  } else if (code.trim()) {
    try {
      new Function(code);
      console.log(`Script ${i}: Inline (${code.length} chars) - SYNTAX VALID`);
    } catch (e) {
      console.error(`Script ${i}: Inline SYNTAX ERROR:`, e.message);
    }
  }
  i++;
}
