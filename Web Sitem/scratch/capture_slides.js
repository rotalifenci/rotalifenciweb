const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const htmlFile = path.resolve('sunumlar/test_slides_13_14.html');

// 1. Capture Slide 13 (which is active by default)
const out13 = path.resolve('slide_13_shot.png');
console.log('Capturing Slide 13...');
execSync(`${edge} --headless --disable-gpu --no-sandbox --window-size=1920,1080 --screenshot="${out13}" "file:///${htmlFile.replace(/\\/g, '/')}"`, { stdio: 'inherit' });

// 2. Set Slide 14 active and capture
let html = fs.readFileSync(htmlFile, 'utf8');
let html14 = html.replace('class="slide-frame active" id="slide-13"', 'class="slide-frame" id="slide-13"')
                 .replace('class="slide-frame" id="slide-14"', 'class="slide-frame active" id="slide-14"');
const tempFile = path.resolve('sunumlar/temp_slide_14.html');
fs.writeFileSync(tempFile, html14, 'utf8');

const out14 = path.resolve('slide_14_shot.png');
console.log('Capturing Slide 14...');
execSync(`${edge} --headless --disable-gpu --no-sandbox --window-size=1920,1080 --screenshot="${out14}" "file:///${tempFile.replace(/\\/g, '/')}"`, { stdio: 'inherit' });

fs.unlinkSync(tempFile);
console.log('Both screenshots captured successfully!');
console.log('Slide 13 shot exists:', fs.existsSync(out13));
console.log('Slide 14 shot exists:', fs.existsSync(out14));
