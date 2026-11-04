const fs = require('fs');

function updateEngine(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Rule 2 güncellemesi
  const oldRule2 = `    // 2. TUTULMALAR: GÜNEŞ TUTULMASI (1, 2, 3 Numaralandırılmış Model)
    else if (
      (qNorm.includes('numaralandirilmis') && (qNorm.includes('tutulma') || qNorm.includes('golge') || qNorm.includes('dizilim'))) ||
      (qNorm.includes('2 numarali') && qNorm.includes('3 numarali')) ||
      (qNorm.includes('gunes tutulma') && (hasNumbers || qNorm.includes('model')))
    ) {`;

  const newRule2 = `    // 2. TUTULMALAR: GÜNEŞ TUTULMASI & NUMARALANDIRILMIŞ DİZİLİM (1, 2, 3 Numaralandırılmış Model)
    else if (
      (qNorm.includes('numaralandirilmis') && (qNorm.includes('tutulma') || qNorm.includes('golge') || qNorm.includes('dizilim') || qNorm.includes('gok cisim') || qNorm.includes('konumlari'))) ||
      (qNorm.includes('2 numarali') && qNorm.includes('3 numarali')) ||
      (qNorm.includes('gunes tutulma') && (hasNumbers || qNorm.includes('model'))) ||
      (hasNumbers && qNorm.includes('dunya') && qNorm.includes('ay') && qNorm.includes('gunes'))
    ) {`;

  if (content.includes(oldRule2)) {
    content = content.replace(oldRule2, newRule2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated rule 2 in:', filePath);
  }
}

['js/visual_match_engine.js', '../js/visual_match_engine.js', 'api/visual_match_engine.js'].forEach(updateEngine);
