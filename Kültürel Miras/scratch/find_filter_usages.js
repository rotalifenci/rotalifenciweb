const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

let pos = 0;
while (true) {
  const idx = code.indexOf('currentPeriodFilter', pos);
  if (idx === -1) break;
  console.log('Index:', idx, 'Snippet:', code.substring(idx - 40, idx + 80).replace(/\n/g, ' '));
  pos = idx + 20;
}
