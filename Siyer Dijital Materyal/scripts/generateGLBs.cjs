const fs = require('fs');
const path = require('path');

function createCustomGLB(sourceGlbPath, outGlbPath, imageReplacements, removeBeard = true) {
  const buf = fs.readFileSync(sourceGlbPath);
  const jsonChunkLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.slice(20, 20 + jsonChunkLen).toString('utf8'));
  const binStart = 20 + jsonChunkLen + 8;
  const oldBin = buf.slice(binStart);

  // Buffer builder
  const newBufferViews = [];
  const binChunks = [];
  let currentOffset = 0;

  // Map old bufferView index to new bufferView data
  for (let i = 0; i < gltf.bufferViews.length; i++) {
    const oldBv = gltf.bufferViews[i];
    
    // Check if this bufferView belongs to an image we are replacing
    let replacementFile = null;
    for (const [imgIdx, filePath] of Object.entries(imageReplacements)) {
      if (gltf.images[imgIdx] && gltf.images[imgIdx].bufferView === i) {
        replacementFile = filePath;
        break;
      }
    }

    let chunkData;
    if (replacementFile && fs.existsSync(replacementFile)) {
      chunkData = fs.readFileSync(replacementFile);
    } else {
      const oldOffset = oldBv.byteOffset || 0;
      chunkData = oldBin.slice(oldOffset, oldOffset + oldBv.byteLength);
    }

    // Pad to 4-byte alignment
    const padLength = (4 - (chunkData.length % 4)) % 4;
    const paddedChunk = padLength > 0
      ? Buffer.concat([chunkData, Buffer.alloc(padLength, 0)])
      : chunkData;

    const newBv = { ...oldBv };
    newBv.byteOffset = currentOffset;
    newBv.byteLength = chunkData.length;
    newBufferViews.push(newBv);

    binChunks.push(paddedChunk);
    currentOffset += paddedChunk.length;
  }

  gltf.bufferViews = newBufferViews;
  gltf.buffers[0].byteLength = currentOffset;

  // Remove beard mesh if present
  if (removeBeard) {
    const beardMeshIdx = gltf.meshes.findIndex(m => m.name === 'Wolf3D_Beard');
    if (beardMeshIdx !== -1) {
      gltf.nodes.forEach(node => {
        if (node.mesh === beardMeshIdx) {
          delete node.mesh;
        }
      });
    }
  }

  const combinedBin = Buffer.concat(binChunks);

  // Serialize JSON chunk
  let jsonStr = JSON.stringify(gltf);
  // Pad JSON string with spaces to 4-byte boundary
  const jsonPad = (4 - (Buffer.byteLength(jsonStr) % 4)) % 4;
  for (let p = 0; p < jsonPad; p++) {
    jsonStr += ' ';
  }
  const jsonBuffer = Buffer.from(jsonStr, 'utf8');

  // Build binary GLB
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + combinedBin.length;
  const glbBuffer = Buffer.alloc(totalLength);

  // 12-byte header
  glbBuffer.writeUInt32LE(0x46546C67, 0); // 'glTF'
  glbBuffer.writeUInt32LE(2, 4);          // version 2
  glbBuffer.writeUInt32LE(totalLength, 8); // total length

  // Chunk 0: JSON
  glbBuffer.writeUInt32LE(jsonBuffer.length, 12);
  glbBuffer.writeUInt32LE(0x4E4F534A, 16); // 'JSON'
  jsonBuffer.copy(glbBuffer, 20);

  // Chunk 1: BIN
  const binHeaderOffset = 20 + jsonBuffer.length;
  glbBuffer.writeUInt32LE(combinedBin.length, binHeaderOffset);
  glbBuffer.writeUInt32LE(0x004E4942, binHeaderOffset + 4); // 'BIN\0'
  combinedBin.copy(glbBuffer, binHeaderOffset + 8);

  fs.writeFileSync(outGlbPath, glbBuffer);
  console.log(`Generated GLB: ${outGlbPath} (${glbBuffer.length} bytes)`);
}

const source = 'public/assets/models/readyplayer.glb';
const modelsDir = 'public/assets/models';

// Eren
createCustomGLB(source, path.join(modelsDir, 'eren.glb'), {
  16: path.join(modelsDir, 'eren_top.jpg'),
  10: path.join(modelsDir, 'eren_bottom.jpg'),
  13: path.join(modelsDir, 'eren_shoes.jpg'),
  5: path.join(modelsDir, 'eren_hair.jpg'),
  1: path.join(modelsDir, 'eren_skin.jpg')
}, true);

// Aybüke
createCustomGLB(source, path.join(modelsDir, 'aybuke.glb'), {
  16: path.join(modelsDir, 'aybuke_top.jpg'),
  10: path.join(modelsDir, 'aybuke_bottom.jpg'),
  13: path.join(modelsDir, 'aybuke_shoes.jpg'),
  5: path.join(modelsDir, 'aybuke_head.jpg'),
  1: path.join(modelsDir, 'aybuke_skin.jpg')
}, true);
