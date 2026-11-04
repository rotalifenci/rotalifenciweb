const fs = require('fs');
const buf = fs.readFileSync('public/assets/models/xbot.glb');
const chunkLength = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + chunkLength).toString('utf8');
const gltf = JSON.parse(jsonStr);
console.log('Animations:', gltf.animations.map(a => a.name));
console.log('Meshes:', gltf.meshes.map(m => m.name));
console.log('Materials:', gltf.materials.map(m => m.name));
if (gltf.skins) {
  console.log('Skin joints count:', gltf.skins[0].joints.length);
}
