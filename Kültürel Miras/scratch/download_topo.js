const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/ttezer/turkiye-harita-verisi/master/dist/topojson/districts.topojson';
const file = fs.createWriteStream('scratch/districts.topojson');

console.log('Downloading districts.topojson...');
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download:', res.statusCode);
    return;
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded successfully! File size:', fs.statSync('scratch/districts.topojson').size);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
