const fs = require('fs');
const path = require('path');

const files = [
  'js/sivas-monuments-data.js',
  'js/sivas-map-data.js',
  'js/guides-data.js',
  'js/evaluation-data.js',
  'js/app.js'
];

let allOk = true;
files.forEach(f => {
  const p = path.join(process.cwd(), f);
  try {
    const code = fs.readFileSync(p, 'utf8');
    new Function(code);
    console.log(`[PASS] ${f} (size: ${code.length} bytes)`);
  } catch (err) {
    console.error(`[FAIL] ${f}:`, err.message);
    allOk = false;
  }
});

if (allOk) {
  console.log('\nALL JAVASCRIPT FILES COMPILED AND VALIDATED SUCCESSFULLY!');
} else {
  process.exit(1);
}
