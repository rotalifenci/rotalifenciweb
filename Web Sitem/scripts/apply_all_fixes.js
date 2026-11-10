const fs = require('fs');
const path = require('path');

function updateFile(filePath, updater) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const isCrlf = raw.includes('\r\n');
  const normalized = raw.replace(/\r\n/g, '\n');
  const updated = updater(normalized);
  if (updated !== normalized) {
    const finalContent = isCrlf ? updated.replace(/\n/g, '\r\n') : updated;
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[NO CHANGE] ${filePath}`);
  }
}

// --------------------------------------------------------------------------
// 1. UPDATE zkitap_engine.js
// --------------------------------------------------------------------------
function updateZKitap(code) {
  // Ensure cleanSpatialReferences is defined
  if (!code.includes('function cleanSpatialReferences(')) {
    code = code.replace(
      'function formatQuestionStem(rawText) {',
      `function cleanSpatialReferences(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/yukarıda\\s+verilen/gi, 'yanda verilen')
    .replace(/yukarıdaki\\s+görsel/gi, 'yandaki görsel')
    .replace(/yukarıdaki\\s+model/gi, 'yandaki model')
    .replace(/yukarıdaki\\s+şekil/gi, 'yandaki şekil')
    .replace(/yukarıdaki\\s+tablo/gi, 'yandaki tablo')
    .replace(/yukarıdaki\\s+grafik/gi, 'yandaki grafik')
    .replace(/yukarıdaki\\s+deney/gi, 'yandaki deney')
    .replace(/yukarıdaki\\s+düzenek/gi, 'yandaki düzenek')
    .replace(/yukarıdaki\\s+açıklama/gi, 'yandaki açıklama')
    .replace(/Yukarıdakilerden/g, 'Yandakilerden')
    .replace(/yukarıdakilerden/g, 'yandakilerden')
    .replace(/Yukarıdakiler/g, 'Yandakiler')
    .replace(/yukarıdakiler/g, 'yandakiler')
    .replace(/Yukarıdaki/g, 'Yandaki')
    .replace(/yukarıdaki/g, 'yandaki')
    .replace(/Yukardaki/g, 'Yandaki')
    .replace(/yukardaki/g, 'yandaki')
    .replace(/Yukarıdan/g, 'Yandan')
    .replace(/yukarıdan/g, 'yandan')
    .replace(/Yukarıda/g, 'Yanda')
    .replace(/yukarıda/g, 'yanda')
    .replace(/Yukarda/g, 'Yanda')
    .replace(/yukarda/g, 'yanda');
}

