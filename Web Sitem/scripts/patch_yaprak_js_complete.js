const fs = require('fs');

let js = fs.readFileSync('js/yaprak-test.js', 'utf8');

// 1. Ensure updateQtTotalCount updates label correctly and sets window.updateQtTotalCount
const oldUpdateBadge = "if (qtTotalCountBadge) {\n      qtTotalCountBadge.textContent = `📊 Toplam: ${total} İçerik`;\n    }";
const newUpdateBadge = `if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = \`📊 Toplam: \${total} Soru / İçerik\`;
    }`;
if (js.includes(oldUpdateBadge)) {
  js = js.replace(oldUpdateBadge, newUpdateBadge);
}

// 2. Ensure window.updateQtTotalCount is exported at the end of updateQtTotalCount
if (!js.includes('window.updateQtTotalCount = updateQtTotalCount;')) {
  js = js.replace(
    'const hiddenCount = document.getElementById(\'countInput\');\n    if (hiddenCount) hiddenCount.value = String(total || 10);\n  }',
    'const hiddenCount = document.getElementById(\'countInput\');\n    if (hiddenCount) hiddenCount.value = String(total || 10);\n  }\n  window.updateQtTotalCount = updateQtTotalCount;'
  );
}

// 3. Ensure "Yukarıdaki" -> "Yandaki" in cleanedQuestions
if (!js.includes('cq.question = (cq.question || \'\').replace(/\\bYukarıdaki\\b/g, \'Yandaki\')')) {
  const cleanQTarget = 'cq.question = cleanTurkishAndLatex(cq.question);';
  const cleanQReplacement = `cq.question = cleanTurkishAndLatex(cq.question)
            .replace(/\\bYukarıdaki\\b/g, 'Yandaki')
            .replace(/\\byukarıdaki\\b/g, 'yandaki')
            .replace(/\\bYukarıda\\b/g, 'Yanda')
            .replace(/\\byukarıda\\b/g, 'yanda')
            .replace(/\\bYukardaki\\b/g, 'Yandaki')
            .replace(/\\byukardaki\\b/g, 'yandaki')
            .replace(/yukarıda\\s+verilen/gi, 'yanda verilen')
            .replace(/yukarıdaki\\s+görsel/gi, 'yandaki görsel')
            .replace(/yukarıdaki\\s+model/gi, 'yandaki model')
            .replace(/yukarıdaki\\s+şekil/gi, 'yandaki şekil');`;
  js = js.replace(cleanQTarget, cleanQReplacement);
}

// 4. Update renderBatchTabs and switchBatch to include "Tümü / Bütünleşik" tab
const oldRenderBatchTabs = `  function renderBatchTabs(types) {
    if (!batchFileTabsBar || !batchTabsList) return;
    batchTabsList.innerHTML = '';

    types.forEach((item, idx) => {
      const b = generatedBatches[item.type];
      if (!b) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = \`batch-tab-btn \${idx === 0 ? 'is-active' : ''}\`;
      btn.innerHTML = \`<span>\${item.icon}</span> <span>\${item.label} (\${b.questions.length})</span>\`;
      btn.addEventListener('click', () => {
        switchBatch(item.type);
      });
      batchTabsList.appendChild(btn);
    });

    batchFileTabsBar.style.display = 'flex';
  }

  function switchBatch(typeKey) {
    const b = generatedBatches[typeKey];
    if (!b) return;
    activeBatchKey = typeKey;

    if (batchTabsList) {
      batchTabsList.querySelectorAll('.batch-tab-btn').forEach(btn => {
        const isActive = btn.textContent.includes(b.label);
        btn.classList.toggle('is-active', isActive);
      });
    }

    currentQuestions = b.questions;
    currentMeta = b.meta;
    currentSmartTitle = b.smartTitle;
    editingQuestionIndex = -1;
    renderQuestions();
  }`;

