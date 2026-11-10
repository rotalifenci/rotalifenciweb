const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/districts.topojson', 'utf8'));
console.log('TopoJSON type:', data.type);
console.log('Objects:', Object.keys(data.objects));

// Look at the first few features
const objKey = Object.keys(data.objects)[0];
const geometries = data.objects[objKey].geometries;
console.log('Geometries count:', geometries.length);
console.log('Sample properties:', geometries[0].properties);

// Find all geometries belonging to Sivas
const sivasGeoms = geometries.filter(g => {
  const p = g.properties || {};
  return (
    p.il_adi === 'Sivas' ||
    p.il === 'Sivas' ||
    p.province === 'Sivas' ||
    p.name === 'Sivas' ||
    p.il_kodu === 58 ||
    p.il_plaka === 58 ||
    p.plate === 58 ||
    JSON.stringify(p).includes('Sivas')
  );
});

console.log('Sivas geometries found:', sivasGeoms.length);
if (sivasGeoms.length > 0) {
  console.log('Sivas district properties:');
  sivasGeoms.forEach(g => console.log(g.properties));
}