function formatQuestionStem(rawText) {`
    );
  }

  // Use cleanSpatialReferences in formatQuestionStem
  code = code.replace(
    'function formatQuestionStem(rawText) {\n  let text = String(rawText || \'\').trim();',
    'function formatQuestionStem(rawText) {\n  let text = cleanSpatialReferences(String(rawText || \'\').trim());'
  );

  // Update layout proportions: Visual 62%, Content 35%
  code = code.replace(
    '.rf-slide-visual-col {\n      flex: 0 0 58%;\n      max-width: 60%;',
    '.rf-slide-visual-col {\n      flex: 0 0 62%;\n      max-width: 63%;'
  );
  code = code.replace(
    '.rf-slide-content-col {\n      flex: 0 0 38%;\n      max-width: 40%;',
    '.rf-slide-content-col {\n      flex: 0 0 35%;\n      max-width: 36%;'
  );

  return code;
}

['api/zkitap_engine.js', 'scripts/zkitap_engine.js', '../scripts/zkitap_engine.js'].forEach(p => {
  updateFile(p, updateZKitap);
});

// --------------------------------------------------------------------------
// 2. UPDATE generate-questions.js
// --------------------------------------------------------------------------
function updateGenerateQuestions(code) {
  // Add rule in system prompt to never use "Yukarıdaki", always "Yandaki"
  if (!code.includes('ASLA "Yukarıdaki"')) {
    code = code.replace(
      'MÜFREDAT VE MAARİF MODELİ STANDARTLARI:',
      `MÜFREDAT VE MAARİF MODELİ STANDARTLARI:
- ASLA "Yukarıdaki", "Yukarıda", "Aşağıdaki", "Aşağıda" İFADESİ KULLANMA. Testler yan yana 2 kolonlu (sol taraf şekil, sağ taraf soru metni) olarak görüntülendiği için soru köklerinde daima "Yandaki görselde", "Yandaki modelde", "Yandaki şekilde", "Yandaki deney düzeneğinde" veya "Yanda verilen" ifadelerini kullan.`
    );
  }

  // Ensure cleanSpatialReferences in cleanTurkishAndLatex
  if (!code.includes('function cleanSpatialReferences(')) {
    code = code.replace(
      'function cleanTurkishAndLatex(str) {',
      `function cleanSpatialReferences(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/yukarıda\\s+verilen/gi, 'yanda verilen')
    .replace(/yukarıdaki\\s+görsel/gi, 'yandaki görsel')
    .replace(/yukarıdaki\\s+model/gi, 'yandaki model')
    .replace(/yukarıdaki\\s+şekil/gi, 'yandaki şekil')
    .replace(/yukarıdaki\\s+tablo/gi, 'yandaki tablo')
    .replace(/yukarıdaki\\s+grafik/gi, 'yandaki grafik')
    .replace(/yukarıdaki\\s+deney/gi, 'yandaki deney')
    .replace(/yukarıdaki\\s+düzenek/gi, 'yandaki düzenek')
    .replace(/yukarıdaki\\s+açıklama/gi, 'yandaki açıklama')
    .replace(/Yukarıdakilerden/g, 'Yandakilerden')
    .replace(/yukarıdakilerden/g, 'yandakilerden')
    .replace(/Yukarıdakiler/g, 'Yandakiler')
    .replace(/yukarıdakiler/g, 'yandakiler')
    .replace(/Yukarıdaki/g, 'Yandaki')
    .replace(/yukarıdaki/g, 'yandaki')
    .replace(/Yukardaki/g, 'Yandaki')
    .replace(/yukardaki/g, 'yandaki')
    .replace(/Yukarıdan/g, 'Yandan')
    .replace(/yukarıdan/g, 'yandan')
    .replace(/Yukarıda/g, 'Yanda')
    .replace(/yukarıda/g, 'yanda')
    .replace(/Yukarda/g, 'Yanda')
    .replace(/yukarda/g, 'yanda');
}

function cleanTurkishAndLatex(str) {`
    );
  }

  code = code.replace(
    '  text = text.replace(/yukarıdaki\\s+şekil/gi, \'yandaki şekil\');\n  return text.trim();',
    '  text = text.replace(/yukarıdaki\\s+şekil/gi, \'yandaki şekil\');\n  text = cleanSpatialReferences(text);\n  return text.trim();'
  );

  return code;
}

['api/generate-questions.js', '../api/generate-questions.js'].forEach(p => {
  updateFile(p, updateGenerateQuestions);
});

// --------------------------------------------------------------------------
// 3. UPDATE test-generator.js
// --------------------------------------------------------------------------
function updateTestGenerator(code) {
  if (!code.includes('function cleanSpatialReferences(')) {
    code = code.replace(
      'function buildInteractiveTestHtml(',
      `function cleanSpatialReferences(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/yukarıda\\s+verilen/gi, 'yanda verilen')
    .replace(/yukarıdaki\\s+görsel/gi, 'yandaki görsel')
    .replace(/yukarıdaki\\s+model/gi, 'yandaki model')
    .replace(/yukarıdaki\\s+şekil/gi, 'yandaki şekil')
    .replace(/yukarıdaki\\s+tablo/gi, 'yandaki tablo')
    .replace(/yukarıdaki\\s+grafik/gi, 'yandaki grafik')
    .replace(/yukarıdaki\\s+deney/gi, 'yandaki deney')
    .replace(/yukarıdaki\\s+düzenek/gi, 'yandaki düzenek')
    .replace(/yukarıdaki\\s+açıklama/gi, 'yandaki açıklama')
    .replace(/Yukarıdakilerden/g, 'Yandakilerden')
    .replace(/yukarıdakilerden/g, 'yandakilerden')
    .replace(/Yukarıdakiler/g, 'Yandakiler')
    .replace(/yukarıdakiler/g, 'yandakiler')
    .replace(/Yukarıdaki/g, 'Yandaki')
    .replace(/yukarıdaki/g, 'yandaki')
    .replace(/Yukardaki/g, 'Yandaki')
    .replace(/yukardaki/g, 'yandaki')
    .replace(/Yukarıdan/g, 'Yandan')
    .replace(/yukarıdan/g, 'yandan')
    .replace(/Yukarıda/g, 'Yanda')
    .replace(/yukarıda/g, 'yanda')
    .replace(/Yukarda/g, 'Yanda')
    .replace(/yukarda/g, 'yanda');
}

