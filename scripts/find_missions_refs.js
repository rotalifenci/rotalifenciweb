const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('MISSIONS') || l.includes('openMissionModal') || l.includes('moonTargetBeacons')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
