const https = require('https');

const query = `[out:json][timeout:30];
area["name"="Sivas"]["admin_level"="4"]->.a;
relation["admin_level"="6"](area.a);
out geom;`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

console.log('Querying Overpass API...');
const req = https.get(url, { headers: { 'User-Agent': 'SivasAtlas/1.0' } }, res => {
  let chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const data = Buffer.concat(chunks).toString('utf8');
    try {
      const parsed = JSON.parse(data);
      console.log('Elements count:', parsed.elements.length);
      console.log('Districts found:', parsed.elements.map(e => e.tags && e.tags.name));
      const fs = require('fs');
      fs.writeFileSync('scratch/sivas_osm_geom.json', data, 'utf8');
      console.log('Saved to scratch/sivas_osm_geom.json');
    } catch(e) {
      console.error('Parse error:', e.message, data.substring(0, 300));
    }
  });
});
req.on('error', e => console.error(e));
