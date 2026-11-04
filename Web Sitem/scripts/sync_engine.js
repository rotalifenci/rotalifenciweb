const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('scripts/zkitap_engine.js', 'utf8');

const targets = [
  'api/zkitap_engine.js',
  '../api/zkitap_engine.js',
  '../Yaprak Test/zkitap_engine.js'
];

targets.forEach(t => {
  if (fs.existsSync(path.dirname(t))) {
    fs.writeFileSync(t, src, 'utf8');
    console.log('Synced engine to:', t);
  }
});
