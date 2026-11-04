const fs = require('fs');

const buf = fs.readFileSync('public/assets/models/readyplayer.glb');
const chunkLength = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + chunkLength).toString('utf8');
const gltf = JSON.parse(jsonStr);

console.log('Meshes details:');
gltf.meshes.forEach((m, idx) => {
  console.log(`Mesh ${idx}: ${m.name}, primitives:`, m.primitives.map(p => ({
    material: p.material !== undefined ? gltf.materials[p.material]?.name : 'none',
    mode: p.mode
  })));
});

console.log('\nMaterials details:');
gltf.materials.forEach((mat, idx) => {
  console.log(`Material ${idx}: ${mat.name}`, mat.pbrMetallicRoughness);
});
