const fs = require('fs');
const css = fs.readFileSync('css/styles.css', 'utf8');

const sIdx = css.indexOf('.district-polygon');
if (sIdx !== -1) {
  console.log(css.substring(sIdx, sIdx + 1200));
} else {
  console.log('.district-polygon not found in CSS');
}
