const fs = require('fs');

const { districts, projection } = JSON.parse(fs.readFileSync('scratch/sivas_districts_projected.json', 'utf8'));
const monumentsData = fs.readFileSync('js/sivas-monuments-data.js', 'utf8');

// Extract monuments
const mMatch = monumentsData.match(/window\.SIVAS_MONUMENTS\s*=\s*(\[[\s\S]*?\]);/);
let monuments = [];
eval('monuments = ' + mMatch[1]);

console.log('Found', monuments.length, 'monuments.');

const { minLon, minLat, maxLat, cosLat, scale, offsetX, offsetY } = projection;

function project(lon, lat) {
  const x = offsetX + (lon - minLon) * cosLat * scale;
  const y = offsetY + (maxLat - lat) * scale;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Ray casting algorithm for SVG path
function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
      (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Check each monument
monuments.forEach(m => {
  const [x, y] = project(m.coords.lng, m.coords.lat);
  console.log(`Monument "${m.name}": coords=(${m.coords.lat}, ${m.coords.lng}) -> projected=(${x}, ${y}) district=${m.district}`);
});
