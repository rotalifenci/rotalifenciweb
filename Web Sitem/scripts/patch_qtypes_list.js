const fs = require('fs');

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const oldBlock = `    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'concept_map', label: 'Kavram Haritası', icon: '🗺️' }
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

  const newBlock = `    const qTypesList = [
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

  // Normalize CRLF
  const hasCRLF = code.includes('\r\n');
  const target = hasCRLF ? oldBlock.replace(/\n/g, '\r\n') : oldBlock;
  const rep = hasCRLF ? newBlock.replace(/\n/g, '\r\n') : newBlock;

  if (code.includes(target)) {
    code = code.replace(target, rep);
    console.log('Successfully updated qTypesList in:', filePath);
  } else {
    console.log('Target block not found in:', filePath);
  }

  // Also check fetch payload for activity_types
  if (!code.includes('activity_types: item.activity_types || [],')) {
    code = code.replace(
      'question_type: item.type,',
      'question_type: item.type,\n            activity_types: item.activity_types || [],'
    );
    console.log('Added activity_types to fetch call in:', filePath);
  }

  fs.writeFileSync(filePath, code, 'utf8');
});
