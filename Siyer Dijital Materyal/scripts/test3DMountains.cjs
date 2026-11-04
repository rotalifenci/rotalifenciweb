const THREE = require('three');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Build a real 3D mountain ridge massif
function createMountainRidgeGeometry(length, width, height, seed = 1) {
  const xSegs = 32;
  const zSegs = 24;
  const geo = new THREE.PlaneGeometry(length, width, xSegs, zSegs);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Distance from central ridge line (running along X axis)
    const normZ = Math.abs(z) / (width * 0.5); // 0 at ridge crest, 1 at skirts
    const normX = Math.abs(x) / (length * 0.5); // 0 at center, 1 at ends

    // Ridge crest height profile
    const ridgeProfile = Math.max(0, 1 - Math.pow(normZ, 1.35)) * Math.max(0, 1 - Math.pow(normX, 2.0));

    // Multi-octave natural rock noise (fractured crags & gullies)
    const crag1 = Math.sin(x * 0.18 + seed * 2.3) * Math.cos(z * 0.22) * 0.25;
    const crag2 = Math.sin(x * 0.42 - z * 0.35 + seed * 5.1) * 0.12;
    const gully = Math.pow(Math.abs(Math.sin(x * 0.12 + z * 0.08)), 2.5) * -0.22;
    const terraces = Math.sin(ridgeProfile * Math.PI * 5) * 0.06; // geological stepped terraces

    const h = (ridgeProfile + crag1 + crag2 + gully + terraces) * height;
    pos.setY(i, Math.max(0, h));
  }
  geo.computeVertexNormals();
  return geo;
}

console.log('Mountain geometry generator ready.');
