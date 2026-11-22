const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const targetHtml = path.resolve('index.html');
const outFile = path.resolve('scratch_projects.png');

const cmd = `${edge} --headless --disable-gpu --no-sandbox --virtual-time-budget=4000 --window-size=1920,1080 --screenshot="${outFile}" "file:///${targetHtml.replace(/\\/g, '/')}#projects"`;
console.log('Taking screenshot of #projects...');
try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Screenshot saved, size:', fs.statSync(outFile).size);
} catch (e) {
    console.error('Error:', e.message);
}
