const https = require('https');

https.get('https://miras-3b-osmanli-eserleri.vercel.app', (res) => {
  console.log('HTTP Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('viewBox 1000 760:', data.includes('viewBox="0 0 1000 760"'));
    console.log('No antiqueMapImage:', !data.includes('antiqueMapImage'));
    console.log('Compass rose present:', data.includes('compassRose'));
    console.log('Scale bar present:', data.includes('scaleBar'));
  });
}).on('error', (e) => console.error(e));
