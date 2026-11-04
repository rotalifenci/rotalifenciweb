const fs = require('fs');

const xbuf = fs.readFileSync('public/assets/models/xbot.glb');
const xChunkLen = xbuf.readUInt32LE(12);
const xjson = JSON.parse(xbuf.slice(20, 20 + xChunkLen).toString('utf8'));
const xbinStart = 20 + xChunkLen + 8;
const xbin = xbuf.slice(xbinStart);

console.log('xbot accessors count:', xjson.accessors.length);
console.log('xbot bufferViews count:', xjson.bufferViews.length);
console.log('xbot animations count:', xjson.animations.length);

xjson.animations.forEach((anim, i) => {
  console.log(`Animation ${i}: name=${anim.name}, samplers=${anim.samplers.length}, channels=${anim.channels.length}`);
});
