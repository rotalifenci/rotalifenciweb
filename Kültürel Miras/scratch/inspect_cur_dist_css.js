const fs = require('fs');
const css = fs.readFileSync('css/styles.css', 'utf8');

const sIdx = css.indexOf('.district-polygon {');
console.log(css.substring(sIdx, sIdx + 1400));
