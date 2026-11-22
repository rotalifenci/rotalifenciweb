const fs = require('fs');
const path = require('path');

function patchFile(relPath, patchFn) {
  const fullPaths = [
    path.join(__dirname, '..', relPath),
    path.join(__dirname, '..', '..', relPath)
  ];
  fullPaths.forEach(fp => {
    if (fs.existsSync(fp)) {
      const orig = fs.readFileSync(fp, 'utf8');
      const patched = patchFn(orig);
      if (patched !== orig) {
        fs.writeFileSync(fp, patched, 'utf8');
        console.log(`[Patched] ${fp}`);
      } else {
        console.log(`[Unchanged] ${fp}`);
      }
    }
  });
}

// 1. CSS Patches: Hide empty visual boxes & style img inside question-visual-box
patchFile('css/yaprak-test.css', content => {
  let res = content;
  const extraCss = `
/* 🛡️ Soru-Görsel Kutusu: Boş kutu çerçevesini gizle ve img responsive standardı */
.question-visual-box:empty {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  min-height: 0 !important;
  height: 0 !important;
}
.question-visual-box img {
  max-height: 120px !important;
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block !important;
  margin: 0 auto !important;
  object-fit: contain !important;
  border-radius: 6px !important;
}
`;
  if (!res.includes('.question-visual-box:empty')) {
    res = res + extraCss;
  }
  return res;
});

// 2. js/yaprak-test.js Patches:
patchFile('js/yaprak-test.js', content => {
  let res = content;

  // A) prepareSvgForDisplay: support <img> and <picture>
  const oldFuncStart = "function prepareSvgForDisplay(svgStr, question = '', options = {}, correctAnswer = '') {\n    if (!svgStr || typeof svgStr !== 'string' || !svgStr.includes('<svg')) return '';";
  const newFuncStart = `function prepareSvgForDisplay(svgStr, question = '', options = {}, correctAnswer = '') {
    if (!svgStr || typeof svgStr !== 'string') return '';
    const trimmed = svgStr.trim();
    if (!trimmed) return '';

    // 🖼️ Eğer görsel doğrudan <img src="..."> veya <picture> ise responsive stil ekleyip döndür:
    if (trimmed.startsWith('<img') || trimmed.startsWith('<picture') || (trimmed.includes('<img') && !trimmed.includes('<svg'))) {
      if (!trimmed.includes('style=')) {
        return trimmed.replace('<img', '<img style="max-height:120px; max-width:100%; object-fit:contain; display:block; margin:0 auto; border-radius:6px;"');
      }
      return trimmed;
    }

    if (!trimmed.includes('<svg')) return '';`;

  if (res.includes(oldFuncStart)) {
    res = res.replace(oldFuncStart, newFuncStart);
  } else {
    // Alternate match without indentation
    res = res.replace(
      /function\s+prepareSvgForDisplay\s*\(\s*svgStr\s*,\s*question\s*=\s*''[^)]*\)\s*\{\s*if\s*\(!svgStr\s*\|\|\s*typeof\s+svgStr\s*!==\s*'string'\s*\|\|\s*!svgStr\.includes\('<svg'\)\)\s*return\s*'';/g,
      newFuncStart
    );
  }

  // B) visualBoxHtml: Never render empty <div class="question-visual-box">
  const oldVisualBoxHtml = `const visualBoxHtml = q.visual_svg && q.visual_svg.trim() 
            ? \`<div class="question-visual-box">\${prepareSvgForDisplay(q.visual_svg, q.question, q.options, q.correct_answer)}</div>\` 
            : '';`;

  const newVisualBoxHtml = `const visualBoxContent = (q.visual_svg && q.visual_svg.trim()) 
            ? prepareSvgForDisplay(q.visual_svg, q.question, q.options, q.correct_answer) 
            : '';
          const visualBoxHtml = (visualBoxContent && visualBoxContent.trim()) 
            ? \`<div class="question-visual-box">\${visualBoxContent}</div>\` 
            : '';`;

  if (res.includes(oldVisualBoxHtml)) {
    res = res.replace(oldVisualBoxHtml, newVisualBoxHtml);
  }

  // C) Question stem phantom (?) sanitization
  const oldQuestionBody = `escapeHtml(cleanTurkishAndLatex(q.question))`;
  const newQuestionBody = `escapeHtml(cleanQuestionVisualReferences(cleanTurkishAndLatex(q.question), q.visual_svg))`;
  if (res.includes(oldQuestionBody) && !res.includes('cleanQuestionVisualReferences')) {
    res = res.replace(oldQuestionBody, newQuestionBody);
  }

  // Add cleanQuestionVisualReferences helper if missing
  if (!res.includes('function cleanQuestionVisualReferences')) {
    const helperCode = `
  // 🛡️ Soru-Görsel Metin Uyum Koruyucusu: Görselde (?) yoksa soru kökündeki hayali (?) referanslarını temizler
  function cleanQuestionVisualReferences(text, visualSvg) {
    if (!text || typeof text !== 'string') return text || '';
    const v = String(visualSvg || '');
    const hasVisualQuestionMark = v.includes('?') || v.includes('soru_isareti') || v.includes('soru-isareti');

    let out = text;
    // Eğer görselde soru işareti yoksa soru kökündeki "(?)" referanslarını temizle ve akıcı hale getir
    if (!hasVisualQuestionMark) {
      out = out
        .replace(/soru\\s+işareti\\s*\\(\\?\\)\\s+ile\\s+gösterilen/gi, 'gösterilen')
        .replace(/soru\\s+işareti\\s*\\(\\?\\)\\s+ile\\s+gösterilmiştir/gi, 'gösterilmiştir')
        .replace(/soru\\s+işareti\\s*\\(\\?\\)\\s+ile\\s+belirtilen/gi, 'belirtilen')
        .replace(/soru\\s+işareti\\s*\\(\\?\\)\\s+ile\\s+belirtilmiştir/gi, 'belirtilmiştir')
        .replace(/soru\\s+işareti\\s*\\(\\?\\)/gi, 'görseldeki araç / model')
        .replace(/soru\\s+işaretiyle\\s+gösterilen/gi, 'gösterilen')
        .replace(/soru\\s+işareti\\s+ile\\s+gösterilen/gi, 'gösterilen')
        .replace(/soru\\s+işaretli\\s+yerdeki/gi, 'görseldeki');
    }
    return out.trim();
  }
`;
    // Insert helper before renderQuestions
    res = res.replace('function renderQuestions() {', helperCode + '\n  function renderQuestions() {');
  }

  return res;
});

