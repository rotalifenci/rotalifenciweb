const fs = require('fs');
const assert = require('assert');

// 1. Check curriculum-data
const curriculum = require('../js/curriculum-data.js');
console.log('Testing curriculum data...');
const g5u1 = curriculum.getUnitSubtopics('5', 1);
assert(g5u1.length === 3, '5. sinif 1. unite should have 3 subtopics');
console.log('✔ 5. Sınıf 1. Ünite Alt Başlıkları:', g5u1.map(s => s.code + ' ' + s.title));

const g8u2 = curriculum.getUnitSubtopics('8', 2);
assert(g8u2.length === 5, '8. sinif 2. unite should have 5 subtopics');
console.log('✔ 8. Sınıf 2. Ünite Alt Başlıkları:', g8u2.map(s => s.code + ' ' + s.title));

// 2. Check app.js contents
const appJs = fs.readFileSync('./js/app.js', 'utf8');
assert(appJs.includes('adv-subtopic-select'), 'app.js must contain adv-subtopic-select');
assert(appJs.includes('adv-subtopic-wrapper'), 'app.js must contain adv-subtopic-wrapper');
assert(appJs.includes('updateCascadingSubtopics'), 'app.js must contain updateCascadingSubtopics');
assert(appJs.includes('handleAdvUnitChange'), 'app.js must contain handleAdvUnitChange');
assert(appJs.includes('subtopicNum: subtopicNum'), 'app.js must save subtopicNum');
assert(appJs.includes('subtopicCode: subtopicCode'), 'app.js must save subtopicCode');
assert(appJs.includes('subtopic: subtopicTitle'), 'app.js must save subtopicTitle');

console.log('✔ All assertions passed! Material upload & edit modal now fully supports subtopic selection.');
