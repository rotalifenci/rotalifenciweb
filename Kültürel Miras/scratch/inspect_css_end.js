const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'css/styles.css');
const css = fs.readFileSync(cssPath, 'utf8');
console.log('CSS length:', css.length);
console.log('Last 500 chars:');
console.log(css.substring(css.length - 500));