// 3. api/generate-questions.js Patches:
patchFile('api/generate-questions.js', content => {
  let res = content;

  // Add Question-Visual Harmony rule in system prompt
  const ruleSearch = "GÖRSEL KURALLARI (HAYATİ ÖNEMDE KESİN KURALLAR):";
  const ruleReplace = `GÖRSEL KURALLARI (HAYATİ ÖNEMDE KESİN KURALLAR):
0. GÖRSEL VE SORU METNİ %100 BİREBİR UYUMLU OLMALIDIR:
   - Eğer görselde soru işareti (?), numara (1, 2, 3) veya harf (X, Y) yoksa; soru metninde KESİNLİKLE "soru işareti (?) ile gösterilen" veya "numaralandırılmış" gibi hayali ifadelere YER VERME!
   - Örneğin bir yapay uydu veya uzay aracı fotoğrafı kullanılıyorsa soru kökünde doğrudan: "Yandaki görselde Dünya yörüngesinde dolanan insan yapımı bir araç verilmiştir / gösterilmiştir..." şeklinde sor.`;

  if (res.includes(ruleSearch) && !res.includes('GÖRSEL VE SORU METNİ %100 BİREBİR UYUMLU OLMALIDIR')) {
    res = res.replace(ruleSearch, ruleReplace);
  }

  return res;
});

// 4. api/publish-test.js Patches: TDZ prevention
patchFile('api/publish-test.js', content => {
  let res = content;
  // Ensure cleanGrade and cleanSection are defined right at the start of try block
  if (!res.includes('let cleanGrade = "5";')) {
    res = res.replace(
      'try {\n    const {',
      'try {\n    let cleanGrade = "5";\n    let cleanSection = "1";\n    const {'
    );
    res = res.replace(
      'const cleanGrade = String(grade).replace(/^grade-/, \'\').trim() || "5";',
      'cleanGrade = String(grade).replace(/^grade-/, \'\').trim() || "5";'
    );
    res = res.replace(
      'const cleanSection = String(targetSection).replace(/^unit/i, \'\').replace(/[^0-9]/g, \'\') || "1";',
      'cleanSection = String(targetSection).replace(/^unit/i, \'\').replace(/[^0-9]/g, \'\') || "1";'
    );
  }
  return res;
});

console.log('Patch complete.');
