const fs = require('fs');

function updateYaprakJs(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const isCrlf = raw.includes('\r\n');
  let js = raw.replace(/\r\n/g, '\n');

  const oldFunctionPattern = /function renderBatchTabs\(types\) \{[\s\S]*?function switchBatch\(typeKey\) \{[\s\S]*?renderQuestions\(\);\s*\}/;

  const newFunctions = `function renderBatchTabs(types) {
    if (!batchFileTabsBar || !batchTabsList) return;
    batchTabsList.innerHTML = '';

    types.forEach((item, idx) => {
      const b = generatedBatches[item.type];
      if (!b) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = \`batch-tab-btn \${idx === 0 ? 'is-active' : ''}\`;
      btn.dataset.type = item.type;
      const unit = item.type === 'activity' ? 'Etkinlik' : 'Soru';
      btn.innerHTML = \`<span class="tab-icon">\${item.icon}</span> <strong class="tab-label">\${item.label}</strong> <span class="tab-count-badge" style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:4px; font-weight:800;">\${b.questions.length} \${unit}</span>\`;
      btn.addEventListener('click', () => {
        switchBatch(item.type);
      });
      batchTabsList.appendChild(btn);
    });

    // Bütünleşik (Tümü) sekmesi
    if (types.length > 1) {
      let totalAll = 0;
      types.forEach(t => {
        if (generatedBatches[t.type]) totalAll += generatedBatches[t.type].questions.length;
      });
      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = 'batch-tab-btn';
      allBtn.dataset.type = 'all';
      allBtn.innerHTML = \`<span class="tab-icon">📚</span> <strong class="tab-label">Tümü (Bütünleşik)</strong> <span class="tab-count-badge" style="background:#f1f5f9; color:#334155; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:4px; font-weight:800;">\${totalAll} Soru</span>\`;
      allBtn.addEventListener('click', () => {
        switchBatch('all');
      });
      batchTabsList.appendChild(allBtn);
    }

    batchFileTabsBar.style.display = 'flex';
  }

  function switchBatch(typeKey) {
    activeBatchKey = typeKey;

    if (batchTabsList) {
      batchTabsList.querySelectorAll('.batch-tab-btn').forEach(btn => {
        const isActive = btn.dataset.type === typeKey;
        btn.classList.toggle('is-active', isActive);
      });
    }

    if (typeKey === 'all') {
      let merged = [];
      Object.keys(generatedBatches).forEach(k => {
        merged = merged.concat(generatedBatches[k].questions);
      });
      currentQuestions = merged;
      currentSmartTitle = \`Bütünleşik Fen Bilimleri Sınavı (\${merged.length} Soru / İçerik)\`;
      const metaTitle = document.getElementById('testMetaTitle');
      if (metaTitle) metaTitle.textContent = currentSmartTitle;
      const countBadge = document.getElementById('questionCountBadge');
      if (countBadge) countBadge.textContent = \`\${merged.length} Soru\`;
    } else {
      const b = generatedBatches[typeKey];
      if (!b) return;
      currentQuestions = b.questions;
      currentMeta = b.meta;
      currentSmartTitle = b.smartTitle;
      const metaTitle = document.getElementById('testMetaTitle');
      if (metaTitle) metaTitle.textContent = b.smartTitle;
      const countBadge = document.getElementById('questionCountBadge');
      if (countBadge) countBadge.textContent = \`\${b.questions.length} \${b.type === 'activity' ? 'Etkinlik' : 'Soru'}\`;
    }

    editingQuestionIndex = -1;
    renderQuestions();
  }`;

  if (oldFunctionPattern.test(js)) {
    js = js.replace(oldFunctionPattern, newFunctions);
    if (isCrlf) js = js.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, js, 'utf8');
    console.log(`Updated renderBatchTabs in ${filePath}`);
  } else {
    console.log(`Pattern not matched in ${filePath}`);
  }
}

updateYaprakJs('js/yaprak-test.js');
updateYaprakJs('../js/yaprak-test.js');

// Also update cache busters in HTML
function updateHtmlCache(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  raw = raw.replace(/js\/yaprak-test\.js\?v=[^"']+/g, 'js/yaprak-test.js?v=20261101_v5');
  raw = raw.replace(/js\/question_preparation_state\.js\?v=[^"']+/g, 'js/question_preparation_state.js?v=20261101_v5');
  fs.writeFileSync(filePath, raw, 'utf8');
  console.log(`Updated cache busters in ${filePath}`);
}

updateHtmlCache('yaprak-test.html');
updateHtmlCache('../yaprak-test.html');
