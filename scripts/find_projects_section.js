const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
    if (l.includes('id="projects"') || l.includes('id="codeweek"') || l.includes('Geri Dönüşüm Robotu') || l.includes('Tümü')) {
        console.log(`Line ${i + 1}: ${l.trim().slice(0, 100)}`);
    }
});