const newRenderBatchTabs = `  function renderBatchTabs(types) {
    if (!batchFileTabsBar || !batchTabsList) return;
    batchTabsList.innerHTML = '';

    // 1. Tümü / Bütünleşik Sekmesi
    let totalBatchCount = 0;
    types.forEach(item => {
      const b = generatedBatches[item.type];
      if (b) totalBatchCount += b.questions.length;
    });

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'batch-tab-btn is-active';
    allBtn.innerHTML = \`<span>📚</span> <span>Tümü (Bütünleşik - \${totalBatchCount})</span>\`;
    allBtn.addEventListener('click', () => {
      switchBatch('all');
    });
    batchTabsList.appendChild(allBtn);

    // 2. Münferit Kategori Sekmeleri
    types.forEach((item) => {
      const b = generatedBatches[item.type];
      if (!b) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'batch-tab-btn';
      btn.innerHTML = \`<span>\${item.icon}</span> <span>\${item.label} (\${b.questions.length})</span>\`;
      btn.addEventListener('click', () => {
        switchBatch(item.type);
      });
      batchTabsList.appendChild(btn);
    });

    batchFileTabsBar.style.display = 'flex';
  }

  function switchBatch(typeKey) {
    activeBatchKey = typeKey;

    if (batchTabsList) {
      batchTabsList.querySelectorAll('.batch-tab-btn').forEach(btn => {
        let isActive = false;
        if (typeKey === 'all') {
          isActive = btn.textContent.includes('Tümü');
        } else {
          const b = generatedBatches[typeKey];
          isActive = b ? btn.textContent.includes(b.label) : false;
        }
        btn.classList.toggle('is-active', isActive);
      });
    }

    if (typeKey === 'all') {
      let merged = [];
      Object.keys(generatedBatches).forEach(k => {
        merged = merged.concat(generatedBatches[k].questions);
      });
      currentQuestions = merged;
      currentSmartTitle = \`Bütünleşik Sınav (\${merged.length} Soru / İçerik)\`;
    } else {
      const b = generatedBatches[typeKey];
      if (!b) return;
      currentQuestions = b.questions;
      currentMeta = b.meta;
      currentSmartTitle = b.smartTitle;
    }
    editingQuestionIndex = -1;
    renderQuestions();
  }`;

if (js.includes(oldRenderBatchTabs)) {
  js = js.replace(oldRenderBatchTabs, newRenderBatchTabs);
}

// 5. Update confirmPublishBtn with "Tüm Kazanımlar" and hierarchy
const oldConfirmPublishPayload = `      const payload = {
        questions: currentQuestions,
        grade: pubGrade.value,
        unit: pubUnit.value,
        targetSection: pubSection.value,
        category: pubCategory.value,
        title: pubTitle.value.trim() || currentSmartTitle || \`\${pubGrade.value}. Sınıf Yaprak Testi\`,
        desc: pubDesc.value.trim(),
        subject: currentMeta.subject || "Fen Bilimleri",
        autoDeploy: pubAutoDeploy ? pubAutoDeploy.checked : false
      };`;

const newConfirmPublishPayload = `      const allOutcomesInScope = outcomesChecklist.querySelectorAll('input[type="checkbox"]');
      const checkedOutcomes = outcomesChecklist.querySelectorAll('input[type="checkbox"]:checked');
      const isAllOutcomes = (allOutcomesInScope.length > 0 && checkedOutcomes.length === allOutcomesInScope.length);
      const activeSubtopicPill = subtopicPills ? subtopicPills.querySelector('.pill-btn.active') : null;
      const subtopicName = isAllOutcomes ? "Tüm Kazanımlar" : (activeSubtopicPill ? activeSubtopicPill.textContent.trim() : "Genel");

      const payload = {
        questions: currentQuestions,
        grade: pubGrade.value,
        unit: pubUnit.value,
        targetSection: pubSection.value,
        category: pubCategory.value,
        title: pubTitle.value.trim() || currentSmartTitle || \`\${pubGrade.value}. Sınıf Yaprak Testi\`,
        desc: pubDesc.value.trim(),
        subject: currentMeta.subject || "Fen Bilimleri",
        autoDeploy: pubAutoDeploy ? pubAutoDeploy.checked : false,
        topic: pubUnit.value,
        subtopic: subtopicName,
        isAllOutcomes: isAllOutcomes,
        learning_outcome: checkedOutcomes.length === 1 ? checkedOutcomes[0].value : (isAllOutcomes ? "Tüm Kazanımlar" : "Kazanım Grubu"),
        question_type: currentMeta.question_type || "multiple_choice"
      };`;

if (js.includes(oldConfirmPublishPayload)) {
  js = js.replace(oldConfirmPublishPayload, newConfirmPublishPayload);
}

fs.writeFileSync('js/yaprak-test.js', js, 'utf8');
fs.writeFileSync('../js/yaprak-test.js', js, 'utf8');
console.log('Updated js/yaprak-test.js and ../js/yaprak-test.js');
