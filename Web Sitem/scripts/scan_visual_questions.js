const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('testler').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(path.join('testler', f), 'utf8');
  const matches = [];
  const regex = /"question":\s*"([^"]*(?:soru işareti|\(\?\)|numaralandırılmış)[^"]*)"/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[1].slice(0, 100));
  }
  if (matches.length > 0) {
    console.log(f, 'has', matches.length, 'questions with (?), soru işareti, or numaralandırılmış:');
    matches.forEach(q => console.log('  -', q));
  }
});
