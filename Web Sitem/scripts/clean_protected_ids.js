const fs = require('fs');

['api/sync.js', 'js/app.js'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('"mat-game-gezegen-kosusu",')) {
    c = c.replace('"mat-game-gezegen-kosusu",', '');
    fs.writeFileSync(file, c, 'utf8');
    console.log('✔ Removed mat-game-gezegen-kosusu from', file);
  }
});
