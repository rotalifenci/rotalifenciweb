const fs = require('fs');

function patchYaprakJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Checkbox and Batch logic insertion right after DOM elements declaration
  if (!code.includes('qtTotalCountBadge')) {
    const insertAfter = "let cachedMaterials = [];";
    const batchSnippet = `let cachedMaterials = [];

  // ========================================================
  // 🎯 4 SORU TÜRÜ ÇOKLU SEÇİM VE BAĞIMSIZ SAYI YÖNETİMİ
  // ========================================================
  const qtTotalCountBadge = document.getElementById('qtTotalCountBadge');
  const batchFileTabsBar = document.getElementById('batchFileTabsBar');
  const batchTabsList = document.getElementById('batchTabsList');
  const batchPublishAllBtn = document.getElementById('batchPublishAllBtn');

  let generatedBatches = {}; // { [type]: { type, label, count, questions, meta, smartTitle } }
  let activeBatchKey = null;

  function updateQtTotalCount() {
    let total = 0;
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'concept_map'];
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
  }

  ['multiple_choice', 'short_answer', 'open_ended', 'concept_map'].forEach(t => {
    const cb = document.getElementById(\`qt_cb_\${t}\`);
    const countInputEl = document.getElementById(\`qt_count_\${t}\`);
    if (cb) {
      cb.addEventListener('change', updateQtTotalCount);
    }
    if (countInputEl) {
      countInputEl.addEventListener('input', updateQtTotalCount);
    }
  });
  setTimeout(updateQtTotalCount, 50);
`;
    code = code.replace(insertAfter, batchSnippet);
  }

  // 2. Immediate loadCurriculum call right after functions definition
  // Ensure loadCurriculum runs immediately
  if (!code.includes('// Anında Müfredatı Başlat\n  loadCurriculum();')) {
    const target = "async function loadCurriculum(grade = \"5\") {";
    const immediateCall = `// Anında Müfredatı Başlat
  setTimeout(() => {
    try { loadCurriculum(gradeInput ? gradeInput.value : '5'); } catch(e){}
  }, 10);

  async function loadCurriculum(grade = \"5\") {`;
    code = code.replace(target, immediateCall);
  }

  // 3. Batch Question Generation handler inside questionForm submit
  const formSubmitStart = code.indexOf("questionForm.addEventListener('submit', async (e) => {");
  const formSubmitEnd = code.indexOf("renderQuestions();", formSubmitStart);

  if (formSubmitStart !== -1 && formSubmitEnd !== -1) {
    const oldSubmitBlock = code.substring(formSubmitStart, formSubmitEnd + "renderQuestions();".length);
    const newSubmitBlock = `questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkedBoxes = outcomesChecklist.querySelectorAll('input[type=\"checkbox\"]:checked');
    const selectedOutcomes = Array.from(checkedBoxes).map(cb => cb.value);
    const customText = customOutcome.value.trim();

    if (customText) {
      selectedOutcomes.push(customText);
    }

    if (selectedOutcomes.length === 0 && uploadedSourceFiles.length === 0) {
      alert('Lütfen listeden en az bir öğrenme çıktısı (kazanım) seçiniz, özel kazanım giriniz veya bir kaynak dosya (.docx, .pdf, .png, .jpg) yükleyiniz.');
      return;
    }

    if (selectedOutcomes.length === 0 && uploadedSourceFiles.length > 0) {
      selectedOutcomes.push(\`Yüklenen kaynak dosyadaki (\${uploadedSourceFiles.map(f => f.name).join(', ')}) konu ve kazanımlar\`);
    }

    // Seçili Soru Türlerini Topla
    const selectedTypes = [];
    const qTypesList = [
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
    });

    if (selectedTypes.length === 0) {
      alert('Lütfen en az bir soru türü seçiniz (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu veya Kavram Haritası).');
      return;
    }

    const grade = gradeInput.value;
    const subject = subjectInput.value.trim();
    const difficulty = difficultyInput.value;
    const unitName = curriculumData && curriculumData.units[selectedUnitIndex] ? curriculumData.units[selectedUnitIndex].name : "Genel";
    const outputMode = document.querySelector('input[name=\"qtOutputMode\"]:checked')?.value || 'separate';

    setLoading(true);

    try {
      const combinedSourceText = uploadedSourceFiles
        .map(f => f.extractedText ? \`[Dosya: \${f.name}]\\n\${f.extractedText}\` : '')
        .filter(Boolean)
        .join('\\n\\n');

      generatedBatches = {};
      let allMergedQuestions = [];

      // Her seçili soru türü için döngüyle üretim yap
      for (let i = 0; i < selectedTypes.length; i++) {
        const item = selectedTypes[i];
        if (loadingState) {
          const loadingText = loadingState.querySelector('p');
          if (loadingText) {
            loadingText.innerHTML = \`✨ <strong>\${item.icon} \${item.label}</strong> soruları üretiliyor (\${item.count} Soru)... [\${i + 1} / \${selectedTypes.length}]\`;
          }
        }

        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: localStorage.getItem('gemini_api_key') || '',
            grade,
            subject,
            learning_area: unitName,
            selected_outcomes: selectedOutcomes,
            question_count: item.count,
            difficulty,
            question_type: item.type,
            source_text: combinedSourceText,
            source_files: uploadedSourceFiles.map(f => ({
              name: f.name,
              mimeType: f.mimeType,
              base64Data: f.base64Data,
              extractedText: f.extractedText
            }))
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || data.details || \`\${item.label} soruları oluşturulamadı.\`);
        }

        const cleanedQuestions = (data.questions || []).map(q => {
          const cq = { ...q };
          cq.type = q.type || item.type;
          cq.question = cleanTurkishAndLatex(cq.question);
          if (cq.options) {
            cq.options = { ...cq.options };
            ['A', 'B', 'C', 'D'].forEach(opt => {
              if (cq.options[opt]) cq.options[opt] = cleanTurkishAndLatex(cq.options[opt]);
            });
          }
          if (cq.correct_answer) cq.correct_answer = cleanTurkishAndLatex(cq.correct_answer);
          if (cq.explanation) cq.explanation = cleanTurkishAndLatex(cq.explanation);
          return cq;
        });

        const batchSmartTitle = \`Test No: \${testSequenceCounter + 1} - \${item.label}\`;

        generatedBatches[item.type] = {
          type: item.type,
          label: item.label,
          icon: item.icon,
          count: cleanedQuestions.length,
          questions: cleanedQuestions,
          meta: data.meta || { grade, subject, learning_area: unitName, selected_outcomes: selectedOutcomes, question_type: item.type },
          smartTitle: batchSmartTitle
        };

        allMergedQuestions = allMergedQuestions.concat(cleanedQuestions);
      }

      testSequenceCounter++;
      sessionStorage.setItem('rotali_test_seq_counter', String(testSequenceCounter));

      if (outputMode === 'separate' && selectedTypes.length > 1) {
        // Ayrı Dosyalar Modu: Sekmeleri göster
        renderBatchTabs(selectedTypes);
        const firstType = selectedTypes[0].type;
        switchBatch(firstType);
      } else if (outputMode === 'separate' && selectedTypes.length === 1) {
        if (batchFileTabsBar) batchFileTabsBar.style.display = 'none';
        const singleType = selectedTypes[0].type;
        const b = generatedBatches[singleType];
        currentQuestions = b.questions;
        currentMeta = b.meta;
        currentSmartTitle = b.smartTitle;
        editingQuestionIndex = -1;
        renderQuestions();
      } else {
        // Birleştirilmiş Mod: Bütün soruları tek listede numaralandır
        if (batchFileTabsBar) batchFileTabsBar.style.display = 'none';
        currentQuestions = allMergedQuestions;
        currentMeta = { grade, subject, learning_area: unitName, selected_outcomes: selectedOutcomes, question_type: 'mixed' };
        currentSmartTitle = \`Test No: \${testSequenceCounter} - Bütünleşik Sınav (\${allMergedQuestions.length} Soru)\`;
        editingQuestionIndex = -1;
        renderQuestions();
      }`;

    code = code.substring(0, formSubmitStart) + newSubmitBlock + code.substring(formSubmitEnd + "renderQuestions();".length);
  }

  // 4. Batch Tabs & Switcher Functions
  if (!code.includes('function renderBatchTabs(')) {
    const helperBlock = `
  // ========================================================
  // 📁 ÇOKLU DOSYA SEKME VE GEÇİŞ MOTORU
  // ========================================================
  function renderBatchTabs(types) {
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
  }

  // Toplu Olarak Tüm Dosyaları Web Sitesine Aktar
  if (batchPublishAllBtn) {
    batchPublishAllBtn.addEventListener('click', async () => {
      const batchKeys = Object.keys(generatedBatches);
      if (batchKeys.length === 0) {
        alert('Yayınlanacak soru grubu bulunamadı.');
        return;
      }

      if (!confirm(\`Üretilen \${batchKeys.length} farklı soru grubunun her biri ayrı bir yaprak test dosyası olarak web sitenize otomatik aktarılacaktır.\\n\\nDevam etmek istiyor musunuz?\`)) {
        return;
      }

      batchPublishAllBtn.disabled = true;
      batchPublishAllBtn.innerHTML = '<span>⏳</span> <span>Yayınlanıyor...</span>';

      const curGrade = currentMeta.grade || gradeInput.value || '5';
      const curUnitObj = (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex]) ? curriculumData.units[selectedUnitIndex] : null;
      const curUnitName = currentMeta.learning_area || (curUnitObj ? curUnitObj.name : 'Genel');
      const curSectionNum = (selectedUnitIndex + 1) || 1;

      let successCount = 0;
      for (const k of batchKeys) {
        const b = generatedBatches[k];
        const payload = {
          questions: b.questions,
          grade: curGrade,
          unit: curUnitName,
          targetSection: curSectionNum,
          category: b.type === 'open_ended' ? 'denemeler' : 'soru-bankasi',
          title: b.smartTitle,
          desc: \`\${curGrade}. Sınıf \${curUnitName} - \${b.label} Yaprak Testi (\${b.questions.length} Soru).\`,
          subject: currentMeta.subject || 'Fen Bilimleri',
          autoDeploy: true
        };

        try {
          const res = await fetch('/api/publish-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) successCount++;
        } catch (e) {
          console.error('Yayınlama hatası:', e);
        }
      }

      batchPublishAllBtn.disabled = false;
      batchPublishAllBtn.innerHTML = '<span>🚀</span> <span>Tüm Dosyaları Web Siteme Aktar</span>';

      if (successCount > 0) {
        alert(\`🎉 TEBRİKLER!\\n\\nToplam \${successCount} adet test dosyası başarıyla oluşturuldu, web sitesine eklendi ve GitHub ile senkronize edildi!\`);
        if (typeof loadYaprakMaterials === 'function') loadYaprakMaterials();
      } else {
        alert('Yayınlama sırasında bir hata oluştu.');
      }
    });
  }
`;
    // Insert before closing of DOMContentLoaded
    const lastClosing = code.lastIndexOf("});");
    code = code.substring(0, lastClosing) + helperBlock + "\n});\n";
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully patched JS:', filePath);
}

patchYaprakJs('js/yaprak-test.js');
patchYaprakJs('../js/yaprak-test.js');
patchYaprakJs('../Yaprak Test/public/js/yaprak-test.js');
