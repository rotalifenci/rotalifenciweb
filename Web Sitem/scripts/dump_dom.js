const { execSync } = require('child_process');
const path = require('path');
const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const targetHtml = path.resolve('index.html');

const cmd = `${edge} --headless --disable-gpu --no-sandbox --dump-dom "file:///${targetHtml.replace(/\\/g, '/')}#projects"`;
try {
    const dom = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const hasTubitak = dom.includes('tubitak-research-container');
    const hasLogin = dom.includes('tubitak-login-form');
    const hasSection = dom.includes('section-tubitak-research');
    console.log({ hasTubitak, hasLogin, hasSection });
    const idx = dom.indexOf('tubitak-research-container');
    console.log(dom.substring(idx - 100, idx + 400));
} catch (e) {
    console.error('Error:', e.message);
}
