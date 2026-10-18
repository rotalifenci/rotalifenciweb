const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(
    'setSimMode(7); // Master Mode 7 başlangıç\n        });',
    'setSimMode(7); // Master Mode 7 başlangıç\n            updateMoonPhasePIP();\n            updateAnalogClock();\n            updateTimeCounters();\n        });'
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated DOMContentLoaded hooks!');
