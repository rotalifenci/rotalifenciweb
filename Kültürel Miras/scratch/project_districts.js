const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('scratch/sivas_districts_authentic.geojson', 'utf8'));

// ViewBox configuration
const svgW = 1000;
const svgH = 760;
const pad = 45;

const minLon = 35.851444;
const maxLon = 38.772193;
const minLat = 38.542435;
const maxLat = 40.506736;

const midLatRad = ((minLat + maxLat) / 2) * Math.PI / 180;
const cosLat = Math.cos(midLatRad);

// Available width and height inside padding
const drawW = svgW - 2 * pad;
const drawH = svgH - 2 * pad;

// Geo distance scale
const spanX = (maxLon - minLon) * cosLat;
const spanY = (maxLat - minLat);

// Determine scale so it fits perfectly in drawW x drawH
const scale = Math.min(drawW / spanX, drawH / spanY);

// Actual drawn dimensions
const actualW = spanX * scale;
const actualH = spanY * scale;

// Center within SVG
const offsetX = pad + (drawW - actualW) / 2;
const offsetY = pad + (drawH - actualH) / 2;

function project(lon, lat) {
  const x = offsetX + (lon - minLon) * cosLat * scale;
  // Lat goes up north, SVG y goes down
  const y = offsetY + (maxLat - lat) * scale;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Convert coordinates to SVG path
function ringToPath(ring) {
  return ring.map((pt, i) => {
    const [x, y] = project(pt[0], pt[1]);
    return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ') + ' Z';
}

function geomToSvgPath(geom) {
  if (geom.type === 'Polygon') {
    return geom.coordinates.map(ringToPath).join(' ');
  } else if (geom.type === 'MultiPolygon') {
    return geom.coordinates.map(poly => poly.map(ringToPath).join(' ')).join(' ');
  }
  return '';
}

// Calculate centroid of polygon
function getCentroid(coords) {
  let totalPts = 0;
  let sumLon = 0, sumLat = 0;
  function walk(c) {
    if (typeof c[0] === 'number') {
      sumLon += c[0];
      sumLat += c[1];
      totalPts++;
    } else {
      c.forEach(walk);
    }
  }
  walk(coords);
  return [sumLon / totalPts, sumLat / totalPts];
}

const districtColors = [
  '#fdf6e7', '#f9eed7', '#faedd9', '#fbf1de', '#f5e8cc',
  '#fdf8ee', '#f8ebd5', '#faf0dc', '#f7e9cf', '#fdf5e6',
  '#faefd8', '#f8edd6', '#faf1de', '#f6e7cb', '#faeed7',
  '#fdf7eb', '#f8ecd5'
];

const districts = geojson.features.map((f, idx) => {
  const path = geomToSvgPath(f.geometry);
  const centroid = getCentroid(f.geometry.coordinates);
  // Prefer center from CSV if available, else centroid
  const centerPt = f.properties.centerLon && f.properties.centerLat 
    ? [f.properties.centerLon, f.properties.centerLat] 
    : centroid;
  const [cx, cy] = project(centerPt[0], centerPt[1]);

  return {
    id: f.properties.slug,
    name: f.properties.name,
    plateId: f.properties.id,
    center: { x: Math.round(cx), y: Math.round(cy) },
    centerCoords: { lon: centerPt[0], lat: centerPt[1] },
    color: districtColors[idx % districtColors.length],
    path: path
  };
});

console.log('Processed', districts.length, 'districts.');
districts.forEach(d => {
  console.log(`${d.name} (${d.id}): center=(${d.center.x}, ${d.center.y}), pathLen=${d.path.length}`);
});

fs.writeFileSync('scratch/sivas_districts_projected.json', JSON.stringify({
  viewBox: `0 0 ${svgW} ${svgH}`,
  projection: { minLon, maxLon, minLat, maxLat, cosLat, scale, offsetX, offsetY },
  districts: districts
}, null, 2), 'utf8');

console.log('Saved scratch/sivas_districts_projected.json');
