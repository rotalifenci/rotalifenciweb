const fs = require('fs');
const monumentsData = fs.readFileSync('js/sivas-monuments-data.js', 'utf8');

const mMatch = monumentsData.match(/window\.SIVAS_MONUMENTS\s*=\s*(\[[\s\S]*?\]);/);
let monuments = [];
eval('monuments = ' + mMatch[1]);
console.log('Sample monument keys:', Object.keys(monuments[0]));
console.log('Location/coords in monument[0]:', monuments[0].location, monuments[0].coords, monuments[0].svgCoords);
