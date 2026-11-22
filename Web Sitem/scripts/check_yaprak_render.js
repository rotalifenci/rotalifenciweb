const { execSync } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
try {
  execSync(`"${edgePath}" --headless --disable-gpu --dump-dom "https://rotalifenci.vercel.app/yaprak-test.html" > scratch_dump_yaprak.html`);
  const dump = fs.readFileSync('scratch_dump_yaprak.html', 'utf8');
  console.log('Dump length:', dump.length);
  console.log('Has previewEmptyPlaceholder?', dump.includes('previewEmptyPlaceholder'));
  const pIdx = dump.indexOf('previewEmptyPlaceholder');
  if (pIdx !== -1) {
    console.log('Snippet around placeholder:\n', dump.slice(pIdx - 50, pIdx + 300));
  }
} catch (e) {
  console.error('Edge run error:', e.message);
}
