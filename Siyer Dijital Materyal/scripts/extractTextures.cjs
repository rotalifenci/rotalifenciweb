const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync('public/assets/models/readyplayer.glb');
const chunkLength = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + chunkLength).toString('utf8');
const gltf = JSON.parse(jsonStr);

const binStart = 20 + chunkLength + 8; // skip chunk header
const outDir = path.join(__dirname, 'extracted');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

gltf.images.forEach((img, i) => {
  const bv = gltf.bufferViews[img.bufferView];
  const offset = binStart + (bv.byteOffset || 0);
  const imgBuf = buf.slice(offset, offset + bv.byteLength);
  const ext = img.mimeType === 'image/png' ? 'png' : 'jpg';
  const outPath = path.join(outDir, `img_${i}.${ext}`);
  fs.writeFileSync(outPath, imgBuf);
  console.log(`Saved ${outPath} (${imgBuf.length} bytes)`);
});
