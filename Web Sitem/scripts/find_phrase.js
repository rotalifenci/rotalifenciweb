const fs = require('fs');
const path = require('path');

function search(dir, phrase) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        search(full, phrase);
      } else if (item.endsWith('.html') || item.endsWith('.js') || item.endsWith('.json')) {
        const str = fs.readFileSync(full, 'utf8');
        if (str.includes(phrase)) {
          console.log('MATCH FOUND:', full);
        }
      }
    } catch(e) {}
  }
}

console.log('Searching for "Gök cisimlerinden gelen"...');
search('testler', 'Gök cisimlerinden gelen');
search('../testler', 'Gök cisimlerinden gelen');
search('data', 'Gök cisimlerinden gelen');
search('../data', 'Gök cisimlerinden gelen');
search('..', 'Gök cisimlerinden gelen');
