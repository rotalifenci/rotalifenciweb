const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<svg id="pickerSvgMap"');
if (sIdx !== -1) {
  const eIdx = html.indexOf('</svg>', sIdx);
  console.log(html.substring(sIdx, eIdx + 6));
} else {
  console.log('pickerSvgMap not found');
}
