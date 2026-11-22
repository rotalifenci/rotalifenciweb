const fs = require('fs');
['version.json', '../version.json'].forEach(p => {
    fs.writeFileSync(p, JSON.stringify({ v: '20261115_1300' }) + '\n', 'utf8');
});
['index.html', '../index.html'].forEach(p => {
    let html = fs.readFileSync(p, 'utf8');
    html = html.replace(/tubitak-research\.js\?v=[^"']+/g, 'tubitak-research.js?v=20261115_1300');
    fs.writeFileSync(p, html, 'utf8');
});
console.log('Updated version tags to 20261115_1300');
