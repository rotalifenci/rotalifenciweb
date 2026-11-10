const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/districts.topojson', 'utf8'));
const geometries = data.objects.districts.geometries;

const sivasGeoms = geometries.filter(g => g.properties && g.properties.parent_id === 'TR-P-58');
console.log('Sivas count (TR-P-58):', sivasGeoms.length);
sivasGeoms.forEach(g => console.log(g.properties));
