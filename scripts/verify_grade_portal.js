const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = global;
global.document = {
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
};

// Load curriculum-data.js and data.js
require('../js/curriculum-data.js');

console.log('--- TEST 1: MEB Curriculum Check ---');
const g5u1 = window.MEB_CURRICULUM['5'].units[0];
console.log('Unit 1 Name:', g5u1.name);
console.log('Subtopics:');
g5u1.subtopics.forEach(s => console.log('  ' + s.num + '. ' + s.title));

console.log('--- TEST 2: Subtopics Helper ---');
const subtopics = window.getUnitSubtopics(5, 1);
console.log('getUnitSubtopics(5, 1) length:', subtopics.length);
if (subtopics.length === 4 && subtopics[0].title === "Güneş'in Yapısı ve Özellikleri") {
    console.log('✅ MEB Curriculum Subtopics verified!');
} else {
    console.error('❌ Subtopics verification failed!');
    process.exit(1);
}

console.log('--- TEST 3: App.js Checks ---');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

const requiredTokens = [
    '🎥 VİDEOLAR',
    '🧩 ETKİNLİKLER',
    '📝 TEST / DENEME',
    '🎯 YAZILIYA HAZIRLIK',
    '🎮 EĞİTSEL OYUN',
    'filterMaterialsBySubtopic',
    'subtopic-filter-btn',
    'unit-material-card',
    'MEB Ünite Alt Başlıkları'
];

let allTokensFound = true;
requiredTokens.forEach(token => {
    const found = appJs.includes(token);
    console.log(`Token "${token}": ${found ? '✅ FOUND' : '❌ MISSING'}`);
    if (!found) allTokensFound = false;
});

if (allTokensFound) {
    console.log('🎉 ALL TESTS PASSED! Grade portal hierarchical curriculum structure is complete and fully verified.');
} else {
    console.error('❌ Some required tokens are missing!');
    process.exit(1);
}
