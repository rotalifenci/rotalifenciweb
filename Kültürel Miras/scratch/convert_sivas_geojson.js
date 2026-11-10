const fs = require('fs');
const topojson = require('topojson-client');

// Read topojson and CSV
const topo = JSON.parse(fs.readFileSync('scratch/districts.topojson', 'utf8'));
const csvText = fs.readFileSync('scratch/districts.csv', 'utf8');

// Parse CSV for Sivas names and metadata
const nameMap = {};
csvText.split('\n').forEach(line => {
  const parts = line.split(',');
  if (parts.length > 5 && parts[2] === 'TR-P-58') {
    const id = parts[0];
    const name = parts[5];
    const slug = parts[6] === 'sivas' ? 'merkez' : parts[6];
    const lat = parseFloat(parts[16]);
    const lon = parseFloat(parts[17]);
    nameMap[id] = { id, name: parts[5] === 'Sivas' ? 'Merkez' : parts[5], slug, lat, lon };
  }
});

console.log('Name map entries:', Object.keys(nameMap).length);

// Extract GeoJSON
const geo = topojson.feature(topo, topo.objects.districts);
const sivasFeatures = geo.features.filter(f => f.properties && f.properties.parent_id === 'TR-P-58');

console.log('Sivas features count:', sivasFeatures.length);

// Add names
sivasFeatures.forEach(f => {
  const meta = nameMap[f.properties.id];
  if (meta) {
    f.properties.name = meta.name;
    f.properties.slug = meta.slug;
    f.properties.centerLat = meta.lat;
    f.properties.centerLon = meta.lon;
  }
});

// Calculate bounding box of Sivas
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;

function processCoords(coords) {
  if (typeof coords[0] === 'number') {
    const [lon, lat] = coords;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  } else {
    coords.forEach(processCoords);
  }
}

sivasFeatures.forEach(f => processCoords(f.geometry.coordinates));

console.log('Bounding box:', { minLon, maxLon, minLat, maxLat });

// Save GeoJSON
fs.writeFileSync('scratch/sivas_districts_authentic.geojson', JSON.stringify({
  type: 'FeatureCollection',
  features: sivasFeatures
}, null, 2), 'utf8');

console.log('Saved scratch/sivas_districts_authentic.geojson');
