const fs = require('fs');
const sync = fs.readFileSync('api/sync.js', 'utf8');
console.log('kuvvet-laboratuvari in api/sync.js:', sync.includes('kuvvet-laboratuvari'));
