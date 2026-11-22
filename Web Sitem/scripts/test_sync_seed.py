const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));

console.log('Projects in seed:', Object.keys(seed.projects));
for (const [k, p] of Object.entries(seed.projects)) {
    console.log(` - ${k}: ${p.items.length} items`);
}