function buildInteractiveTestHtml(`
    );
  }

  code = code.replace(
    'q.question = String(q.question || \'\').trim();',
    'q.question = cleanSpatialReferences(String(q.question || \'\').trim());'
  );

  return code;
}

['api/test-generator.js', 'scripts/test-generator.js', '../scripts/test-generator.js'].forEach(p => {
  updateFile(p, updateTestGenerator);
});

// --------------------------------------------------------------------------
// 4. UPDATE yaprak-test.js
// --------------------------------------------------------------------------
function updateYaprakJs(code) {
  // Update updateQtTotalCount to directly sum all active question type inputs
  const oldUpdateFn = `  function updateQtTotalCount() {
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
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, true);
            window.questionPrepEngine.setTypeCount(t, val);
          }
        } else {
          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, false);
          }
        }
      }
    });

    syncActivitySubtypesUI();

    if (window.questionPrepEngine) {
      total = window.questionPrepEngine.getTotalCount();
    }

    if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = \`📊 Toplam: \${total} Soru / İçerik\`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(total || 10);
  }`;

  const newUpdateFn = `  function updateQtTotalCount() {
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];
    let calculatedTotal = 0;

    types.forEach(t => {
      const cb = document.getElementById(\`qt_cb_\${t}\`);
      const countInputEl = document.getElementById(\`qt_count_\${t}\`);
      const row = document.getElementById(\`qt_row_\${t}\`);

      if (cb && countInputEl) {
        if (cb.checked) {
          countInputEl.disabled = false;
          if (row) row.classList.add('is-active');
          const val = Math.max(1, parseInt(countInputEl.value, 10) || 1);
          countInputEl.value = String(val);
          calculatedTotal += val;
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, true);
            window.questionPrepEngine.setTypeCount(t, val);
          }
        } else {
          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, false);
          }
        }
      }
    });

    syncActivitySubtypesUI();

    const finalTotal = Math.max(1, calculatedTotal);
    if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = \`📊 Toplam: \${finalTotal} Soru / İçerik\`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(finalTotal);
  }`;

  code = code.replace(oldUpdateFn, newUpdateFn);

  // In formatQuestionStemText: use comprehensive spatial cleaner
  code = code.replace(
    'function formatQuestionStemText(rawText) {\n    rawText = cleanTurkishAndLatex(rawText);',
    `function formatQuestionStemText(rawText) {
    if (typeof cleanSpatialReferences === 'function') {
      rawText = cleanSpatialReferences(rawText);
    }
    rawText = cleanTurkishAndLatex(rawText);`
  );

  // In renderQuestions: toggle previewEmptyPlaceholder
  code = code.replace(
    'function renderQuestions() {',
    `function renderQuestions() {
    const placeholder = document.getElementById('previewEmptyPlaceholder');
    if (placeholder) placeholder.style.display = 'none';`
  );

  return code;
}

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(p => {
  updateFile(p, updateYaprakJs);
});

