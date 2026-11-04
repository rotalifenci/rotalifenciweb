const fs = require('fs');

// 1. UPDATE yaprak-test.html and ../yaprak-test.html
['yaprak-test.html', '../yaprak-test.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(
    '<h1>Rotalı Fenci - Yaprak Test & Test / Deneme</h1>',
    '<h1>Rotalı Fenci Soru Hazırlama</h1>'
  );

  html = html.replace(
    '<title>Yaprak Test & Soru Üretim Portalı (Gemini AI)</title>',
    '<title>Rotalı Fenci Soru Hazırlama</title>'
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated title in:', filePath);
});

// 2. UPDATE js/app.js and ../js/app.js
['js/app.js', '../js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  code = code.replace(
    '<span class="hidden md:inline">Yaprak Test</span>',
    '<span class="hidden md:inline">Soru Hazırlama</span>'
  );

  code = code.replace(
    'title="📝 Yaprak Test & Soru Bankası Portalı (Yönetici)"',
    'title="📝 Rotalı Fenci Soru Hazırlama Portalı (Yönetici)"'
  );

  code = code.replace(
    '<span>📝 YAPRAK TEST & SORU BANKASI</span>',
    '<span>📝 ROTALI FENCİ SORU HAZIRLAMA</span>'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated admin links in:', filePath);
});

