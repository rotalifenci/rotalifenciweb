/**
 * Rotalı Fenci - Yaprak Test & İnteraktif Sınav Oluşturucu Motoru
 * Hem Çoktan Seçmeli hem de Açık Uçlu (Klasik) ve Kısa Cevaplı sınavları destekler.
 * Hem tarayıcıda canlı çözülebilir hem de A4 formatında resmi MEB standartlarında yazdırılabilir/PDF yapılabilir.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateSlug(text) {
  const trMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  return String(text || 'test')
    .split('')
    .map(c => trMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function buildInteractiveTestHtml({
  title,
  grade = "5",
  unit = "1. Ünite",
  targetSection = "1",
  subject = "Fen Bilimleri",
  category = "soru-bankasi",
  outcomes = [],
  questions = []
}) {
  const safeTitle = escapeHtml(title || `${grade}. Sınıf ${subject} Sınavı`);
  const safeUnit = escapeHtml(unit);
  const qCount = questions.length;
  const estimatedTime = Math.max(10, qCount * 3);

  const hasOnlyOpenEnded = questions.every(q => {
    const hasChoices = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0 && (q.options.A || q.options.B || q.options.C || q.options.D);
    return q.type === 'open_ended' || (!hasChoices && q.type !== 'multiple_choice');
  });

  const mcCount = questions.filter(q => {
    const hasChoices = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0 && (q.options.A || q.options.B || q.options.C || q.options.D);
    return (q.type === 'multiple_choice' || !q.type) && hasChoices;
  }).length;

  // Soruları HTML bloklarına dönüştür
  const questionsHtml = questions.map((q, idx) => {
    const qNum = idx + 1;
    const hasChoices = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0 && (q.options.A || q.options.B || q.options.C || q.options.D);
    const isMultipleChoice = (q.type === 'multiple_choice' || !q.type) && hasChoices;
    const isShortAnswer = q.type === 'short_answer';
    const isOpenEnded = q.type === 'open_ended' || (!hasChoices && !isShortAnswer);

    const visualBox = q.visual_svg ? `
      <div class="question-visual-box">
        ${q.visual_svg}
      </div>` : '';

    let answerAreaHtml = '';
    let solutionBoxHtml = '';
    let correctAns = '';
    let qTypeTag = '';

    if (isMultipleChoice) {
      correctAns = (q.correct_answer || 'A').toUpperCase().trim();
      qTypeTag = 'Çoktan Seçmeli';
      const opts = q.options || { A: '', B: '', C: '', D: '' };
      const optionsHtml = ['A', 'B', 'C', 'D'].map(optKey => {
        const optText = opts[optKey] || '';
        return `
          <label class="opt-label" data-opt="${optKey}">
            <input type="radio" name="q${qNum}" value="${optKey}">
            <span class="opt-circle">${optKey}</span>
            <span class="opt-text">${escapeHtml(optText)}</span>
          </label>`;
      }).join('');

      answerAreaHtml = `
        <div class="options-group">
          ${optionsHtml}
        </div>`;

      solutionBoxHtml = `
        <div class="solution-box" style="display: none;">
          <div class="sol-title">💡 Çözüm ve Açıklama:</div>
          <div class="sol-text"><strong>Doğru Seçenek: [${correctAns}]</strong> — ${escapeHtml(q.explanation || 'Açıklama belirtilmemiş.')}</div>
        </div>`;
    } else if (isShortAnswer) {
      correctAns = String(q.correct_answer || '').trim();
      qTypeTag = 'Kısa Cevaplı';
      answerAreaHtml = `
        <div class="short-answer-area">
          <span class="short-ans-label"><i class="fa-solid fa-pen"></i> <strong>Cevap:</strong></span>
          <input type="text" class="student-short-input no-print" placeholder="Kısa cevabınızı buraya yazınız...">
          <span class="print-short-line only-print">....................................................................................</span>
        </div>`;

      solutionBoxHtml = `
        <div class="solution-box" style="display: none;">
          <div class="sol-title">💡 Doğru / Beklenen Cevap:</div>
          <div class="sol-text"><strong>Cevap:</strong> ${escapeHtml(correctAns || q.explanation || 'Belirtilmemiş.')}</div>
        </div>`;
    } else {
      // Açık Uçlu (Klasik)
      correctAns = String(q.correct_answer || '').trim();
      qTypeTag = 'Açık Uçlu';
      answerAreaHtml = `
        <div class="open-ended-answer-area">
          <div class="answer-lines-prompt"><i class="fa-solid fa-pen-nib"></i> <strong>Cevabınızı ve bilimsel gerekçenizi yazınız:</strong></div>
          <textarea class="student-text-input no-print" rows="3" placeholder="Açık uçlu cevabınızı buraya yazabilirsiniz..."></textarea>
          <div class="print-writing-lines only-print">
            <div class="write-line"></div>
            <div class="write-line"></div>
            <div class="write-line"></div>
          </div>
        </div>`;

      solutionBoxHtml = `
        <div class="solution-box" style="display: none;">
          <div class="sol-title">💡 Beklenen Model Cevap & Değerlendirme Ölçütü (Rubrik):</div>
          <div class="sol-text">
            ${correctAns ? `<div style="margin-bottom:6px;"><strong>Model Cevap:</strong> ${escapeHtml(correctAns)}</div>` : ''}
            ${q.explanation ? `<div><strong>Bilimsel Açıklama:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
          </div>
        </div>`;
    }

    const typeDataAttr = isMultipleChoice ? 'multiple_choice' : (isShortAnswer ? 'short_answer' : 'open_ended');

    return `
      <div class="question-block" data-qid="${qNum}" data-type="${typeDataAttr}" data-correct="${escapeHtml(correctAns)}">
        <div class="q-top-row">
          <span class="q-badge">Soru ${qNum}</span>
          <div style="display:flex; gap:6px; align-items:center;">
            <span class="q-type-badge">${qTypeTag}</span>
            ${q.difficulty ? `<span class="q-diff-tag q-diff-${q.difficulty.toLowerCase()}">${escapeHtml(q.difficulty)}</span>` : ''}
          </div>
        </div>
        ${visualBox}
        <div class="question-text-and-options">
          <div class="q-text">${escapeHtml(q.question || '')}</div>
          ${answerAreaHtml}
        </div>
        ${solutionBoxHtml}
      </div>`;
  }).join('\n');

  // Mini Cevap Anahtarı Hücreleri
  const answerKeyCells = questions.map((q, idx) => {
    const qNum = idx + 1;
    const hasChoices = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0 && (q.options.A || q.options.B || q.options.C || q.options.D);
    const isMultipleChoice = (q.type === 'multiple_choice' || !q.type) && hasChoices;
    const isShort = q.type === 'short_answer';

    let displayAns = '';
    let extraStyle = '';
    if (isMultipleChoice) {
      displayAns = (q.correct_answer || '-').toUpperCase().trim();
    } else if (isShort) {
      const ca = String(q.correct_answer || '').trim();
      displayAns = ca.length <= 6 ? ca : 'Kısa';
      extraStyle = 'font-size:10px; font-weight:700;';
    } else {
      displayAns = 'Klasik';
      extraStyle = 'font-size:9px; font-weight:700; color:#4f46e5;';
    }

    return `
      <div class="ak-cell">
        <span class="ak-q">${qNum}</span>
        <span class="ak-a" style="${extraStyle}">${escapeHtml(displayAns)}</span>
      </div>`;
  }).join('');

  const targetCategoryHash = category === 'denemeler' ? 'denemeler' : 'soru-bankasi';
  const targetCategoryName = category === 'denemeler' ? 'Yazılıya Hazırlık' : 'Soru Bankası';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeTitle} | Rotalı Fenci</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --accent: #10b981;
      --correct-bg: #ecfdf5;
      --correct-border: #10b981;
      --wrong-bg: #fef2f2;
      --wrong-border: #ef4444;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 14px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Times New Roman', Times, serif !important;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 20px 16px;
      min-height: 100vh;
    }

    .test-wrapper {
      max-width: 920px;
      margin: 0 auto;
    }

    /* Üst Aksiyon / Kontrol Barı */
    .top-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 14px 20px;
      border-radius: var(--radius);
      border: 1.5px solid var(--border);
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      flex-wrap: wrap;
      gap: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    .top-actions-bar * {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: #0f172a;
      font-size: 13px;
      font-weight: 800;
      padding: 7px 14px;
      border-radius: 10px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      transition: all 0.2s;
    }

    .nav-btn:hover {
      background: #e2e8f0;
      color: var(--primary);
      transform: translateY(-1px);
    }

    .action-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 800;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-outline {
      background: #ffffff;
      color: #334155;
      border: 1.5px solid #cbd5e1;
    }
    .btn-outline:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }

    .btn-success {
      background: #10b981;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
    }
    .btn-success:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
    }
    .btn-primary:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }

    /* Yaprak Test Kağıdı */
    .sheet-paper {
      background: #ffffff;
      border-radius: 6px;
      border: 1.5px solid #000000;
      padding: 28px 32px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      position: relative;
    }

    /* MEB Sınav Başlığı */
    .sheet-header {
      border: 1.5px solid #000000;
      padding: 10px 14px;
      margin-bottom: 20px;
      background: #ffffff;
    }

    .sheet-header-top {
      text-align: center;
      border-bottom: 1.5px solid #000000;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }

    .ministry-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #000000;
      margin-bottom: 2px;
    }

    .main-test-title {
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #000000;
    }

    .student-info-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 10px;
      font-size: 11.5px;
      border-bottom: 1px dashed #000000;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }

    .sheet-meta-footer {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: bold;
      color: #334155;
    }

    /* Soru Blokları */
    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .question-block {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 14px 18px;
      background: #ffffff;
      position: relative;
      transition: border-color 0.2s;
    }

    .question-block:hover {
      border-color: #94a3b8;
    }

    .q-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .q-badge {
      display: inline-block;
      font-weight: 900;
      font-size: 14.5px;
      color: #000000;
      border-bottom: 2px solid #000000;
      padding-bottom: 1px;
    }

    .q-type-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    .q-diff-tag {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }
    .q-diff-kolay { background: #dcfce7; color: #15803d; }
    .q-diff-orta { background: #e0f2fe; color: #0369a1; }
    .q-diff-zor { background: #fee2e2; color: #b91c1c; }

    /* Görsel Kutusu */
    .question-visual-box {
      margin: 10px auto 14px auto;
      max-width: 520px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px;
    }

    .question-visual-box svg {
      width: 100%;
      height: auto;
      max-height: 220px;
      display: block;
    }

    .q-text {
      font-size: 13.5px;
      font-weight: 600;
      color: #000000;
      margin-bottom: 12px;
      line-height: 1.55;
    }

    .q-text strong {
      font-weight: 900;
      text-decoration: underline;
    }

    /* Çoktan Seçmeli Şıklar */
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .opt-label {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: #ffffff;
      font-size: 13px;
    }

    .opt-label:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .opt-label input[type="radio"] {
      display: none;
    }

    .opt-circle {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1.5px solid #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11.5px;
      font-weight: 900;
      color: #000000;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .opt-label.selected {
      background: #f1f5f9;
      border-color: #475569;
    }

    .opt-label.selected .opt-circle {
      background: #0f172a;
      color: #ffffff;
    }

    .opt-label.is-correct {
      background: var(--correct-bg) !important;
      border-color: var(--correct-border) !important;
      font-weight: bold;
    }

    .opt-label.is-correct .opt-circle {
      background: #10b981 !important;
      border-color: #10b981 !important;
      color: #ffffff !important;
    }

    .opt-label.is-wrong-selected {
      background: var(--wrong-bg) !important;
      border-color: var(--wrong-border) !important;
    }

    .opt-label.is-wrong-selected .opt-circle {
      background: #ef4444 !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
    }

    /* Açık Uçlu Soru Alanı */
    .open-ended-answer-area {
      margin-top: 10px;
      background: #f8fafc;
      border: 1.5px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
    }

    .answer-lines-prompt {
      font-size: 12.5px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 8px;
    }

    .student-text-input {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 13.5px;
      font-family: 'Times New Roman', Times, serif !important;
      resize: vertical;
      outline: none;
      background: #ffffff;
      box-sizing: border-box;
      line-height: 1.5;
    }

    .student-text-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    /* Kısa Cevaplı Soru Alanı */
    .short-answer-area {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
    }

    .short-ans-label {
      font-size: 13px;
      color: #334155;
    }

    .student-short-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 13.5px;
      font-family: 'Times New Roman', Times, serif !important;
      outline: none;
      box-sizing: border-box;
      background: #ffffff;
    }

    .student-short-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .print-writing-lines {
      display: none;
    }

    .only-print {
      display: none !important;
    }

    /* Çözüm Kutusu */
    .solution-box {
      margin-top: 12px;
      padding: 10px 14px;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 0 6px 6px 0;
      font-size: 12.5px;
      color: #1e3a8a;
    }

    .sol-title {
      font-weight: 800;
      margin-bottom: 4px;
    }

    .sol-text {
      line-height: 1.55;
    }

    /* Cevap Anahtarı Şeridi */
    .answer-key-section {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px dashed #000000;
      page-break-inside: avoid;
    }

    .ak-title {
      text-align: center;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .ak-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }

    .ak-cell {
      border: 1px solid #000000;
      display: flex;
      flex-direction: column;
      width: 42px;
      text-align: center;
    }

    .ak-q {
      background: #f1f5f9;
      font-size: 10px;
      font-weight: bold;
      border-bottom: 1px solid #000000;
      padding: 1px 0;
    }

    .ak-a {
      font-size: 12px;
      font-weight: 900;
      padding: 3px 0;
      min-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Sayfa Alt Bilgisi */
    .sheet-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-size: 11px;
      color: #64748b;
    }

    .sheet-footer strong {
      color: #000000;
    }

    /* Sonuç Kartı */
    .result-card {
      background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: var(--radius);
      margin-top: 24px;
      text-align: center;
      display: none;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    .result-card * {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    .score-badge {
      font-size: 36px;
      font-weight: 900;
      color: #fbbf24;
      margin: 8px 0;
    }

    /* Yazdırma ve PDF (@media print) Stilleri */
    @page {
      size: A4 portrait;
      margin: 10mm 15mm;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }

      .no-print {
        display: none !important;
      }

      .only-print {
        display: block !important;
      }

      .test-wrapper {
        max-width: 100% !important;
        margin: 0 !important;
      }

      .sheet-paper {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }

      .question-block {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        border: 1px solid #cbd5e1 !important;
        margin-bottom: 12px !important;
      }

      .opt-label {
        break-inside: avoid !important;
      }

      .solution-box {
        break-inside: avoid !important;
      }

      .open-ended-answer-area {
        background: transparent !important;
        border: 1px solid #000000 !important;
        padding: 8px 12px !important;
      }

      .print-writing-lines {
        display: flex !important;
        flex-direction: column;
        gap: 20px;
        margin-top: 18px;
        padding-bottom: 6px;
      }

      .write-line {
        border-bottom: 1px dashed #64748b;
        height: 1px;
        width: 100%;
      }

      .short-answer-area {
        background: transparent !important;
        border: none !important;
        padding: 4px 0 !important;
      }

      .print-short-line {
        display: inline !important;
      }

      .answer-key-section {
        display: block !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="test-wrapper">
    
    <!-- Üst Kontrol Barı -->
    <div class="top-actions-bar no-print">
      <div class="nav-links">
        <a href="https://rotalifenci.vercel.app/" class="nav-btn">
          <i class="fa-solid fa-house"></i> Rotalı Fenci Portalı
        </a>
        <a href="https://rotalifenci.vercel.app/#grade/grade-${grade}/${targetCategoryHash}" class="nav-btn">
          <span>📚</span> ${grade}. Sınıf ${targetCategoryName}
        </a>
      </div>

      <div class="action-group">
        <button type="button" id="toggleTeacherModeBtn" class="btn btn-outline" title="Öğretmen Modu: Tüm şıkları, model cevapları ve ayrıntılı çözümleri anında gösterir">
          <i class="fa-solid fa-eye"></i> <span>Öğretmen Modu</span>
        </button>
        <button type="button" id="finishTestBtn" class="btn btn-success" title="${hasOnlyOpenEnded ? 'Model çözümleri ve değerlendirme ölçütlerini gösterir' : 'İşaretlediğiniz şıkları kontrol edip puanınızı hesaplar'}">
          <i class="fa-solid fa-circle-check"></i> <span>${hasOnlyOpenEnded ? 'Model Çözümleri Gör' : 'Testi Bitir & Puanla'}</span>
        </button>
        <button type="button" onclick="window.print()" class="btn btn-primary" title="A4 formatında yazdır veya PDF olarak kaydet">
          <i class="fa-solid fa-print"></i> <span>Yazdır / PDF</span>
        </button>
      </div>
    </div>

    <!-- Yaprak Test / Sınav Kağıdı -->
    <div class="sheet-paper" id="testSheet">
      
      <!-- MEB Resmi Sınav Başlığı -->
      <div class="sheet-header">
        <div class="sheet-header-top">
          <div class="ministry-title">T.C. MİLLİ EĞİTİM BAKANLIĞI</div>
          <div class="main-test-title">${safeTitle.toUpperCase()}</div>
        </div>

        <div class="student-info-grid">
          <div><strong>Adı Soyadı:</strong> ........................................................</div>
          <div><strong>Sınıf / Şube:</strong> ${grade} / .........</div>
          <div><strong>Tarih:</strong> ..... / ..... / 2026</div>
          <div><strong>Puan:</strong> <span id="headerScoreBox">...............</span></div>
        </div>

        <div class="sheet-meta-footer">
          <span><strong>Ünite:</strong> ${safeUnit}</span>
          <span><strong>Soru Sayısı:</strong> ${qCount} Soru</span>
          <span><strong>Süre:</strong> ${estimatedTime} Dakika</span>
        </div>
      </div>

      <!-- Sorular Listesi -->
      <div class="questions-list">
        ${questionsHtml}
      </div>

      <!-- Cevap ve Kodlama Anahtarı (Son Kısım) -->
      <div class="answer-key-section" id="answerKeySection" style="display: none;">
        <div class="ak-title">🎯 CEVAP VE DEĞERLENDİRME ANAHTARI</div>
        <div class="ak-grid">
          ${answerKeyCells}
        </div>
        ${!hasOnlyOpenEnded && mcCount < qCount ? `
          <div style="text-align: center; font-size: 11px; color: #64748b; margin-top: 8px;">
            * Açık uçlu soruların detaylı değerlendirme ölçütleri ve model cevapları için ilgili soruların altındaki çözüm kutularına bakınız.
          </div>` : ''}
      </div>

      <!-- Sayfa Alt Bilgisi -->
      <div class="sheet-footer">
        <div><strong>ROTALI FENCİ</strong> — Dijital Fen Bilimleri Eğitim Portalı</div>
        <div>rotalifenci.vercel.app</div>
      </div>

    </div>

    <!-- Sonuç Değerlendirme Kartı (Test Tamamlandığında Çıkar) -->
    <div class="result-card no-print" id="resultCard">
      <div style="font-size: 14px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Sınav Değerlendirmesi</div>
      <div class="score-badge" id="scoreDisplay">0 Puan</div>
      <p id="scoreDetails" style="font-size: 14.5px; color: #cbd5e1; margin-bottom: 16px; line-height: 1.5;"></p>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" onclick="location.reload()" class="btn btn-outline" style="background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2);">
          <i class="fa-solid fa-rotate-right"></i> Tekrar Çöz
        </button>
        <button type="button" onclick="window.print()" class="btn btn-primary">
          <i class="fa-solid fa-print"></i> Yazdır / PDF Al
        </button>
      </div>
    </div>

  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      let isTeacherMode = false;
      const totalQuestions = ${qCount};
      const totalMcQuestions = ${mcCount};
      const isOnlyOpenEnded = ${hasOnlyOpenEnded ? 'true' : 'false'};

      const testSheet = document.getElementById('testSheet');
      const toggleTeacherModeBtn = document.getElementById('toggleTeacherModeBtn');
      const finishTestBtn = document.getElementById('finishTestBtn');
      const answerKeySection = document.getElementById('answerKeySection');
      const resultCard = document.getElementById('resultCard');
      const scoreDisplay = document.getElementById('scoreDisplay');
      const scoreDetails = document.getElementById('scoreDetails');
      const headerScoreBox = document.getElementById('headerScoreBox');

      // Şık Seçimi (Öğrenci Tıklaması - Sadece Çoktan Seçmeli Sorularda)
      document.querySelectorAll('.opt-label').forEach(label => {
        label.addEventListener('click', function(e) {
          if (isTeacherMode) return;
          const block = this.closest('.question-block');
          block.querySelectorAll('.opt-label').forEach(l => l.classList.remove('selected'));
          this.classList.add('selected');
          const radio = this.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });

      // Öğretmen Modu Aç/Kapat
      if (toggleTeacherModeBtn) {
        toggleTeacherModeBtn.addEventListener('click', () => {
          isTeacherMode = !isTeacherMode;
          if (isTeacherMode) {
            answerKeySection.style.display = 'block';
            document.querySelectorAll('.solution-box').forEach(sb => sb.style.display = 'block');
            document.querySelectorAll('.question-block').forEach(qb => {
              if (qb.getAttribute('data-type') === 'multiple_choice') {
                const correctOpt = qb.getAttribute('data-correct');
                const targetLabel = qb.querySelector('.opt-label[data-opt="' + correctOpt + '"]');
                if (targetLabel) targetLabel.classList.add('is-correct');
              }
            });
            toggleTeacherModeBtn.innerHTML = '<i class="fa-solid fa-lock"></i> <span>Öğretmen Modunu Kapat</span>';
            toggleTeacherModeBtn.classList.add('btn-primary');
            toggleTeacherModeBtn.classList.remove('btn-outline');
          } else {
            answerKeySection.style.display = 'none';
            document.querySelectorAll('.solution-box').forEach(sb => sb.style.display = 'none');
            document.querySelectorAll('.opt-label').forEach(l => l.classList.remove('is-correct', 'is-wrong-selected'));
            toggleTeacherModeBtn.innerHTML = '<i class="fa-solid fa-eye"></i> <span>Öğretmen Modu</span>';
            toggleTeacherModeBtn.classList.add('btn-outline');
            toggleTeacherModeBtn.classList.remove('btn-primary');
          }
        });
      }

      // Testi Bitir & Değerlendir
      if (finishTestBtn) {
        finishTestBtn.addEventListener('click', () => {
          let mcCorrect = 0;
          let mcAnswered = 0;

          document.querySelectorAll('.question-block').forEach(qb => {
            const isMc = qb.getAttribute('data-type') === 'multiple_choice';
            const solBox = qb.querySelector('.solution-box');
            if (solBox) solBox.style.display = 'block';

            if (isMc) {
              const correctOpt = qb.getAttribute('data-correct');
              const selectedLabel = qb.querySelector('.opt-label.selected');
              qb.querySelectorAll('.opt-label').forEach(l => l.classList.remove('is-correct', 'is-wrong-selected'));

              if (selectedLabel) {
                mcAnswered++;
                const userOpt = selectedLabel.getAttribute('data-opt');
                if (userOpt === correctOpt) {
                  mcCorrect++;
                  selectedLabel.classList.add('is-correct');
                } else {
                  selectedLabel.classList.add('is-wrong-selected');
                  const correctLabel = qb.querySelector('.opt-label[data-opt="' + correctOpt + '"]');
                  if (correctLabel) correctLabel.classList.add('is-correct');
                }
              } else {
                const correctLabel = qb.querySelector('.opt-label[data-opt="' + correctOpt + '"]');
                if (correctLabel) correctLabel.classList.add('is-correct');
              }
            }
          });

          answerKeySection.style.display = 'block';

          if (totalMcQuestions > 0) {
            const score = Math.round((mcCorrect / totalMcQuestions) * 100);
            scoreDisplay.textContent = score + ' Puan';
            headerScoreBox.textContent = score + ' / 100';
            const wrongCount = mcAnswered - mcCorrect;
            const emptyCount = totalMcQuestions - mcAnswered;
            let det = totalMcQuestions + ' çoktan seçmeli sorudan ' + mcCorrect + ' doğru, ' + wrongCount + ' yanlış, ' + emptyCount + ' boş.';
            if (totalQuestions > totalMcQuestions) {
              det += ' (' + (totalQuestions - totalMcQuestions) + ' adet açık uçlu soru için model çözümleri inceleyiniz.)';
            }
            scoreDetails.textContent = det;
          } else {
            scoreDisplay.textContent = 'Sınav Tamamlandı';
            headerScoreBox.textContent = 'Açık Uçlu';
            scoreDetails.textContent = 'Açık uçlu sınav tamamlandı. Yazdığınız cevapları yukarıda açılan model cevap ve değerlendirme ölçütleriyle karşılaştırarak kendi değerlendirmenizi yapabilirsiniz.';
          }

          resultCard.style.display = 'block';
          resultCard.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  </script>
</body>
</html>`;
}

module.exports = {
  buildInteractiveTestHtml,
  generateSlug
};
