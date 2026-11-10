const https = require('https');

const url = 'https://raw.githubusercontent.com/ttezer/turkiye-harita-verisi/master/dist/csv/districts.csv';
https.get(url, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      const fs = require('fs');
      fs.writeFileSync('scratch/districts.csv', data, 'utf8');
      const lines = data.split('\n').filter(l => l.includes('TR-D-58') || l.includes('TR-P-58'));
      console.log('Sivas lines count:', lines.length);
      lines.forEach(l => console.log(l));
    }
  });
});
