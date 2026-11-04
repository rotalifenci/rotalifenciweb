const fs = require('fs');

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Replace types list at top
  code = code.replace(
    "const types = ['multiple_choice', 'short_answer', 'open_ended', 'concept_map'];",
    "const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];"
  );
  code = code.replace(
    "['multiple_choice', 'short_answer', 'open_ended', 'concept_map'].forEach(t => {",
    "['multiple_choice', 'short_answer', 'open_ended', 'activity'].forEach(t => {"
  );

  // 2. Add activity subtypes panel toggle in updateQtTotalCount and listeners
  const oldUpdateFn = `  function updateQtTotalCount() {
    let total = 0;
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];
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
      qtTotalCountBadge.textContent = \`📊 Toplam: \${total} Soru\`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(total || 10);
  }`;

  const newUpdateFn = `  const activitySubtypes = [
    'matching', 'ordering', 'table_completion', 'image_analysis',
    'diagram_labeling', 'visual_tagging', 'classification', 'experiment_analysis',
    'chart_interpretation', 'scientific_process', 'daily_life_problem',
    'cut_paste_coloring', 'stem_design'
  ];

  function syncActivitySubtypesUI() {
    const actCb = document.getElementById('qt_cb_activity');
    const panel = document.getElementById('qtActivitySubtypesPanel');
    const actCountInput = document.getElementById('qt_count_activity');
    const isActChecked = actCb && actCb.checked;

    if (panel) {
      panel.style.display = isActChecked ? 'block' : 'none';
    }

    if (!isActChecked) {
      if (actCountInput) actCountInput.disabled = true;
      return;
    }

    if (actCountInput) actCountInput.disabled = false;

    let subTotal = 0;
    let anyChecked = false;
    activitySubtypes.forEach(key => {
      const cb = document.getElementById(\`act_cb_\${key}\`);
      const countInput = document.getElementById(\`act_count_\${key}\`);
      const card = cb ? cb.closest('.qt-act-card') : null;
      if (cb && countInput) {
        if (cb.checked) {
          anyChecked = true;
          countInput.disabled = false;
          if (card) card.classList.add('is-selected');
          subTotal += parseInt(countInput.value, 10) || 1;
        } else {
          countInput.disabled = true;
          if (card) card.classList.remove('is-selected');
        }
      }
    });

    if (!anyChecked && isActChecked) {
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
    syncActivitySubtypesUI();

    let total = 0;
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];
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

  if (code.includes(oldUpdateFn)) {
    code = code.replace(oldUpdateFn, newUpdateFn);
    console.log('Replaced updateQtTotalCount in:', filePath);
  }

  // 3. Add listener wiring for activity quick buttons and subtype checkboxes
  const actWiringSnippet = `
  // Wire activity quick buttons and subtype inputs
  document.addEventListener('DOMContentLoaded', () => {
    const actSelectAllBtn = document.getElementById('qtActSelectAllBtn');
    if (actSelectAllBtn) {
      actSelectAllBtn.addEventListener('click', () => {
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          if (cb) cb.checked = true;
        });
        syncActivitySubtypesUI();
        updateQtTotalCount();
      });
    }

    const actClearBtn = document.getElementById('qtActClearBtn');
    if (actClearBtn) {
      actClearBtn.addEventListener('click', () => {
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          if (cb) cb.checked = false;
        });
        syncActivitySubtypesUI();
        updateQtTotalCount();
      });
    }

    const actDistBtn = document.getElementById('qtActDefaultDistBtn');
    if (actDistBtn) {
      actDistBtn.addEventListener('click', () => {
        const top5 = ['matching', 'ordering', 'table_completion', 'classification', 'experiment_analysis'];
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(\`act_cb_\${k}\`);
          const inp = document.getElementById(\`act_count_\${k}\`);
          if (cb) {
            cb.checked = top5.includes(k);
            if (inp) inp.value = top5.includes(k) ? '2' : '1';
          }
        });
        syncActivitySubtypesUI();
        updateQtTotalCount();
      });
    }

    activitySubtypes.forEach(k => {
      const cb = document.getElementById(\`act_cb_\${k}\`);
      const inp = document.getElementById(\`act_count_\${k}\`);
      if (cb) {
        cb.addEventListener('change', () => {
          syncActivitySubtypesUI();
          updateQtTotalCount();
        });
      }
      if (inp) {
        inp.addEventListener('input', () => {
          syncActivitySubtypesUI();
          updateQtTotalCount();
        });
      }
    });

    const mainActCb = document.getElementById('qt_cb_activity');
    if (mainActCb) {
      mainActCb.addEventListener('change', () => {
        syncActivitySubtypesUI();
        updateQtTotalCount();
      });
    }
  });
`;

  if (!code.includes('qtActSelectAllBtn')) {
    code = code.replace(
      "setTimeout(updateQtTotalCount, 50);",
      "setTimeout(updateQtTotalCount, 50);\n" + actWiringSnippet
    );
    console.log('Added activity wiring snippet to:', filePath);
  }

  // 4. Update qTypesList in batch generation
  const oldQTypesList = `    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'concept_map', label: 'Kavram Haritası', icon: '🗺️' }
    ];`;

  const newQTypesList = `    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'activity', label: 'Etkinlik', icon: '🎯' }
    ];`;

  if (code.includes(oldQTypesList)) {
    code = code.replace(oldQTypesList, newQTypesList);
    console.log('Replaced qTypesList in:', filePath);
  }

  // 5. Update collection of selectedTypes to collect activity_types
  const oldGather = `    qTypesList.forEach(item => {
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

  const newGather = `    qTypesList.forEach(item => {
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

  if (code.includes(oldGather)) {
    code = code.replace(oldGather, newGather);
    console.log('Replaced selectedTypes gathering in:', filePath);
  }

  // 6. Pass activity_types to fetch
  code = code.replace(
    "question_type: item.type,",
    "question_type: item.type,\n            activity_types: item.activity_types || [],"
  );

  // 7. Fix alert message
  code = code.replace(
    "alert('Lütfen en az bir soru türü seçiniz (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu veya Kavram Haritası).');",
    "alert('Lütfen en az bir soru türü seçiniz (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu veya Etkinlik).');"
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully saved:', filePath);
});
