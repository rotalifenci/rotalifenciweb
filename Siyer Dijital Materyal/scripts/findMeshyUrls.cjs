const fs = require('fs');
const html = fs.readFileSync('c:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.system_generated/steps/3249/output.txt', 'utf8');

const regex = /https:[^"'`\s\\]+/gi;
let match;
const matches = new Set();
while ((match = regex.exec(html)) !== null) {
  const url = match[0];
  if (url.includes('cdn-models') || url.includes('tasks') || url.includes('glb') || url.includes('output')) {
    matches.add(url);
  }
}
console.log('Matches:', [...matches]);
