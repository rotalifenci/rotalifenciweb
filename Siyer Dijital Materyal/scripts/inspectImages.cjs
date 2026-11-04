const fs = require('fs');
const buf = fs.readFileSync('public/assets/models/readyplayer.glb');
const chunkLength = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + chunkLength).toString('utf8');
const gltf = JSON.parse(jsonStr);

console.log('Textures count:', gltf.textures?.length);
console.log('Images count:', gltf.images?.length);
gltf.images?.forEach((img, i) => {
  const bv = gltf.bufferViews[img.bufferView];
  console.log(`Image ${i}: mimeType=${img.mimeType}, byteLength=${bv?.byteLength}`);
});
