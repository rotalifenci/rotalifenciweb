const fs = require('fs');
const path = require('path');

function updateHtml(filePath) {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Add curriculum-data.js before app.js if not already present
    if (!html.includes('curriculum-data.js')) {
        html = html.replace(
            /(<script\s+src=["']js\/app\.js[^"']*["']><\/script>)/i,
            '<script src="js/curriculum-data.js?v=20261025_2200"></script>\n    $1'
        );
    }

    // 2. Update default nav links from ders-notu to videolar
    html = html.replace(/#grade\/grade-([5-8])\/ders-notu/g, '#grade/grade-$1/videolar');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Successfully updated:', filePath);
}

updateHtml(path.join(__dirname, '..', 'index.html'));
updateHtml(path.join(__dirname, '..', '..', 'index.html'));
