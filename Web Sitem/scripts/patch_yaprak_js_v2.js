const fs = require('fs');

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace updateQtTotalCount and activity subtypes handling
  const activityLogic = `  // 13 Alt Etkinlik Türü
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

    syncActivitySubtypesUI();

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

    if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = \`📊 Toplam: \${total} İçerik\`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(total || 10);
  }`;

  // Replace from "function updateQtTotalCount()" to "setTimeout(updateQtTotalCount, 50);"
  const updateRegex = /function updateQtTotalCount\(\)[\s\S]*?setTimeout\(updateQtTotalCount,\s*50\);/;
  if (updateRegex.test(code)) {
    code = code.replace(updateRegex, activityLogic + '\n\n  setTimeout(updateQtTotalCount, 50);');
    console.log('Replaced updateQtTotalCount in:', filePath);
  }

  // Ensure click listener on qt_row_activity toggles checkbox if clicked outside input
  const rowClickSnippet = `
  // Satıra tıklandığında da checkbox'ı tetikle
  ['multiple_choice', 'short_answer', 'open_ended', 'activity'].forEach(t => {
    const row = document.getElementById(\`qt_row_\${t}\`);
    const cb = document.getElementById(\`qt_cb_\${t}\`);
    const countInput = document.getElementById(\`qt_count_\${t}\`);
    if (row && cb) {
      row.addEventListener('click', (e) => {
        if (e.target === countInput || countInput && countInput.contains(e.target)) return;
        if (e.target === cb) return; // checkbox kendi eventini üretir
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      });
    }
  });
`;

  if (!code.includes('Satıra tıklandığında da checkbox')) {
    code = code.replace(
      'setTimeout(updateQtTotalCount, 50);',
      'setTimeout(updateQtTotalCount, 50);\n' + rowClickSnippet
    );
    console.log('Added rowClickSnippet to:', filePath);
  }

  // Update selectedTypes in generate button handler
  const batchSubmitTarget = `    // Seçili Soru Türlerini Topla
    const selectedTypes = [];
    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'activity', label: 'Etkinlik', icon: '🎯' }
    ];

    qTypesList.forEach(item => {
      const cb = document.getElementById(\`qt_cb_\${item.key}\`);
      const countInputEl = document.getElementById(\`qt_count_\${item.key}\`);
      if (cb && cb.checked) {
        selectedTypes.push({
          type: item.key,
          label: item.label,
          icon: item.icon,
          count: parseInt(countInputEl ? countInputEl.value : '5', 10) || 5
        });
      }
    });`;

  const batchSubmitReplacement = `    // Seçili Soru ve Etkinlik Türlerini Topla
    const selectedTypes = [];
    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'activity', label: 'Etkinlik', icon: '🎯' }
    ];

    qTypesList.forEach(item => {
      const cb = document.getElementById(\`qt_cb_\${item.key}\`);
      const countInputEl = document.getElementById(\`qt_count_\${item.key}\`);
      if (cb && cb.checked) {
        let actSubTypes = [];
        if (item.key === 'activity') {
          activitySubtypes.forEach(k => {
            const acb = document.getElementById(\`act_cb_\${k}\`);
            const ainp = document.getElementById(\`act_count_\${k}\`);
            if (acb && acb.checked) {
              actSubTypes.push({
                type: k,
                title: acb.dataset.title || k,
                count: parseInt(ainp ? ainp.value : '1', 10) || 1
              });
            }
          });
          if (actSubTypes.length === 0) {
            actSubTypes = [
              { type: 'matching', title: 'Eşleştirme', count: 2 },
              { type: 'ordering', title: 'Sıralama', count: 1 },
              { type: 'table_completion', title: 'Tablo Tamamlama', count: 2 }
            ];
          }
        }

        selectedTypes.push({
          type: item.key,
          label: item.label,
          icon: item.icon,
          count: parseInt(countInputEl ? countInputEl.value : '5', 10) || 5,
          activity_types: actSubTypes
        });
      }
    });`;

  if (code.includes(batchSubmitTarget)) {
    code = code.replace(batchSubmitTarget, batchSubmitReplacement);
    console.log('Replaced batchSubmitTarget in:', filePath);
  }

  // Ensure generate fetch sends activity_types
  if (!code.includes('activity_types: item.activity_types || [],')) {
    code = code.replace(
      'question_type: item.type,',
      'question_type: item.type,\n            activity_types: item.activity_types || [],'
    );
    console.log('Added activity_types to fetch in:', filePath);
  }

  fs.writeFileSync(filePath, code, 'utf8');
});
