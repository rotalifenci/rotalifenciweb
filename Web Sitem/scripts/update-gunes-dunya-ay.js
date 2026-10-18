const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Original file read successfully, length:', content.length);
