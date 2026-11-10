const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<svg id="sivasSvgMap"');
const eIdx = html.indexOf('</svg>', sIdx);
console.log(html.substring(sIdx, eIdx + 6));
