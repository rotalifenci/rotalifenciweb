const fs = require('fs');

// 1. Check data/materials.json valid JSON
try {
  const mats = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
  console.log('materials.json: VALID JSON (' + mats.length + ' items)');
  const k = mats.find(m => m.id === 'mat-6-2-sim-kuvvet-laboratuvari');
  console.log('Kuvvet lab unit & targetSection:', k.unit, '| targetSection:', k.targetSection);
} catch(e) {
  console.error('materials.json ERROR:', e);
}

// 2. Check js/app.js syntax
try {
  const appCode = fs.readFileSync('js/app.js', 'utf8');
  new Function(appCode);
  console.log('js/app.js: SYNTAX OK');
} catch(e) {
  console.error('js/app.js SYNTAX ERROR:', e);
}

// 3. Check api/sync.js syntax
try {
  const syncCode = fs.readFileSync('api/sync.js', 'utf8');
  new Function('require', 'module', 'exports', syncCode);
  console.log('api/sync.js: SYNTAX OK');
} catch(e) {
  console.error('api/sync.js SYNTAX ERROR:', e);
}

// 4. Check inline script syntax in kuvvet-laboratuvari.html
try {
  const html = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');
  const scriptRegex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let sCount = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    sCount++;
    try {
      new Function(match[1]);
      console.log('kuvvet-laboratuvari.html script #' + sCount + ': SYNTAX OK');
    } catch(err) {
      console.error('kuvvet-laboratuvari.html script #' + sCount + ' SYNTAX ERROR:', err);
    }
  }
} catch(e) {
  console.error('HTML script check error:', e);
}
