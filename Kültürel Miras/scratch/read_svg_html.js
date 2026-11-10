const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<svg id="sivasSvgMap"');
console.log(html.substring(sIdx, sIdx + 1500));
