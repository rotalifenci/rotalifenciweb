const fs = require('fs');

const { districts, projection } = JSON.parse(fs.readFileSync('scratch/sivas_districts_projected.json', 'utf8'));
const monumentsData = fs.readFileSync('js/sivas-monuments-data.js', 'utf8');

const mMatch = monumentsData.match(/window\.SIVAS_MONUMENTS\s*=\s*(\[[\s\S]*?\]);/);
let monuments = [];
eval('monuments = ' + mMatch[1]);

const { minLon, minLat, maxLat, cosLat, scale, offsetX, offsetY } = projection;

function project(lon, lat) {
  const x = offsetX + (lon - minLon) * cosLat * scale;
  const y = offsetY + (maxLat - lat) * scale;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

console.log('Projected Monument Coordinates on SVG (1000x760):');
monuments.forEach(m => {
  const [x, y] = project(m.lon, m.lat);
  console.log(`"${m.name}" (${m.district}) -> SVG: (${x}, ${y})`);
});
