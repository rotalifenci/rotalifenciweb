const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div class="svg-map-wrapper">');
const eIdx = html.indexOf('</div>\n\n          <!-- Tıklanan Eser Önizleme Popup Balonu -->', sIdx);
console.log(html.substring(sIdx, eIdx + 6));
