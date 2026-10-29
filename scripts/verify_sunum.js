const fs = require('fs');

const html = fs.readFileSync('sunumlar/5-sinif-1-unite-gunes-dunya-ay.html', 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let index = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const code = match[1];
  const srcMatch = fullTag.match(/src=["']([^"']+)["']/i);
  
  if (srcMatch) {
    console.log(`Script ${index}: External (${srcMatch[1]})`);
  } else {
    try {
      new Function(code);
      console.log(`Script ${index}: Inline (${code.length} chars) - SYNTAX OK`);
    } catch (err) {
      console.error(`Script ${index}: Inline SYNTAX ERROR:`, err.message);
    }
  }
  index++;
}
