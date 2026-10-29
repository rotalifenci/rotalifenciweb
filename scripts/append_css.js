const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, '..', 'css', 'style.css'),
    path.join(__dirname, '..', '..', 'css', 'style.css')
];

const appendRule = `
/* =========================================================
   PARDUS AKILLI TAHTA & DOKUNMATİK EKRAN DESTEĞİ
   ========================================================= */
canvas {
    touch-action: none !important;
}
.unit-accordion-card, .mat-preview-box, .glass-panel {
    touch-action: manipulation;
}
`;

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        if (!content.includes('canvas {')) {
            content += appendRule;
            fs.writeFileSync(f, content, 'utf8');
            console.log('Appended to ' + f);
        } else {
            console.log('Already present in ' + f);
        }
    }
});
