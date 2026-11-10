const fs = require('fs');
const monumentsData = fs.readFileSync('js/sivas-monuments-data.js', 'utf8');

const mMatch = monumentsData.match(/window\.SIVAS_MONUMENTS\s*=\s*(\[[\s\S]*?\]);/);
let monuments = [];
eval('monuments = ' + mMatch[1]);
monuments.forEach(m => {
  console.log(`${m.name}: lat=${m.lat}, lon=${m.lon}, district=${m.district}`);
});
