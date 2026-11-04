const fs = require('fs');
const path = require('path');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

// Determine question type of an item
function detectQType(item) {
  const t = (item.title || '').toLowerCase();
  const f = (item.format || '').toLowerCase();
  const file = (item.fileName || '').toLowerCase();

  if (t.includes('kısa cevap') || t.includes('kisa cevap') || t.includes('boşluk') || t.includes('bosluk') || f.includes('kısa cevap') || file.includes('kisa-cevap')) {
    return 'short_answer';
  }
  if (t.includes('açık uçlu') || t.includes('acik uclu') || t.includes('klasik') || f.includes('açık uçlu') || file.includes('acik-uclu')) {
    return 'open_ended';
  }
  if (t.includes('kavram harita') || f.includes('kavram harita') || file.includes('kavram-harita')) {
    return 'concept_map';
  }
  return 'multiple_choice'; // default / yaprak test / deneme
}

const grades = ['5', '6', '7', '8'];

grades.forEach(g => {
  console.log(`\n=================== GRADE ${g} ===================`);
  const items = mat.filter(m => String(m.grade).replace(/^grade-/, '') === g && m.category === 'denemeler');
  
  const byType = {
    multiple_choice: [],
    short_answer: [],
    open_ended: [],
    concept_map: []
  };

  items.forEach(item => {
    const qtype = detectQType(item);
    byType[qtype].push(item);
  });

  Object.keys(byType).forEach(qt => {
    if (byType[qt].length > 0) {
      console.log(`  Type: ${qt} (${byType[qt].length} items):`);
      byType[qt].forEach((item, idx) => {
        console.log(`    - Current: "${item.title}" | File: ${item.fileName}`);
      });
    }
  });
});
