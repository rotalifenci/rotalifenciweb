const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

console.log('--- ROVER PHYSICS SEARCH ---');
lines.forEach((l, i) => {
  if (l.includes('rover.pos') || l.includes('updateRover') || l.includes('getTerrainHeight') || l.includes('roverMesh.position')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
