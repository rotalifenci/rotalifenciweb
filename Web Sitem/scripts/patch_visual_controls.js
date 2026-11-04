const fs = require('fs');

function patchYaprakJsVisualControls(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. window.harmonizeQuestionVisual ve window.removeQuestionVisual tanımla
  if (!content.includes('window.harmonizeQuestionVisual')) {
    const helperFunctions = `
  // ==========================================================================
  // AKILLI SORU–GÖRSEL EŞLEŞTİRME VE DÜZENLEME KONTROLLERİ (ÖĞRETMEN ARAÇLARI)
  // ==========================================================================
  window.harmonizeQuestionVisual = (idx) => {
    if (idx < 0 || idx >= currentQuestions.length) return;
    const q = currentQuestions[idx];
    if (window.visualMatchEngine) {
      const brief = window.visualMatchEngine.generateVisualBrief(q.question, q.options || {}, q.correct_answer || '');
      q.visual_svg = brief.renderedHtml;
      renderQuestions();
      alert('✨ Görsel, soru metnindeki konu, kavram ve pedagojik işaretlere göre başarıyla uyarlandı:\\n\\n' + brief.coreConcept + ' (' + brief.assetAlt + ')');
    } else {
      alert('Görsel eşleştirme motoru hazır değil.');
    }
  };

  window.removeQuestionVisual = (idx) => {
    if (idx < 0 || idx >= currentQuestions.length) return;
    if (confirm('Bu soruya ait görseli kaldırmak istediğinizden emin misiniz?')) {
      currentQuestions[idx].visual_svg = '';
      renderQuestions();
    }
  };
`;
    content = content.replace('window.cancelEditQuestion = () => {', helperFunctions + '\n  window.cancelEditQuestion = () => {');
  }

  // 2. buildCard içindeki düzenleme arayüzünü zenginleştir
  const oldEditField = `<div class="edit-field-group">
              <label><strong>Görsel / Çizim SVG Kodu:</strong></label>
              <textarea class="edit-textarea edit-visual-svg" rows="2">\${escapeHtml(q.visual_svg || '')}</textarea>
            </div>`;

  const newEditField = `<div class="edit-field-group" style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label style="margin:0;"><strong>🖼️ Soru Görseli ve Uyumluluk Kontrolü:</strong></label>
                <div style="display:flex; gap:6px;">
                  <button type="button" class="btn btn-sm btn-outline-primary" style="font-size:11px; padding:3px 8px;" onclick="window.harmonizeQuestionVisual(\${qNum - 1})" title="Görseli Soru Metnine Göre Otomatik Uyarla">🔄 Metne Uyumla</button>
                  <button type="button" class="btn btn-sm btn-outline-danger" style="font-size:11px; padding:3px 8px;" onclick="window.removeQuestionVisual(\${qNum - 1})" title="Görseli Kaldır">🗑️ Görseli Kaldır</button>
                </div>
              </div>
              <div style="max-height:120px; overflow:hidden; border-radius:6px; margin-bottom:6px; background:#ffffff; border:1px dashed #cbd5e1; display:flex; align-items:center; justify-content:center;">
                \${q.visual_svg ? q.visual_svg : '<span style=\"color:#94a3b8; font-size:12px; padding:10px;\">Bu soru için görsel atanmamış</span>'}
              </div>
              <textarea class="edit-textarea edit-visual-svg" rows="2" placeholder="Görsel HTML/SVG Kodu">\${escapeHtml(q.visual_svg || '')}</textarea>
            </div>`;

  if (content.includes(oldEditField)) {
    content = content.replace(oldEditField, newEditField);
  }

  // 3. saveEditQuestion içinde otomatik görsel uyumluluk denetimi ekle
  const oldSaveCheck = `    const updated = {
      ...currentQuestions[idx],
      visual_svg: visualSvg,
      question: questionText,
      correct_answer: correctAnswer,
      difficulty: difficulty
    };`;

  const newSaveCheck = `    let finalVisualSvg = visualSvg;
    if (window.visualMatchEngine && questionText !== currentQuestions[idx].question) {
      const check = window.visualMatchEngine.checkVisualCompatibility(questionText, visualSvg, correctAnswer);
      if (!check.isCompatible) {
        if (confirm('⚠️ Soru-Görsel Uyarı:\\n\\n' + check.reason + '\\n\\nGörseli yeni soru içeriğine göre otomatik güncellemek ister misiniz?')) {
          finalVisualSvg = check.recommendedVisual;
        }
      }
    }

    const updated = {
      ...currentQuestions[idx],
      visual_svg: finalVisualSvg,
      question: questionText,
      correct_answer: correctAnswer,
      difficulty: difficulty
    };`;

  if (content.includes(oldSaveCheck)) {
    content = content.replace(oldSaveCheck, newSaveCheck);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated visual controls in:', filePath);
}

patchYaprakJsVisualControls('js/yaprak-test.js');
patchYaprakJsVisualControls('../js/yaprak-test.js');
