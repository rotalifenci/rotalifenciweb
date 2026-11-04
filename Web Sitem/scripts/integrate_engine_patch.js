const fs = require('fs');
const path = require('path');

function patchYaprakJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. cleanTurkishAndLatex içine Yandaki dönüştürücüsünü ekle
  if (!content.includes('Kullanıcı Talimatı: "sorularda yukarıdaki')) {
    const target = 'return text.trim();';
    const replacement = `    // Kullanıcı Talimatı: "sorularda yukarıdaki demiş yandaki diye düzelt tüm sorular için bunu yap"
    text = text.replace(/\\bYukarıdaki\\b/g, 'Yandaki');
    text = text.replace(/\\byukarıdaki\\b/g, 'yandaki');
    text = text.replace(/\\bYukarıda\\b/g, 'Yanda');
    text = text.replace(/\\byukarıda\\b/g, 'yanda');

    return text.trim();`;
    content = content.replace(target, replacement);
  }

  // 2. Mükerrer mainActCb dinleyicisini kaldır
  const duplicateBlock = `    const mainActCb = document.getElementById('qt_cb_activity');
    if (mainActCb) {
      mainActCb.addEventListener('change', () => {
        syncActivitySubtypesUI();
        updateQtTotalCount();
      });
    }`;
  if (content.includes(duplicateBlock)) {
    content = content.replace(duplicateBlock, '');
  }

  // 3. updateQtTotalCount içine engine bağlama
  if (!content.includes('window.questionPrepEngine.setTypeEnabled(t, true)')) {
    const oldUpdate = `          countInputEl.disabled = false;
          if (row) row.classList.add('is-active');
          const val = parseInt(countInputEl.value, 10) || 0;
          total += val;`;
    const newUpdate = `          countInputEl.disabled = false;
          if (row) row.classList.add('is-active');
          const val = parseInt(countInputEl.value, 10) || 0;
          total += val;
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, true);
            window.questionPrepEngine.setTypeCount(t, val);
          }`;
    content = content.replace(oldUpdate, newUpdate);

    const oldDisabled = `          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');`;
    const newDisabled = `          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, false);
          }`;
    content = content.replace(oldDisabled, newDisabled);

    const oldBadge = `    syncActivitySubtypesUI();

    if (qtTotalCountBadge) {`;
    const newBadge = `    syncActivitySubtypesUI();

    if (window.questionPrepEngine) {
      total = window.questionPrepEngine.getTotalCount();
    }

    if (qtTotalCountBadge) {`;
    content = content.replace(oldBadge, newBadge);
  }

  // 4. Output mode radyo dinleyicisini bağla
  if (!content.includes('window.questionPrepEngine.setOutputMode(radio.value)')) {
    const targetWire = 'updateQtTotalCount();\n  }\n\n  // Hem anında hem DOM hazır olduğunda çalıştır';
    const replacementWire = `    document.querySelectorAll('input[name="qtOutputMode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (window.questionPrepEngine) {
          window.questionPrepEngine.setOutputMode(radio.value);
        }
      });
    });

    updateQtTotalCount();
  }

  // Hem anında hem DOM hazır olduğunda çalıştır`;
    content = content.replace(targetWire, replacementWire);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched:', filePath);
}

patchYaprakJs('js/yaprak-test.js');
if (fs.existsSync('../js/yaprak-test.js')) {
  patchYaprakJs('../js/yaprak-test.js');
}
