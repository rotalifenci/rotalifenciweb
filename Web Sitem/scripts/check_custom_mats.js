const fs = require('fs');
const code = fs.readFileSync('js/app.js', 'utf8');
const lines = code.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('function getCustomMaterialsList') || l.includes('rotali_custom_materials')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
