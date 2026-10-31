const fs = require('fs');
const path = require('path');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
const denemeler = mat.filter(m => m.category === 'denemeler');

console.log('Checking all', denemeler.length, 'denemeler materials...');

denemeler.forEach((d, idx) => {
  const filePath = path.join(__dirname, '..', d.fileUrl);
  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.error(`❌ [${idx + 1}] File NOT FOUND: ${d.fileUrl}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const isZKitap = content.includes('zk-main-viewport') && content.includes('zk-bottom-center');
  const hasOldBadges = content.includes('question-block') || content.includes('yp-neon-card') || content.includes('🧩 Kısa Cevaplı');
  console.log(`[${idx + 1}] ${d.title}: Exists=true, isZKitap=${isZKitap}, hasOldBadges=${hasOldBadges}, size=${content.length}`);
});
