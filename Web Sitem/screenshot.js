const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const targetHtml = path.resolve(process.argv[2] || 'sunumlar/5-sinif-1-unite-gunes-dunya-ay.html');
const outFile = path.resolve(process.argv[3] || 'screenshot.png');

const cmd = `${edge} --headless --disable-gpu --no-sandbox --window-size=1920,1080 --screenshot="${outFile}" "file:///${targetHtml.replace(/\\/g, '/')}"`;
console.log('Taking screenshot...');
execSync(cmd, { stdio: 'inherit' });
console.log('Result exists:', fs.existsSync(outFile));
