// scripts/verify_kozmik_kasif.js
const fs = require('fs');

const path = 'oyunlar/kozmik-kasif-3d.html';
const content = fs.readFileSync(path, 'utf8');

console.log('1. Checking file size:', content.length);

// Extract JS
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('FAIL: No script tag found!');
    process.exit(1);
}

try {
    new Function(scriptMatch[1]);
    console.log('2. Javascript syntax is 100% VALID!');
} catch (e) {
    console.error('FAIL: Javascript syntax error:', e);
    process.exit(1);
}

// Check key variables and elements
const checks = [
    'MOON_CRATERS',
    'MISSIONS',
    'getMoonTerrainHeight',
    'createMissionBeacon',
    'crater-discovery-count',
    'nearest-crater-hud',
    'modal-missions',
    'modal-question',
    'setMissionFilter'
];

let allPassed = true;
checks.forEach(c => {
    const passed = content.includes(c);
    console.log(`3. Check "${c}": ${passed ? 'OK' : 'MISSING'}`);
    if (!passed) allPassed = false;
});

// Check craters count and missions count
const craterMatches = content.match(/\"name\":\s*\"[^\"]+Krateri\"/g);
console.log('4. Craters count in file:', craterMatches ? craterMatches.length : 0);

if (allPassed && craterMatches && craterMatches.length >= 20) {
    console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
    console.error('VERIFICATION FAILED!');
    process.exit(1);
}
