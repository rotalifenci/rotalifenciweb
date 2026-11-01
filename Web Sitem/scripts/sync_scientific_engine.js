const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'scientific_visual_engine.js');
const targets = [
  path.resolve(__dirname, '../api/scientific_visual_engine.js'),
  path.resolve(__dirname, '../../api/scientific_visual_engine.js'),
  path.resolve(__dirname, '../../Yaprak Test/scientific_visual_engine.js')
];

targets.forEach(t => {
  const dir = path.dirname(t);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, t);
  console.log('Copied to', t);
});
