const fs = require('fs');
['aya-inis-3d.html', 'gunes-sistemi-3d.html', 'gunes-sistemi-yolculuk-3d.html', 'uzay-ekspresi.html'].forEach(f => {
  const p = 'oyunlar/' + f;
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  content.split('\n').forEach(l => {
    if (l.includes('OrbitControls') || l.includes('three.js') || l.includes('three.min.js')) {
      console.log(f + ': ' + l.trim());
    }
  });
});
