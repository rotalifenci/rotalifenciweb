const fs = require('fs');
const content = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');
const lines = content.split('\n');

const missionHeaders = [];
lines.forEach((l, i) => {
  if (l.trim().startsWith('id:') && lines[i-1] && lines[i-1].includes('{')) {
    missionHeaders.push({ line: i+1, text: l.trim(), next: lines[i+1].trim(), title: lines[i+2].trim() });
  }
});
console.log(missionHeaders);