// 3. UPDATE js/yaprak-test.js and ../js/yaprak-test.js
const newLogic = `    // 13 Alt Etkinlik Türü
  const activitySubtypes = [
    'matching', 'ordering', 'table_completion', 'image_analysis',
    'diagram_labeling', 'visual_tagging', 'classification', 'experiment_analysis',
    'chart_interpretation', 'scientific_process', 'daily_life_problem',
    'cut_paste_coloring', 'stem_design'
  ];

  function syncActivitySubtypesUI() {
    const actCb = document.getElementById('qt_cb_activity');
    const panel = document.getElementById('qtActivitySubtypesPanel');
    const actCountInput = document.getElementById('qt_count_activity');
    const isActChecked = Boolean(actCb && actCb.checked);

    if (panel) {
      panel.style.display = isActChecked ? 'block' : 'none';
    }

    if (!isActChecked) {
      if (actCountInput) actCountInput.disabled = true;
      return;
    }

    if (actCountInput) actCountInput.disabled = false;

    let subTotal = 0;
    let checkedCount = 0;
    activitySubtypes.forEach(key => {
      const cb = document.getElementById(\`act_cb_\${key}\`);
      const countInput = document.getElementById(\`act_count_\${key}\`);
      const card = cb ? cb.closest('.qt-act-card') : null;
      if (cb && countInput) {
        if (cb.checked) {
          checkedCount++;
          countInput.disabled = false;
          if (card) card.classList.add('is-selected');
          subTotal += parseInt(countInput.value, 10) || 1;
        } else {
          countInput.disabled = true;
          if (card) card.classList.remove('is-selected');
        }
      }
    });

    // İlk kez tıklandıysa ve hiçbiri seçili değilse varsayılan 3 türü seç
    if (checkedCount === 0 && isActChecked) {
      ['matching', 'ordering', 'table_completion'].forEach(k => {
        const c = document.getElementById(\`act_cb_\${k}\`);
        const inp = document.getElementById(\`act_count_\${k}\`);
        const card = c ? c.closest('.qt-act-card') : null;
        if (c) {
          c.checked = true;
          if (inp) {
            inp.disabled = false;
            subTotal += parseInt(inp.value, 10) || 2;
          }
          if (card) card.classList.add('is-selected');
        }
      });
    }

    const badge = document.getElementById('qtActSubTotalBadge');
    if (badge) badge.textContent = \`\${subTotal} Etkinlik\`;

    if (actCountInput && subTotal > 0) {
      actCountInput.value = String(subTotal);
    }
  }

  function updateQtTotalCount() {
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];
    let total = 0;

    types.forEach(t => {
      const cb = document.getElementById(\`qt_cb_\${t}\`);
      const countInputEl = document.getElementById(\`qt_count_\${t}\`);
      const row = document.getElementById(\`qt_row_\${t}\`);
      if (cb && countInputEl) {
        if (cb.checked) {
          countInputEl.disabled = false;
          if (row) row.classList.add('is-active');
          const val = parseInt(countInputEl.value, 10) || 0;
          total += val;
        } else {
          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');
        }
      }
    });

    syncActivitySubtypesUI();

    if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = \`📊 Toplam: \${total} İçerik\`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(total || 10);
  }

  function initQuestionTypesAndActivities() {
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];

    types.forEach(t => {
      const cb = document.getElementById(\`qt_cb_\${t}\`);
      const countInputEl = document.getElementById(\`qt_count_\${t}\`);
      const row = document.getElementById(\`qt_row_\${t}\`);

      if (cb) {
        cb.addEventListener('change', () => {
          updateQtTotalCount();
        });
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      if (countInputEl) {
        countInputEl.addEventListener('input', () => {
          updateQtTotalCount();
        });
        countInputEl.addEventListener('change', () => {
          updateQtTotalCount();
        });
        countInputEl.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      if (row && cb) {
        row.addEventListener('click', (e) => {
          // Label, input veya buton tıklamalarında doğal davranışı bozma
          if (e.target.closest('label') || e.target.closest('.qt-count-box') || e.target === cb) {
            return;
          }
          cb.checked = !cb.checked;
          updateQtTotalCount();
        });
      }
    });

    // Wire activity quick buttons
    const actSelectAllBtn = document.getElementById('qtActSelectAllBtn');
    if (actSelectAllBtn) {
      actSelectAllBtn.onclick = (e) => {
        e.preventDefault();
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          if (cb) cb.checked = true;
        });
        updateQtTotalCount();
      };
    }

    const actClearBtn = document.getElementById('qtActClearBtn');
    if (actClearBtn) {
      actClearBtn.onclick = (e) => {
        e.preventDefault();
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          if (cb) cb.checked = false;
        });
        updateQtTotalCount();
      };
    }

    const actDistBtn = document.getElementById('qtActDefaultDistBtn');
    if (actDistBtn) {
      actDistBtn.onclick = (e) => {
        e.preventDefault();
        const top5 = ['matching', 'ordering', 'table_completion', 'classification', 'experiment_analysis'];
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          const inp = document.getElementById(\`act_count_\${k}\`);
          if (cb) {
            cb.checked = top5.includes(k);
            if (inp) inp.value = top5.includes(k) ? '2' : '1';
          }
        });
        updateQtTotalCount();
      };
    }

    // Wire activity subtype inputs and cards
    activitySubtypes.forEach(k => {
      const cb = document.getElementById(\`act_cb_\${k}\`);
      const inp = document.getElementById(\`act_count_\${k}\`);
      const card = cb ? cb.closest('.qt-act-card') : null;

      if (cb) {
        cb.addEventListener('change', () => {
          updateQtTotalCount();
        });
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      if (inp) {
        inp.addEventListener('input', () => {
          updateQtTotalCount();
        });
        inp.addEventListener('change', () => {
          updateQtTotalCount();
        });
        inp.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      if (card && cb) {
        card.addEventListener('click', (e) => {
          if (e.target.closest('label') || e.target.closest('.qt-act-count-box') || e.target === cb) {
            return;
          }
          cb.checked = !cb.checked;
          updateQtTotalCount();
        });
      }
    });

    updateQtTotalCount();
  }

  // Hem anında hem DOM hazır olduğunda çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuestionTypesAndActivities);
  } else {
    initQuestionTypesAndActivities();
  }`;

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const oldRegex = /\/\/\s*13 Alt Etkinlik Türü[\s\S]*?document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);\s*\n\s*\n/m;

  if (oldRegex.test(code)) {
    code = code.replace(oldRegex, newLogic + '\n\n');
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully replaced logic in:', filePath);
  } else {
    console.log('Regex did not match in:', filePath);
  }
});
