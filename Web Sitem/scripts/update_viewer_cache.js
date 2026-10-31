const fs = require('fs');

const files = ['api/test-viewer.js', '../api/test-viewer.js'];

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  code = code.replace(/res\.setHeader\('Cache-Control',[^)]+\);/, "res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');");
  fs.writeFileSync(p, code, 'utf8');
  console.log('Updated cache-control in:', p);
});
