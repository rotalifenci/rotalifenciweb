/**
 * Rotalı Fenci - Yaprak Test & İnteraktif Sınav Oluşturucu Motoru
 * Hem Çoktan Seçmeli hem de Açık Uçlu (Klasik) ve Kısa Cevaplı sınavları tam ekran MEB formatında destekler.
 * Hem tarayıcıda canlı çözülebilir hem de A4 formatında resmi MEB standartlarında yazdırılabilir/PDF yapılabilir.
 * 
 * Özellikler:
 * - Sağ alt köşede yüzen ve sayfa sonundaki "Testi Bitir" butonları
 * - Çoktan seçmeli, kısa cevaplı ve açık uçlu soruları anında değerlendiren akıllı puanlama algoritması
 * - Doğru, yanlış ve boş sayılarını gösteren modern Sonuç Karnesi Modalı
 * - Rotalı Fenci öğretmen dümen logosu ile zenginleştirilmiş MEB başlığı, yüzen buton ve filigran
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
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i', 'I': 'i',
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

/**
 * Seçenekleri her türlü veri yapısından (dizi, küçük harf, noktalı anahtar vs.) güvenle A, B, C, D formatına dönüştürür.
 */
function normalizeOptions(rawOpts) {
  if (!rawOpts) return null;
  const normalized = {};

  if (Array.isArray(rawOpts)) {
    const keys = ['A', 'B', 'C', 'D'];
    rawOpts.forEach((val, i) => {
      if (i < 4 && val !== undefined && val !== null) {
        normalized[keys[i]] = String(val).trim();
      }
    });
  } else if (typeof rawOpts === 'object') {
    Object.keys(rawOpts).forEach(k => {
      const cleanKey = k.toUpperCase().replace(/[^ABCD]/g, '').slice(0, 1);
      if (['A', 'B', 'C', 'D'].includes(cleanKey)) {
        normalized[cleanKey] = String(rawOpts[k] || '').trim();
      }
    });
  }

  // En az 2 dolu seçenek olmalı
  const validKeys = Object.keys(normalized).filter(k => normalized[k].length > 0);
  if (validKeys.length >= 2) {
    ['A', 'B', 'C', 'D'].forEach(k => {
      if (!normalized[k]) normalized[k] = '';
    });
    return normalized;
  }
  return null;
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

  // Soru tiplerini analiz et
  let mcCount = 0;
  let shortAnswerCount = 0;
  let openEndedCount = 0;

  // Soruları HTML bloklarına dönüştür
  const questionsHtml = questions.map((q, idx) => {
    const qNum = idx + 1;
    const cleanOpts = normalizeOptions(q.options);
    const hasChoices = cleanOpts !== null;
    const isMultipleChoice = (q.type === 'multiple_choice' || (!q.type && hasChoices)) && hasChoices;
    const isShortAnswer = q.type === 'short_answer';
    const isOpenEnded = q.type === 'open_ended' || (!hasChoices && !isShortAnswer);

    if (isMultipleChoice) mcCount++;
    else if (isShortAnswer) shortAnswerCount++;
    else if (isOpenEnded) openEndedCount++;

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
      const opts = cleanOpts;
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
          <div class="sol-title"><i class="fa-solid fa-lightbulb"></i> Çözüm ve Açıklama:</div>
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
          <div class="sol-title"><i class="fa-solid fa-lightbulb"></i> Doğru / Beklenen Cevap:</div>
          <div class="sol-text"><strong>Model Cevap:</strong> ${escapeHtml(correctAns || q.explanation || 'Belirtilmemiş.')}</div>
        </div>`;
    } else {
      // Açık Uçlu (Klasik) Soru
      correctAns = String(q.correct_answer || '').trim();
      qTypeTag = 'Açık Uçlu';
      answerAreaHtml = `
        <div class="open-ended-answer-area">
          <div class="answer-lines-prompt"><i class="fa-solid fa-pen-nib"></i> <strong>Cevabınızı ve bilimsel gerekçenizi yazınız:</strong></div>
          <textarea class="student-text-input no-print" rows="4" placeholder="Açık uçlu cevabınızı ve bilimsel gerekçenizi buraya yazabilirsiniz..."></textarea>
          <div class="print-writing-lines only-print">
            <div class="write-line"></div>
            <div class="write-line"></div>
            <div class="write-line"></div>
            <div class="write-line"></div>
          </div>
        </div>`;

      solutionBoxHtml = `
        <div class="solution-box" style="display: none;">
          <div class="sol-title"><i class="fa-solid fa-lightbulb"></i> Beklenen Model Cevap & Değerlendirme Ölçütü (Rubrik):</div>
          <div class="sol-text">
            ${correctAns ? `<div style="margin-bottom:6px;"><strong>Model Cevap:</strong> ${escapeHtml(correctAns)}</div>` : ''}
            ${q.explanation ? `<div><strong>Bilimsel Açıklama:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
          </div>
        </div>`;
    }

    const typeDataAttr = isMultipleChoice ? 'multiple_choice' : (isShortAnswer ? 'short_answer' : 'open_ended');

    return `
      <div class="question-block" data-qid="${qNum}" data-type="${typeDataAttr}" data-correct="${escapeHtml(correctAns)}" data-explanation="${escapeHtml(q.explanation || '')}">
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
    const cleanOpts = normalizeOptions(q.options);
    const hasChoices = cleanOpts !== null;
    const isMultipleChoice = (q.type === 'multiple_choice' || (!q.type && hasChoices)) && hasChoices;
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
  const targetCategoryName = category === 'denemeler' ? 'Deneme Sınavları' : 'Test / Soru Bankası';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Rotalı Fenci</title>
  <link rel="icon" type="image/jpeg" href="/assets/rotali-fenci-logo.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      --brand-red: #e11d48;
      --brand-navy: #1e1b4b;
      --text: #0f172a;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --radius: 14px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.55;
      padding-bottom: 90px;
    }

    .test-wrapper {
      max-width: 960px;
      margin: 0 auto;
      padding: 20px 16px;
    }

    /* Üst Kontrol Barı */
    .top-actions-bar {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 18px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      position: sticky;
      top: 10px;
      z-index: 100;
    }

    .test-brand-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .test-brand-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--brand-red);
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(225, 29, 72, 0.25);
      flex-shrink: 0;
    }

    .test-brand-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .test-brand-texts {
      display: flex;
      flex-direction: column;
    }

    .test-brand-title {
      font-size: 15px;
      font-weight: 900;
      color: var(--brand-navy);
      line-height: 1.1;
      letter-spacing: -0.2px;
    }

    .test-brand-slogan {
      font-size: 11px;
      font-weight: 800;
      color: var(--brand-red);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 10px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-btn:hover {
      background: #e2e8f0;
      color: var(--primary);
    }

    .nav-btn-primary {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    .nav-btn-primary:hover {
      background: var(--primary-hover);
      color: #ffffff;
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 800;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-print {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #334155;
    }
    .btn-print:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .btn-fullscreen {
      background: #fdf4ff;
      border-color: #f0abfc;
      color: #a21caf;
    }
    .btn-fullscreen:hover {
      background: #fae8ff;
    }

    .btn-finish-primary {
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
      color: #ffffff;
      border-color: #9f1239;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);
    }
    .btn-finish-primary:hover {
      background: #be123c;
      transform: translateY(-1px);
    }

    .btn-reset {
      background: #fff1f2;
      border-color: #fecdd3;
      color: #e11d48;
    }
    .btn-reset:hover {
      background: #ffe4e6;
    }

    /* MEB Resmi Sınav Kâğıdı Başlığı */
    .exam-header-sheet {
      background: #ffffff;
      border: 2px solid #0f172a;
      border-radius: var(--radius);
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      font-family: 'Times New Roman', Times, serif !important;
    }

    .exam-header-sheet * {
      font-family: 'Times New Roman', Times, serif !important;
    }

    .sheet-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 14px;
      gap: 16px;
    }

    .sheet-logo-box {
      width: 76px;
      height: 76px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 2px solid #0f172a;
      overflow: hidden;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .sheet-logo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .meb-title-block {
      flex: 1;
      text-align: center;
    }

    .meb-title-block h1 {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      color: #000000;
      text-transform: uppercase;
    }

    .meb-title-block h2 {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .meb-title-block .exam-title-badge {
      display: inline-block;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      padding: 3px 14px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-top: 2px;
    }

    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px 18px;
      font-size: 14px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .info-label {
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
    }

    .info-line {
      flex: 1;
      border-bottom: 1px dotted #475569;
      height: 18px;
    }

    /* Canlı Puan & İlerleme Kartı */
    .live-score-card {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      color: #ffffff;
      padding: 16px 22px;
      border-radius: var(--radius);
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      box-shadow: 0 8px 24px rgba(30, 27, 75, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .score-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .score-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .score-val {
      font-size: 20px;
      font-weight: 900;
      line-height: 1.1;
    }

    .score-lbl {
      font-size: 11.5px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    /* Soru Blokları */
    .question-block {
      background: #ffffff;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 24px 28px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      position: relative;
      transition: all 0.2s ease;
    }

    .question-block:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }

    .q-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
    }

    .q-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      background: #f1f5f9;
      color: #0f172a;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.3px;
    }

    .q-type-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 6px;
      background: #e0f2fe;
      color: #0369a1;
    }

    .q-diff-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .q-diff-kolay { background: #dcfce7; color: #15803d; }
    .q-diff-orta { background: #fef3c7; color: #b45309; }
    .q-diff-zor { background: #fee2e2; color: #b91c1c; }

    .question-visual-box {
      margin-bottom: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
    }

    .question-visual-box svg {
      max-width: 100%;
      height: auto;
      max-height: 280px;
      display: inline-block;
    }

    .q-text {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 18px;
      line-height: 1.6;
      font-family: 'Times New Roman', Times, serif !important;
    }

    /* Çoktan Seçmeli Seçenekler */
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .opt-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Times New Roman', Times, serif !important;
    }

    .opt-label input[type="radio"] {
      display: none;
    }

    .opt-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1.5px solid #cbd5e1;
      transition: all 0.2s ease;
    }

    .opt-text {
      font-size: 15px;
      color: #1e293b;
      line-height: 1.5;
      padding-top: 2px;
      font-family: 'Times New Roman', Times, serif !important;
    }

    .opt-label:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }

    .opt-label.is-selected {
      border-color: var(--primary);
      background: #eef2ff;
    }
    .opt-label.is-selected .opt-circle {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    .opt-label.is-correct {
      border-color: #10b981 !important;
      background: #ecfdf5 !important;
    }
    .opt-label.is-correct .opt-circle {
      background: #10b981 !important;
      color: #ffffff !important;
      border-color: #10b981 !important;
    }

    .opt-label.is-wrong {
      border-color: #ef4444 !important;
      background: #fef2f2 !important;
    }
    .opt-label.is-wrong .opt-circle {
      background: #ef4444 !important;
      color: #ffffff !important;
      border-color: #ef4444 !important;
    }

    /* Açık Uçlu & Kısa Cevap Alanları */
    .short-answer-area {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;
      padding: 12px 16px;
      margin-top: 8px;
    }

    .short-ans-label {
      font-size: 14.5px;
      font-weight: 700;
      color: #334155;
      white-space: nowrap;
    }

    .student-short-input {
      flex: 1;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 14.5px;
      outline: none;
      background: #ffffff;
      font-family: 'Times New Roman', Times, serif !important;
      transition: all 0.2s ease;
    }

    .student-short-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .open-ended-answer-area {
      margin-top: 8px;
    }

    .answer-lines-prompt {
      font-size: 13.5px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .student-text-input {
      width: 100%;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14.5px;
      outline: none;
      background: #ffffff;
      resize: vertical;
      line-height: 1.6;
      font-family: 'Times New Roman', Times, serif !important;
      transition: all 0.2s ease;
    }

    .student-text-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .eval-input-correct {
      border-color: #10b981 !important;
      background: #f0fdf4 !important;
    }

    .eval-input-wrong {
      border-color: #ef4444 !important;
      background: #fef2f2 !important;
    }

    /* Değerlendirme Geri Bildirim Rozeti */
    .eval-feedback-badge {
      margin-top: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.3s ease;
    }

    .badge-correct {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .badge-wrong {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .badge-empty {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    /* Çözüm ve Açıklama Kutusu */
    .solution-box {
      margin-top: 16px;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 14px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sol-title {
      font-weight: 800;
      color: #1e40af;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sol-text {
      color: #1e293b;
      line-height: 1.6;
      font-family: 'Times New Roman', Times, serif !important;
    }

    /* Alt Tamamlama Banneri */
    .test-bottom-banner {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      color: #ffffff;
      border-radius: var(--radius);
      padding: 22px 28px;
      margin: 30px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 18px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .bottom-banner-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .banner-logo-img {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      flex-shrink: 0;
    }

    .banner-title {
      font-size: 18px;
      font-weight: 900;
      margin-bottom: 4px;
      color: #ffffff;
    }

    .banner-desc {
      font-size: 13.5px;
      color: #cbd5e1;
      max-width: 520px;
      line-height: 1.45;
    }

    .btn-banner-finish {
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
      color: #ffffff;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4);
      transition: all 0.25s ease;
    }

    .btn-banner-finish:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(225, 29, 72, 0.55);
      background: #be123c;
    }

    /* Sağ En Altta Sabit Yüzen "Testi Bitir" Butonu */
    .floating-finish-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    .btn-floating-finish {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
      color: #ffffff;
      border: 2.5px solid rgba(255, 255, 255, 0.4);
      border-radius: 9999px;
      padding: 8px 22px 8px 8px;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 12px 28px -4px rgba(220, 38, 38, 0.55), 0 6px 12px -2px rgba(0, 0, 0, 0.2);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .btn-floating-finish:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 16px 36px -4px rgba(220, 38, 38, 0.7), 0 8px 16px -2px rgba(0, 0, 0, 0.3);
      border-color: #ffffff;
    }

    .btn-floating-finish:active {
      transform: translateY(0) scale(0.98);
    }

    .finish-btn-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      background: #ffffff;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .finish-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .finish-btn-labels {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .finish-btn-main {
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1.1;
    }

    .finish-btn-sub {
      font-size: 11px;
      opacity: 0.92;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin-top: 2px;
    }

    .finish-pulse-ring {
      position: absolute;
      inset: -5px;
      border-radius: 9999px;
      border: 2px solid #ef4444;
      animation: finishPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
      pointer-events: none;
    }

    @keyframes finishPulse {
      0% { transform: scale(0.95); opacity: 0.85; }
      70% { transform: scale(1.15); opacity: 0; }
      100% { transform: scale(1.15); opacity: 0; }
    }

    /* Cevap Anahtarı Tablosu */
    .answer-key-section {
      background: #ffffff;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 20px 24px;
      margin-top: 30px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }

    .ak-title {
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ak-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
      gap: 10px;
    }

    .ak-cell {
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      background: #f8fafc;
    }

    .ak-q {
      display: block;
      background: #e2e8f0;
      color: #334155;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 0;
    }

    .ak-a {
      display: block;
      color: #0f172a;
      font-size: 15px;
      font-weight: 900;
      padding: 6px 0;
    }

    /* Sınav Kâğıdı Alt Bilgi & Filigran */
    .exam-sheet-footer {
      margin-top: 30px;
      padding-top: 14px;
      border-top: 1.5px dashed #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 12px;
      color: #64748b;
    }

    .footer-brand-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sheet-footer-logo {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--border);
    }

    /* ========================================================
       SONUÇ KARNESİ MODAL DİYALOGU
       ======================================================== */
    .result-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: modalFadeIn 0.25s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .result-modal-dialog {
      background: #ffffff;
      border-radius: 24px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid rgba(226, 232, 240, 0.8);
      position: relative;
    }

    @keyframes modalSlideUp {
      from { transform: translateY(30px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .result-modal-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      color: #ffffff;
      padding: 24px 24px 18px;
      text-align: center;
      position: relative;
    }

    .modal-logo-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid #ffffff;
      margin: 0 auto 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    }

    .modal-logo-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-title {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: -0.3px;
      margin-bottom: 2px;
    }

    .modal-subtitle {
      font-size: 13px;
      color: #cbd5e1;
      font-weight: 600;
    }

    .btn-close-modal {
      position: absolute;
      top: 14px;
      right: 16px;
      background: rgba(255,255,255,0.15);
      border: none;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-close-modal:hover {
      background: rgba(255,255,255,0.3);
    }

    .result-modal-body {
      padding: 22px 24px;
    }

    /* Puan Kahraman Kartı */
    .result-score-hero {
      display: flex;
      align-items: center;
      gap: 18px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 18px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .score-circle-outer {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35);
      color: #ffffff;
    }

    .score-circle-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
    }

    .score-number {
      font-size: 30px;
      font-weight: 900;
    }

    .score-max {
      font-size: 11px;
      opacity: 0.85;
      font-weight: 700;
    }

    .score-feedback {
      flex: 1;
    }

    .feedback-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      background: #dcfce7;
      color: #15803d;
      margin-bottom: 4px;
    }

    .feedback-text {
      font-size: 14.5px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.4;
    }

    /* İstatistik Kartları Grid */
    .result-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .stat-card {
      border-radius: 14px;
      padding: 12px 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
    }

    .stat-card .stat-icon {
      font-size: 16px;
      margin-bottom: 4px;
    }

    .stat-card .stat-num {
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 3px;
    }

    .stat-card .stat-name {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-total { background: #f1f5f9; border-color: #e2e8f0; color: #334155; }
    .stat-correct { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .stat-wrong { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
    .stat-empty { background: #fffbeb; border-color: #fde68a; color: #b45309; }

    /* İlerleme Çubuğu */
    .progress-bar-container {
      margin-bottom: 10px;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 6px;
    }

    .progress-track {
      height: 10px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Modal Alt Butonlar */
    .result-modal-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 16px 24px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-modal-action {
      flex: 1;
      min-width: 130px;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-review {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-review:hover {
      background: var(--primary-hover);
    }

    .btn-retry {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .btn-retry:hover {
      background: #e2e8f0;
    }

    .btn-pdf {
      background: #1e1b4b;
      color: #ffffff;
    }
    .btn-pdf:hover {
      background: #0f172a;
    }

    /* ========================================================
       YAZDIRMA (MEB A4 STANDARDI) STİLLERİ
       ======================================================== */
    .only-print { display: none !important; }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding-bottom: 0 !important;
      }

      .no-print, 
      .top-actions-bar, 
      .live-score-card, 
      .floating-finish-wrapper, 
      .test-bottom-banner,
      .result-modal-overlay {
        display: none !important;
      }

      .only-print {
        display: block !important;
      }

      .test-wrapper {
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .exam-header-sheet {
        box-shadow: none !important;
        border: 2px solid #000000 !important;
        padding: 14px 18px !important;
        margin-bottom: 18px !important;
        page-break-after: avoid !important;
      }

      .question-block {
        box-shadow: none !important;
        border: 1px solid #94a3b8 !important;
        padding: 14px 18px !important;
        margin-bottom: 14px !important;
        page-break-inside: avoid !important;
      }

      .question-block * {
        font-family: 'Times New Roman', Times, serif !important;
      }

      .opt-label {
        border: 1px solid #cbd5e1 !important;
        padding: 6px 12px !important;
      }

      .opt-circle {
        border-color: #000000 !important;
        color: #000000 !important;
      }

      .print-writing-lines {
        margin-top: 10px;
      }

      .write-line {
        height: 24px;
        border-bottom: 1px dotted #64748b;
      }

      .answer-key-section {
        box-shadow: none !important;
        border: 1px solid #000000 !important;
        page-break-before: auto !important;
      }
    }
  </style>
</head>
<body>

  <div class="test-wrapper">

    <!-- Üst Kontrol & Navigasyon Barı -->
    <div class="top-actions-bar no-print">
      <div class="test-brand-left">
        <div class="test-brand-avatar">
          <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotalı Fenci">
        </div>
        <div class="test-brand-texts">
          <span class="test-brand-title">Rotalı Fenci</span>
          <span class="test-brand-slogan">Rotamız Fen!</span>
        </div>
      </div>

      <div class="nav-links">
        <a href="/index.html#grade-${grade}/${targetCategoryHash}" class="nav-btn nav-btn-primary">
          <i class="fa-solid fa-arrow-left"></i> ${targetCategoryName}
        </a>
        <a href="/index.html" class="nav-btn">
          <i class="fa-solid fa-house"></i> Ana Sayfa
        </a>
      </div>

      <div class="action-group">
        <button type="button" onclick="toggleTestFullscreen()" class="btn-action btn-fullscreen" title="Tam Ekran Moduna Geç (F11)">
          <i class="fa-solid fa-expand"></i> <span>Tam Ekran</span>
        </button>
        <button type="button" onclick="window.print()" class="btn-action btn-print" title="MEB Standartlarında A4 Yazdır veya PDF İndir">
          <i class="fa-solid fa-print"></i> <span>Yazdır / PDF</span>
        </button>
        <button type="button" onclick="evaluateAllAnswers()" class="btn-action btn-finish-primary" id="btnEvaluate" title="Cevapları Kontrol Et ve Testi Bitir">
          <i class="fa-solid fa-flag-checkered"></i> <span>Testi Bitir</span>
        </button>
        <button type="button" onclick="toggleAllSolutions()" class="btn-action btn-print" id="btnToggleSolutions">
          <i class="fa-solid fa-lightbulb"></i> <span>Çözümleri Göster</span>
        </button>
        <button type="button" onclick="resetExam()" class="btn-action btn-reset" title="Sınavı Baştan Başlat">
          <i class="fa-solid fa-rotate-left"></i> <span>Sıfırla</span>
        </button>
      </div>
    </div>

    <!-- MEB Resmi Sınav Kâğıdı Başlığı -->
    <div class="exam-header-sheet">
      <div class="sheet-top-row">
        <div class="sheet-logo-box">
          <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotalı Fenci Amblem">
        </div>

        <div class="meb-title-block">
          <h1>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h1>
          <h2>${grade}. SINIF ${subject.toLocaleUpperCase('tr-TR')} DERSİ KAZANIM DEĞERLENDİRME SINAVI</h2>
          <div class="exam-title-badge">${safeTitle}</div>
        </div>

        <div class="sheet-logo-box">
          <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotamız Fen!">
        </div>
      </div>

      <div class="student-info-grid">
        <div class="info-item">
          <span class="info-label">Adı Soyadı:</span>
          <span class="info-line"></span>
        </div>
        <div class="info-item">
          <span class="info-label">Sınıfı / Şubesi:</span>
          <span class="info-line" style="max-width: 100px;"></span>
        </div>
        <div class="info-item">
          <span class="info-label">Okul Numarası:</span>
          <span class="info-line" style="max-width: 100px;"></span>
        </div>
        <div class="info-item">
          <span class="info-label">Tarih:</span>
          <span class="info-line" style="max-width: 120px;"></span>
        </div>
        <div class="info-item">
          <span class="info-label">Aldığı Not:</span>
          <span class="info-line" style="max-width: 80px;"></span>
        </div>
      </div>
    </div>

    <!-- Canlı Skor & İlerleme Paneli -->
    <div class="live-score-card no-print">
      <div class="score-item">
        <div class="score-icon"><i class="fa-solid fa-list-check"></i></div>
        <div>
          <div class="score-val" id="answeredCount">0 / ${qCount}</div>
          <div class="score-lbl">Cevaplanan Soru</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-icon" style="background: rgba(16, 185, 129, 0.35);"><i class="fa-solid fa-check"></i></div>
        <div>
          <div class="score-val" id="correctCount">0</div>
          <div class="score-lbl">Doğru</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-icon" style="background: rgba(239, 68, 68, 0.35);"><i class="fa-solid fa-xmark"></i></div>
        <div>
          <div class="score-val" id="wrongCount">0</div>
          <div class="score-lbl">Yanlış</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-icon" style="background: rgba(148, 163, 184, 0.35);"><i class="fa-solid fa-hourglass-half"></i></div>
        <div>
          <div class="score-val" id="emptyCount">${qCount}</div>
          <div class="score-lbl">Boş</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-icon" style="background: rgba(245, 158, 11, 0.35);"><i class="fa-solid fa-trophy"></i></div>
        <div>
          <div class="score-val" id="totalScore">0 Puan</div>
          <div class="score-lbl">Başarı Notu</div>
        </div>
      </div>
    </div>

    <!-- Soru Listesi -->
    <form id="examForm" onsubmit="return false;">
      ${questionsHtml}
    </form>

    <!-- Soru Listesi Altı Test Tamamlama Banneri -->
    <div class="test-bottom-banner no-print">
      <div class="bottom-banner-brand">
        <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotalı Fenci" class="banner-logo-img">
        <div>
          <h3 class="banner-title">Sınavınızı Tamamladınız mı?</h3>
          <p class="banner-desc">Doğru ve yanlış sayılarınızı, başarı puanınızı ve detaylı model çözümleri görmek için testi bitiriniz.</p>
        </div>
      </div>
      <button type="button" onclick="evaluateAllAnswers()" class="btn-banner-finish">
        <i class="fa-solid fa-flag-checkered"></i> Testi Bitir ve Değerlendir
      </button>
    </div>

    <!-- Cevap Anahtarı -->
    <div class="answer-key-section">
      <div class="ak-title">
        <i class="fa-solid fa-key" style="color: var(--primary);"></i>
        <span>Cevap Anahtarı</span>
      </div>
      <div class="ak-grid">
        ${answerKeyCells}
      </div>
    </div>

    <!-- Sayfa Sonu Filigranı -->
    <div class="exam-sheet-footer">
      <div class="footer-brand-info">
        <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotalı Fenci Logo" class="sheet-footer-logo">
        <span><strong>Rotalı Fenci</strong> — Rotamız Fen! MEB Maarif Modeli Soru & Değerlendirme Sistemi</span>
      </div>
      <div>
        <span>www.rotalifenci.com</span>
      </div>
    </div>

  </div>

  <!-- Sağ En Altta Sabit Yüzen "Testi Bitir" Butonu -->
  <div class="floating-finish-wrapper no-print">
    <button type="button" onclick="evaluateAllAnswers()" class="btn-floating-finish" id="btnFloatingFinish" title="Testi Bitir ve Doğru/Yanlış Sayılarını Gör">
      <div class="finish-btn-avatar">
        <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Logo" class="finish-avatar-img">
      </div>
      <div class="finish-btn-labels">
        <span class="finish-btn-main"><i class="fa-solid fa-flag-checkered"></i> Testi Bitir</span>
        <span class="finish-btn-sub">Sonucumu Gör</span>
      </div>
      <span class="finish-pulse-ring"></span>
    </button>
  </div>

  <!-- Sınav Sonuç Karnesi Modalı -->
  <div id="resultModal" class="result-modal-overlay" style="display: none;" onclick="if(event.target===this) closeResultModal();">
    <div class="result-modal-dialog">
      <div class="result-modal-header">
        <div class="modal-logo-circle">
          <img src="/assets/rotali-fenci-logo.jpg" onerror="this.src='../assets/rotali-fenci-logo.jpg'" alt="Rotalı Fenci" class="modal-logo-img">
        </div>
        <h2 class="modal-title">Sınav Değerlendirme Karnesi</h2>
        <p class="modal-subtitle">Rotalı Fenci • Rotamız Fen! Başarı Raporu</p>
        <button type="button" class="btn-close-modal" onclick="closeResultModal()">&times;</button>
      </div>
      
      <div class="result-modal-body">
        <!-- Puan Kahraman Kartı -->
        <div class="result-score-hero" id="modalScoreHero">
          <div class="score-circle-outer">
            <div class="score-circle-inner">
              <span class="score-number" id="modalScoreVal">0</span>
              <span class="score-max">/ 100</span>
            </div>
          </div>
          <div class="score-feedback">
            <div class="feedback-badge" id="modalFeedbackBadge">Tebrikler!</div>
            <div class="feedback-text" id="modalFeedbackText">Test başarıyla tamamlandı.</div>
          </div>
        </div>

        <!-- 4'lü İstatistik Kartları -->
        <div class="result-stats-grid">
          <div class="stat-card stat-total">
            <div class="stat-icon"><i class="fa-solid fa-list-check"></i></div>
            <div class="stat-num" id="modalTotalQ">0</div>
            <div class="stat-name">Toplam Soru</div>
          </div>
          <div class="stat-card stat-correct">
            <div class="stat-icon"><i class="fa-solid fa-check"></i></div>
            <div class="stat-num" id="modalCorrectQ">0</div>
            <div class="stat-name">Doğru</div>
          </div>
          <div class="stat-card stat-wrong">
            <div class="stat-icon"><i class="fa-solid fa-xmark"></i></div>
            <div class="stat-num" id="modalWrongQ">0</div>
            <div class="stat-name">Yanlış</div>
          </div>
          <div class="stat-card stat-empty">
            <div class="stat-icon"><i class="fa-solid fa-hourglass-half"></i></div>
            <div class="stat-num" id="modalEmptyQ">0</div>
            <div class="stat-name">Boş</div>
          </div>
        </div>

        <!-- Başarı Oranı İlerleme Çubuğu -->
        <div class="progress-bar-container">
          <div class="progress-labels">
            <span>Kazanım Başarı Oranı</span>
            <span id="modalPercentLabel">%0</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" id="modalProgressFill" style="width: 0%;"></div>
          </div>
        </div>
      </div>

      <div class="result-modal-footer">
        <button type="button" onclick="closeResultModal()" class="btn-modal-action btn-review">
          <i class="fa-solid fa-magnifying-glass"></i> Çözümleri İncele
        </button>
        <button type="button" onclick="resetExam(); closeResultModal();" class="btn-modal-action btn-retry">
          <i class="fa-solid fa-rotate-left"></i> Yeniden Başlat
        </button>
        <button type="button" onclick="window.print()" class="btn-modal-action btn-pdf">
          <i class="fa-solid fa-print"></i> Kâğıdı Yazdır
        </button>
      </div>
    </div>
  </div>

  <script>
    let solutionsVisible = false;

    // Tam Ekran Aç / Kapat
    function toggleTestFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Tam ekran hatası:', err.message);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    // Seçenek tıklama dinleyicileri
    document.querySelectorAll('.opt-label').forEach(label => {
      label.addEventListener('click', function(e) {
        const block = this.closest('.question-block');
        if (!block) return;
        block.querySelectorAll('.opt-label').forEach(l => l.classList.remove('is-selected'));
        this.classList.add('is-selected');
        updateAnswerProgress();
      });
    });

    // Yazı kutusu dinleyicileri
    document.querySelectorAll('.student-short-input, .student-text-input').forEach(input => {
      input.addEventListener('input', function() {
        updateAnswerProgress();
      });
    });

    function updateAnswerProgress() {
      const blocks = document.querySelectorAll('.question-block');
      let answered = 0;
      blocks.forEach(b => {
        const type = b.getAttribute('data-type');
        if (type === 'multiple_choice') {
          if (b.querySelector('input[type="radio"]:checked')) answered++;
        } else if (type === 'short_answer') {
          const input = b.querySelector('.student-short-input');
          if (input && input.value.trim().length > 0) answered++;
        } else {
          const area = b.querySelector('.student-text-input');
          if (area && area.value.trim().length > 0) answered++;
        }
      });
      const answeredEl = document.getElementById('answeredCount');
      if (answeredEl) answeredEl.innerText = answered + ' / ' + blocks.length;
    }

    // Türkçe Harf & Kelime Normalizasyonu
    function normalizeAnswerText(text) {
      if (!text) return "";
      const trMap = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i', 'I': 'i',
        'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
      };
      let clean = String(text).trim().toLowerCase();
      clean = clean.split('').map(c => trMap[c] || c).join('');
      clean = clean.replace(/[^a-z0-9]/g, ' ');
      clean = clean.replace(/\\b(dir|tir|dur|tur|dur|dur|dır|tır|dür|tür)\\b/g, '');
      clean = clean.replace(/\\s+/g, ' ').trim();
      return clean;
    }

    // ========================================================
    // TESTİ BİTİR VE TÜM SORULARI DEĞERLENDİR
    // ========================================================
    function evaluateAllAnswers() {
      const blocks = document.querySelectorAll('.question-block');
      let correct = 0;
      let wrong = 0;
      let empty = 0;

      // Eski geribildirimleri temizle
      document.querySelectorAll('.eval-feedback-badge').forEach(b => b.remove());

      blocks.forEach(block => {
        const qType = block.getAttribute('data-type');
        const correctAns = (block.getAttribute('data-correct') || '').trim();
        const explanation = block.getAttribute('data-explanation') || '';
        let isQCorrect = false;
        let isQEmpty = false;

        if (qType === 'multiple_choice') {
          const checked = block.querySelector('input[type="radio"]:checked');
          const labels = block.querySelectorAll('.opt-label');

          labels.forEach(l => {
            l.classList.remove('is-correct', 'is-wrong');
            const opt = l.getAttribute('data-opt');
            if (opt === correctAns.toUpperCase()) {
              l.classList.add('is-correct');
            }
          });

          if (!checked) {
            isQEmpty = true;
          } else {
            const userVal = checked.value.toUpperCase();
            if (userVal === correctAns.toUpperCase()) {
              isQCorrect = true;
            } else {
              const userLabel = block.querySelector('.opt-label[data-opt="' + userVal + '"]');
              if (userLabel) userLabel.classList.add('is-wrong');
            }
          }
        } else if (qType === 'short_answer') {
          const input = block.querySelector('.student-short-input');
          const val = input ? input.value.trim() : '';

          if (!val) {
            isQEmpty = true;
          } else {
            const normUser = normalizeAnswerText(val);
            const normCorrect = normalizeAnswerText(correctAns);
            
            const alternatives = correctAns.split(/[\/,;]/).map(a => normalizeAnswerText(a)).filter(Boolean);
            if (alternatives.length === 0) alternatives.push(normCorrect);

            isQCorrect = alternatives.some(alt => {
              if (!alt) return false;
              return normUser === alt || 
                     normUser.includes(alt) || 
                     alt.includes(normUser) ||
                     (alt.length >= 4 && normUser.startsWith(alt.substring(0, Math.min(alt.length - 1, 5))));
            });

            if (input) {
              input.classList.remove('eval-input-correct', 'eval-input-wrong');
              input.classList.add(isQCorrect ? 'eval-input-correct' : 'eval-input-wrong');
            }
          }
        } else {
          // Açık Uçlu (Klasik) Soru
          const textarea = block.querySelector('.student-text-input');
          const val = textarea ? textarea.value.trim() : '';

          if (!val) {
            isQEmpty = true;
          } else {
            const normUser = normalizeAnswerText(val);
            const normCorrect = normalizeAnswerText(correctAns);
            const normExpl = normalizeAnswerText(explanation);

            const keywords = (normCorrect + ' ' + normExpl)
              .split(' ')
              .map(w => w.trim())
              .filter(w => w.length >= 4 && !['ve', 'ile', 'veya', 'icin', 'gibi', 'olan', 'olarak', 'daha', 'kadar', 'gore'].includes(w));
            
            const matchedKeywords = keywords.filter(k => normUser.includes(k));
            const matchRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0;

            if (matchedKeywords.length >= 2 || matchRatio >= 0.25 || normUser.includes(normCorrect) || (normCorrect.length > 3 && normCorrect.split(' ').some(w => w.length >= 4 && normUser.includes(w)))) {
              isQCorrect = true;
            } else {
              isQCorrect = false;
            }

            if (textarea) {
              textarea.classList.remove('eval-input-correct', 'eval-input-wrong');
              textarea.classList.add(isQCorrect ? 'eval-input-correct' : 'eval-input-wrong');
            }
          }
        }

        // Rozet ekleme
        const badge = document.createElement('div');
        badge.className = 'eval-feedback-badge ' + (isQEmpty ? 'badge-empty' : (isQCorrect ? 'badge-correct' : 'badge-wrong'));
        if (isQEmpty) {
          empty++;
          badge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <strong>Boş Bırakıldı:</strong> Bu soruya yanıt verilmedi.';
        } else if (isQCorrect) {
          correct++;
          badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Tebrikler, Doğru!</strong> Cevabınız kazanım ölçütlerine uygundur.';
        } else {
          wrong++;
          badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <strong>Yanlış / Eksik:</strong> Doğru/Beklenen Model Cevap: <em>' + (correctAns || 'Aşağıdaki çözümü inceleyiniz.') + '</em>';
        }

        const targetArea = block.querySelector('.question-text-and-options') || block;
        targetArea.appendChild(badge);
      });

      const total = blocks.length;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      // Üst Canlı Paneli Güncelle
      const cEl = document.getElementById('correctCount');
      const wEl = document.getElementById('wrongCount');
      const eEl = document.getElementById('emptyCount');
      const sEl = document.getElementById('totalScore');
      const aEl = document.getElementById('answeredCount');
      if (cEl) cEl.innerText = correct;
      if (wEl) wEl.innerText = wrong;
      if (eEl) eEl.innerText = empty;
      if (sEl) sEl.innerText = score + ' Puan';
      if (aEl) aEl.innerText = (correct + wrong) + ' / ' + total;

      // Çözümleri otomatik göster
      showAllSolutions();

      // Sonuç Modalı Göster
      showResultModal({
        total: total,
        correct: correct,
        wrong: wrong,
        empty: empty,
        score: score
      });
    }

    function showResultModal(data) {
      document.getElementById('modalTotalQ').innerText = data.total;
      document.getElementById('modalCorrectQ').innerText = data.correct;
      document.getElementById('modalWrongQ').innerText = data.wrong;
      document.getElementById('modalEmptyQ').innerText = data.empty;
      document.getElementById('modalScoreVal').innerText = data.score;
      document.getElementById('modalPercentLabel').innerText = '%' + data.score;
      document.getElementById('modalProgressFill').style.width = data.score + '%';

      const badgeEl = document.getElementById('modalFeedbackBadge');
      const textEl = document.getElementById('modalFeedbackText');

      if (data.score >= 85) {
        badgeEl.innerText = '🌟 MÜKEMMEL BAŞARI!';
        badgeEl.style.background = '#dcfce7';
        badgeEl.style.color = '#15803d';
        textEl.innerText = 'Harika bir performans! Konu kazanımlarını eksiksiz kavramışsınız.';
      } else if (data.score >= 70) {
        badgeEl.innerText = '👍 ÇOK İYİ!';
        badgeEl.style.background = '#dbeafe';
        badgeEl.style.color = '#1d4ed8';
        textEl.innerText = 'Tebrikler, gayet başarılısınız! Yanlış yaptığınız soruların çözümlerini inceleyerek bilgilerinizi pekiştiriniz.';
      } else if (data.score >= 50) {
        badgeEl.innerText = '📖 GELİŞTİRİLEBİLİR!';
        badgeEl.style.background = '#fef3c7';
        badgeEl.style.color = '#b45309';
        textEl.innerText = 'Temel kavramlara hakimsiniz fakat bazı ayrıntıları tekrar etmenizde fayda var.';
      } else {
        badgeEl.innerText = '💡 TEKRAR YAPMALISINIZ!';
        badgeEl.style.background = '#fee2e2';
        badgeEl.style.color = '#b91c1c';
        textEl.innerText = 'Ünite konu anlatımına ve ders notlarına göz atıp testi tekrar çözmenizi öneririz.';
      }

      document.getElementById('resultModal').style.display = 'flex';
    }

    function closeResultModal() {
      document.getElementById('resultModal').style.display = 'none';
    }

    // Çözümleri Aç / Kapat
    function toggleAllSolutions() {
      solutionsVisible = !solutionsVisible;
      const boxes = document.querySelectorAll('.solution-box');
      boxes.forEach(b => {
        b.style.display = solutionsVisible ? 'block' : 'none';
      });
      const btn = document.getElementById('btnToggleSolutions');
      if (btn) {
        btn.innerHTML = solutionsVisible 
          ? '<i class="fa-solid fa-eye-slash"></i> <span>Çözümleri Gizle</span>'
          : '<i class="fa-solid fa-lightbulb"></i> <span>Çözümleri Göster</span>';
      }
    }

    function showAllSolutions() {
      solutionsVisible = true;
      document.querySelectorAll('.solution-box').forEach(b => b.style.display = 'block');
      const btn = document.getElementById('btnToggleSolutions');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Çözümleri Gizle</span>';
      }
    }

    // Sınavı Sıfırla
    function resetExam() {
      document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      document.querySelectorAll('.student-text-input, .student-short-input').forEach(i => {
        i.value = '';
        i.classList.remove('eval-input-correct', 'eval-input-wrong');
      });
      document.querySelectorAll('.opt-label').forEach(l => l.classList.remove('is-selected', 'is-correct', 'is-wrong'));
      document.querySelectorAll('.solution-box').forEach(b => b.style.display = 'none');
      document.querySelectorAll('.eval-feedback-badge').forEach(b => b.remove());
      solutionsVisible = false;

      const cEl = document.getElementById('correctCount');
      const wEl = document.getElementById('wrongCount');
      const eEl = document.getElementById('emptyCount');
      const sEl = document.getElementById('totalScore');
      const aEl = document.getElementById('answeredCount');
      const total = document.querySelectorAll('.question-block').length;
      if (cEl) cEl.innerText = '0';
      if (wEl) wEl.innerText = '0';
      if (eEl) eEl.innerText = total;
      if (sEl) sEl.innerText = '0 Puan';
      if (aEl) aEl.innerText = '0 / ' + total;

      const btn = document.getElementById('btnToggleSolutions');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> <span>Çözümleri Göster</span>';
      }
    }
  </script>
</body>
</html>`;
}

module.exports = {
  buildInteractiveTestHtml,
  generateSlug,
  normalizeOptions
};
