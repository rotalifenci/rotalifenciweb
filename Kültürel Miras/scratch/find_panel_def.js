const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const regex = /renderDistrictInfoPanel\s*\([^)]*\)\s*\{/g;
let m;
while ((m = regex.exec(appCode)) !== null) {
  console.log('Match at', m.index, appCode.substring(m.index, m.index + 800));
}
