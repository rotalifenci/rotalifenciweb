const fs = require('fs');
const path = require('path');

// 1. api/sync.js
const syncPath = path.join(__dirname, '../api/sync.js');
let sync = fs.readFileSync(syncPath, 'utf8');
sync = sync.replace(
  '"oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi",',
  '"mat-6-2-sim-kuvvet-laboratuvari", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi",'
);
fs.writeFileSync(syncPath, sync, 'utf8');

// 2. js/app.js
const appPath = path.join(__dirname, '../js/app.js');
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(
  '"oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi",',
  '"mat-6-2-sim-kuvvet-laboratuvari", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi",'
);
fs.writeFileSync(appPath, app, 'utf8');

console.log('Protected mat-6-2-sim-kuvvet-laboratuvari in api/sync.js and js/app.js');
