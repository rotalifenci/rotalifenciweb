const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

const aIdx = lines.findIndex(l => l.includes('function animate()'));
for (let i = aIdx; i <= aIdx + 20; i++) {
    console.log(JSON.stringify(lines[i]));
}
