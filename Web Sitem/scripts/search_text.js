const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory() && f !== 'node_modules' && f !== '.git') {
            searchDir(full);
        } else if (f.endsWith('.js') || f.endsWith('.html')) {
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('Geri Dönüşüm Robotu') || content.includes('CODEWEEK_ACTIVITIES') || content.includes('Tümü 6') || content.includes('Tümü')) {
                const lines = content.split('\n');
                lines.forEach((l, i) => {
                    if (l.includes('Geri Dönüşüm Robotu') || l.includes('Tümü') && l.includes('Sınıf')) {
                        console.log(`${full}:${i + 1}: ${l.trim().slice(0, 100)}`);
                    }
                });
            }
        }
    }
}

searchDir('.');
