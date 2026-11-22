const { execSync } = require('child_process');
const path = require('path');
const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const testHtmlPath = path.resolve('scratch_test_session.html');

const cmd = `${edge} --headless --disable-gpu --no-sandbox --dump-dom "file:///${testHtmlPath.replace(/\\/g, '/')}#projects"`;
try {
    const dom = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const idx = dom.indexOf('Listelenen Kayıt:');
    console.log(dom.substring(idx - 100, idx + 800));
} catch(e) {
    console.error('Error:', e.message);
}