// --------------------------------------------------------------------------
// 5. UPDATE yaprak-test.html
// --------------------------------------------------------------------------
function updateYaprakHtml(code) {
  // Add placeholder card inside preview-panel right above smartTitleBanner
  if (!code.includes('id="previewEmptyPlaceholder"')) {
    const target = '      <!-- Sağ Panel: Üretilen Sorular ve Bilgisayara Kaydetme Merkezi -->\n      <section class="preview-panel">';
    const replacement = `      <!-- Sağ Panel: Üretilen Sorular ve Bilgisayara Kaydetme Merkezi -->
      <section class="preview-panel">
        
        <!-- Boş Durum & Başlangıç Rehberi (Soru Üretilmeden Önce Görünen Zarif Karşılama Alanı) -->
        <div class="preview-empty-placeholder" id="previewEmptyPlaceholder">
          <div class="empty-hero-icon">🚀</div>
          <h2 class="empty-hero-title">Akıllı Soru Hazırlama &amp; Canlı Önizleme</h2>
          <p class="empty-hero-desc">
            Sol panelden <strong>Sınıf</strong>, <strong>Ünite</strong> ve <strong>Öğrenme Çıktılarını</strong> seçip istediğiniz soru türlerini belirleyin. 
            <strong>"Soruları Gemini AI İle Üret"</strong> butonuna bastığınızda, hazırlanan çoktan seçmeli, kısa cevaplı, açık uçlu sorular ve etkinlikler tam sayfa canlı A4 mizanpajı ve Z-Kitap formatında burada görüntülenecektir.
          </p>
          <div class="empty-features-grid">
            <div class="empty-feat-card">
              <span class="feat-icon">📑</span>
              <strong>A4 Baskı Mizanpajı</strong>
              <span>1, 2, 4 veya 6 sayfalık profesyonel baskı düzeni.</span>
            </div>
            <div class="empty-feat-card">
              <span class="feat-icon">🖥️</span>
              <strong>Z-Kitap Akıllı Tahta</strong>
              <span>Akıllı tahtada dev ekranda tek tek çözme ve süre sayacı.</span>
            </div>
            <div class="empty-feat-card">
              <span class="feat-icon">📁</span>
              <strong>Ayrı Dosya Desteği</strong>
              <span>Çoktan seçmeli ve kısa cevaplı soruları ayrı ayrı yönetme.</span>
            </div>
            <div class="empty-feat-card">
              <span class="feat-icon">🌐</span>
              <strong>Tek Tıkla Web Yayını</strong>
              <span>Rotalı Fenci web sitenize kapak görseliyle otomatik ekleme.</span>
            </div>
          </div>
        </div>`;
    code = code.replace(target, replacement);
  }

  return code;
}

['yaprak-test.html', '../yaprak-test.html'].forEach(p => {
  updateFile(p, updateYaprakHtml);
});

// --------------------------------------------------------------------------
// 6. UPDATE css/yaprak-test.css
// --------------------------------------------------------------------------
function updateYaprakCss(code) {
  if (!code.includes('.preview-empty-placeholder')) {
    code += `\n
/* ==========================================================================
   🚀 BOŞ DURUM VE BAŞLANGIÇ REHBERİ (PREVIEW EMPTY PLACEHOLDER)
   ========================================================================== */
.preview-empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 32px;
  background: #ffffff;
  border-radius: 20px;
  border: 2px dashed #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin: 16px 0;
  min-height: 520px;
}

.empty-hero-icon {
  font-size: 54px;
  line-height: 1;
  margin-bottom: 16px;
  animation: floatRocket 3s ease-in-out infinite;
}

@keyframes floatRocket {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.empty-hero-title {
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.empty-hero-desc {
  font-size: 14.5px;
  line-height: 1.6;
  color: #475569;
  max-width: 680px;
  margin: 0 auto 32px auto;
}

.empty-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 880px;
}

.empty-feat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 18px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  transition: all 0.2s ease;
}

.empty-feat-card:hover {
  transform: translateY(-2px);
  border-color: #93c5fd;
  background: #f0f9ff;
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08);
}

.empty-feat-card .feat-icon {
  font-size: 26px;
  margin-bottom: 4px;
}

.empty-feat-card strong {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.empty-feat-card span {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}
`;
  }

  return code;
}

['css/yaprak-test.css', '../css/yaprak-test.css'].forEach(p => {
  updateFile(p, updateYaprakCss);
});

console.log('All fixes applied successfully!');
