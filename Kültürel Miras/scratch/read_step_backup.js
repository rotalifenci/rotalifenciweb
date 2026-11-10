const fs = require('fs');
const stepFile = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\43c78db7-a405-4ec9-bf50-bf5d50cec01a\\.system_generated\\steps\\1238\\output.txt';
const content = fs.readFileSync(stepFile, 'utf8');
console.log('File length:', content.length);
console.log('First 2000 chars:');
console.log(content.substring(0, 2000));
