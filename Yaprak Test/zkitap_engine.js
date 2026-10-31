/**
 * Z-Kitap Soru Gösterim Motoru Şablonu
 * 
 * Türkiye Yüzyılı Maarif Modeli ve Z-Kitap Standartlarına Uygun:
 * - Tek Soru Tek Ekran (Kaydırmasız, 1920x1080 & Akıllı Tahta Uyumlu)
 * - Saf Beyaz Arka Plan (#ffffff), Yüksek Kontrastlı Siyah Yazılar (#0f172a / #000000)
 * - Gereksiz kartlar, neon çizgiler ve kutular kaldırılmış, kitap baskısı sadeliğinde
 * - İki Gösterim Modu: 📖 Z-Kitap Modu (Tam Ekran Soru) ⇄ ✍️ Çözüm Modu (Sol %60 / Sağ %40)
 * - A- / A+ Yazı Boyutu Zoom Kontrolleri
 * - Büyük Canlı Kronometre (Zaman ilerleme / duraklatma özellikli) + Soru Sayacı
 * - Sağ Üstte Büyük ve Kolay Tıklanabilir Önceki / Sonraki Butonları
 * - Klavye (Sol/Sağ Ok Tuşları), Dokunmatik Swipe ve 16:9 Tam Ekran (⛶) Desteği
 */

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatQuestionStem(rawText, qNum) {
  let text = String(rawText || '').trim();
  // Strip redundant "Soru X:" prefixes if already in text
  text = text.replace(/^Soru\s*\d+\s*[:.-]\s*/i, '');
  // Underline keywords commonly underlined in MEB exams (değildir, olamaz, kesinlikle, vb.)
  const keywordsToUnderline = [
    'değildir', 'degildir', 'olamaz', 'ulaşılamaz', 'ulasilamaz', 'söylenemez',
    'soylenemez', 'kesinlikle', 'en fazladır', 'en azdır', 'yanlıştır', 'dogru degildir',
    'beklenmez', 'gösterilemez', 'gosterilemez'
  ];
  keywordsToUnderline.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'gi');
    text = text.replace(reg, '<u>$1</u>');
  });
  return text;
}

function buildZKitapHtml({
  title,
  grade = "5",
  unit = "1. Ünite: Gökyüzündeki Komşularımız ve Biz",
  subject = "Fen Bilimleri",
  questions = [],
  logoSrc = '/assets/rotali-fenci-logo.jpg'
}) {
  const safeTitle = escapeHtml(title || `${grade}. Sınıf ${subject} Soru Çözümü`);
  const safeUnit = escapeHtml(unit);
  const qCount = questions.length;

  const slidesHtml = questions.map((q, idx) => {
    const qNum = idx + 1;
    const isMultipleChoice = q.options && Object.keys(q.options).length > 0 && q.options.A;
    const isShortAnswer = q.type === 'short_answer';
    const isOpenEnded = q.type === 'open_ended' || (!isMultipleChoice && !isShortAnswer);

    const correctAns = String(q.correct_answer || '').trim();
    const formattedStem = formatQuestionStem(q.question, qNum);
    const stemLength = formattedStem.length;

    // Otomatik yazı boyutu sınıfı
    let stemSizeClass = 'zk-size-large';
    if (stemLength > 280) {
      stemSizeClass = 'zk-size-compact';
    } else if (stemLength > 140) {
      stemSizeClass = 'zk-size-medium';
    }

    // Seçenekler (Z-Kitap alt alta şık görünümü)
    let optionsHtml = '';
    if (isMultipleChoice) {
      const opts = q.options;
      const letters = ['A', 'B', 'C', 'D'];
      optionsHtml = `
        <div class="zk-options-list" data-qid="${qNum}">
          ${letters.map(let => `
            <div class="zk-option-item" data-qid="${qNum}" data-opt="${let}" onclick="selectSlideOption(${qNum}, '${let}')">
              <span class="zk-opt-letter">${let})</span>
              <span class="zk-opt-text">${escapeHtml(opts[let] || '')}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Sağ Kolon Çözüm / Cevap Paneli (Mod 2 için)
    let rightPanelContent = '';
    if (isMultipleChoice) {
      rightPanelContent = `
        <div class="zk-answer-panel">
          <div class="zk-panel-header">
            <h3>✍️ ÖĞRENCİ CEVABI</h3>
            <span class="zk-panel-hint">Şıkkı işaretleyiniz</span>
          </div>
          <div class="zk-choice-buttons">
            ${['A', 'B', 'C', 'D'].map(let => `
              <button type="button" class="zk-choice-btn" data-qid="${qNum}" data-opt="${let}" onclick="selectSlideOption(${qNum}, '${let}')">
                <span class="zk-choice-circle">${let}</span>
                <span class="zk-choice-label">${let} Şıkkı</span>
              </button>
            `).join('')}
          </div>
          <div class="zk-notes-box">
            <label class="zk-notes-label">📝 Çözüm Notları / İşlem Alanı:</label>
            <textarea class="zk-notes-textarea" id="notes-q-${qNum}" rows="4" placeholder="Buraya soruyla ilgili notlarınızı alabilirsiniz..."></textarea>
          </div>
        </div>
      `;
    } else if (isShortAnswer) {
      rightPanelContent = `
        <div class="zk-answer-panel">
          <div class="zk-panel-header">
            <h3>✍️ CEVABINIZ</h3>
            <span class="zk-panel-hint">Kısa Cevap</span>
          </div>
          <div class="zk-input-box">
            <input type="text" class="zk-short-input" id="input-q-${qNum}" name="f${qNum}-${Math.random().toString(36).slice(2, 8)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" placeholder="Kısa cevabınızı buraya yazınız..." oninput="recordAnswer(${qNum}, this.value)">
          </div>
          <div class="zk-notes-box" style="margin-top: 16px;">
            <label class="zk-notes-label">📝 Öğretmen / Çözüm Notu:</label>
            <textarea class="zk-notes-textarea" id="notes-q-${qNum}" rows="4" placeholder="Çözüm basamakları ve açıklamalar..."></textarea>
          </div>
        </div>
      `;
    } else {
      rightPanelContent = `
        <div class="zk-answer-panel">
          <div class="zk-panel-header">
            <h3>✍️ CEVABINIZ</h3>
            <span class="zk-panel-hint">Açık Uçlu / Bilimsel Gerekçe</span>
          </div>
          <div class="zk-textarea-box">
            <textarea class="zk-open-textarea" id="input-q-${qNum}" name="f${qNum}-${Math.random().toString(36).slice(2, 8)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" rows="6" placeholder="Açık uçlu bilimsel cevabınızı ve gerekçenizi buraya yazınız..." oninput="recordAnswer(${qNum}, this.value)"></textarea>
          </div>
        </div>
      `;
    }

    // Soru Görseli / Şekli (Varsa)
    let visualHtml = '';
    if (q.visual_svg && q.visual_svg.trim()) {
      const vSvg = q.visual_svg.trim();
      const isPlaceholder = />\s*Soru\s*\d+\s*<\/text>/.test(vSvg) && vSvg.length < 700;
      if (!isPlaceholder) {
        visualHtml = `<div class="zk-visual-container">${vSvg}</div>`;
      }
    }

    // Kısa Cevap / Açık Uçlu için Z-Kitap modunda soru altında görünen sade giriş kutusu
    let inlineAnswerHtml = '';
    if (isShortAnswer) {
      inlineAnswerHtml = `
        <div class="zk-inline-short-box">
          <span class="zk-inline-label">✍️ Cevabınız:</span>
          <input type="text" class="zk-inline-input" id="inline-q-${qNum}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Cevabınızı buraya yazınız..." oninput="syncInlineAnswer(${qNum}, this.value)">
        </div>
      `;
    } else if (isOpenEnded) {
      inlineAnswerHtml = `
        <div class="zk-inline-open-box">
          <span class="zk-inline-label">✍️ Cevabınız ve Açıklamanız:</span>
          <textarea class="zk-inline-textarea" id="inline-q-${qNum}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" rows="3" placeholder="Bilimsel açıklamanızı buraya yazınız..." oninput="syncInlineAnswer(${qNum}, this.value)"></textarea>
        </div>
      `;
    }

    return `
      <section class="zk-slide-section ${idx === 0 ? 'is-active' : ''}" id="zk-slide-${idx}" data-slide-index="${idx}" style="${idx === 0 ? 'display: block;' : 'display: none;'}">
        <div class="zk-slide-grid">
          <!-- Sol Sütun (Soru, Görsel ve Seçenekler - Z-Kitap Modunda %100) -->
          <div class="zk-col-left">
            <div class="zk-question-card">
              <div class="zk-question-header">
                <span class="zk-qnum-tag">${qNum}. Soru</span>
              </div>
              
              ${visualHtml}
              
              <div class="zk-question-stem ${stemSizeClass}">
                ${formattedStem}
              </div>

              ${optionsHtml}
              ${inlineAnswerHtml}

              <!-- Çözüm & Doğru Cevap (Sınav bittiğinde görünür) -->
              <div class="zk-solution-box" id="solution-box-${qNum}" style="display: none;">
                <div class="zk-solution-badge">💡 ÇÖZÜM &amp; DOĞRU CEVAP</div>
                <div class="zk-solution-text">
                  <strong>Doğru Cevap:</strong> <span class="zk-correct-val">${escapeHtml(correctAns)}</span>
                  ${q.explanation ? `<p class="zk-expl-text">${escapeHtml(q.explanation)}</p>` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Sağ Sütun (Etkileşimli Çözüm Modunda %40 - Z-Kitap Modunda Gizli) -->
          <div class="zk-col-right">
            ${rightPanelContent}
          </div>
        </div>
      </section>
    `;
  }).join('\n');

  const drawerItemsHtml = questions.map((q, idx) => {
    return `<button type="button" class="zk-route-item ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})">${idx + 1}. Soru</button>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${safeTitle} - Rotalı Fenci Z-Kitap</title>
  <link rel="icon" type="image/jpeg" href="/assets/rotali-fenci-logo.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* ========================================================
       📖 ROTALI FENCİ – Z-KİTAP AKILLI TAHTA MODU
       ======================================================== */
    :root {
      --zk-bg: #ffffff;
      --zk-text: #0f172a;
      --zk-text-muted: #475569;
      --zk-border: #e2e8f0;
      --zk-primary: #0284c7;
      --zk-primary-dark: #0369a1;
      --zk-orange: #ea580c;
      --zk-orange-dark: #c2410c;
      --zk-font-scale: 1.0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      background: var(--zk-bg);
      color: var(--zk-text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: text;
    }

    body {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* 📌 1. ÜST KONTROL ÇUBUĞU (Z-KİTAP TOOLBAR) */
    .zk-topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 24px;
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      flex-shrink: 0;
    }

    .zk-topbar-left, .zk-topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .zk-brand-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
    }
    .zk-brand-logo {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2px solid #e11d48;
      object-fit: cover;
    }
    .zk-brand-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: -0.2px;
      color: #0f172a;
    }

    .zk-unit-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 8px;
      background: #f1f5f9;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #cbd5e1;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* ⏱️ CANLI BÜYÜK KRONOMETRE & ZAMAN İLERLEME BUTONU */
    .zk-timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 12px;
      background: #eff6ff;
      border: 1.5px solid #93c5fd;
      color: #1e40af;
      font-family: 'Outfit', monospace;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
      transition: all 0.2s ease;
      user-select: none;
    }
    .zk-timer-badge:hover {
      background: #dbeafe;
      border-color: #60a5fa;
      transform: translateY(-1px);
    }
    .zk-timer-badge.is-paused {
      background: #fef3c7 !important;
      border-color: #fcd34d !important;
      color: #92400e !important;
    }
    .zk-timer-badge.timer-urgent {
      background: #fee2e2 !important;
      border-color: #f87171 !important;
      color: #991b1b !important;
      animation: pulseAlert 1s infinite;
    }
    @keyframes pulseAlert {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    .zk-timer-state-icon {
      font-size: 14px;
      opacity: 0.7;
    }

    /* Soru Sayacı */
    .zk-counter-pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      color: #0f172a;
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 900;
      white-space: nowrap;
    }

    /* Yazı Boyutu A- / A+ Butonları */
    .zk-font-controls {
      display: inline-flex;
      align-items: center;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      background: #f8fafc;
    }
    .zk-btn-font {
      background: transparent;
      border: none;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 800;
      color: #334155;
      cursor: pointer;
      transition: background 0.15s;
    }
    .zk-btn-font:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .zk-btn-font:first-child {
      border-right: 1px solid #cbd5e1;
    }

    /* Z-Kitap / Çözüm Modu Geçiş Butonu */
    .zk-mode-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 10px;
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      color: #1e293b;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .zk-mode-btn:hover {
      background: #e0f2fe;
      border-color: #38bdf8;
      color: #0284c7;
    }

    /* Sağ Üst Önceki / Sonraki Butonları */
    .zk-nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
      border: none;
      transition: all 0.18s ease;
      white-space: nowrap;
      user-select: none;
    }
    .zk-prev-btn {
      background: #1e293b;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(30, 41, 59, 0.2);
    }
    .zk-prev-btn:hover:not(:disabled) {
      background: #0f172a;
      transform: translateY(-1px);
    }
    .zk-next-btn {
      background: #ea580c;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
    }
    .zk-next-btn:hover:not(:disabled) {
      background: #c2410c;
      transform: translateY(-1px);
    }
    .zk-nav-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Tam Ekran & Bitir Butonları */
    .zk-btn-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      color: #334155;
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .zk-btn-icon:hover {
      background: #e0f2fe;
      border-color: #0284c7;
      color: #0284c7;
    }

    .zk-finish-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border-radius: 10px;
      background: #10b981;
      border: none;
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .zk-finish-btn:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    /* 📌 2. ANA SAHNE & SLAYT ALANI (TEK SORU - TEK EKRAN) */
    .zk-main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #ffffff;
      width: 100%;
      max-width: 1540px;
      margin: 0 auto;
      padding: 24px 32px 80px 32px;
      min-height: calc(100vh - 130px);
    }

    .zk-slide-section {
      width: 100%;
      height: 100%;
      display: none;
    }
    .zk-slide-section.is-active {
      display: block !important;
    }

    /* Grid Yapısı: Mod 1 (Z-Kitap) ve Mod 2 (Çözüm) */
    .zk-slide-grid {
      display: grid;
      width: 100%;
      min-width: 0;
      gap: 32px;
      transition: all 0.3s ease;
    }

    /* 📖 MOD 1: Z-KİTAP TAM EKRAN (Varsayılan) */
    body.zk-mode-zkitap .zk-slide-grid {
      grid-template-columns: 100% !important;
      max-width: 1200px;
      margin: 0 auto;
    }
    body.zk-mode-zkitap .zk-col-right {
      display: none !important;
    }

    /* ✍️ MOD 2: ETKİLEŞİMLİ ÇÖZÜM MODU (Sol %60 Soru / Sağ %40 Cevap) */
    body.zk-mode-interactive .zk-slide-grid {
      grid-template-columns: 60% 40% !important;
      align-items: start;
    }
    body.zk-mode-interactive .zk-col-right {
      display: block !important;
    }

    /* Sol Sütun (Soru Kartı - Sade Kitap Baskısı) */
    .zk-col-left {
      width: 100%;
      min-width: 0;
    }

    .zk-question-card {
      background: #ffffff;
      border: none;
      padding: 0;
      width: 100%;
    }

    .zk-question-header {
      margin-bottom: 12px;
    }
    .zk-qnum-tag {
      display: inline-block;
      font-size: 15px;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Soru Görseli / Şekli */
    .zk-visual-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 14px 0 20px 0;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px;
      max-height: 40vh;
      overflow: hidden;
    }
    .zk-visual-container svg, .zk-visual-container img {
      max-width: 100%;
      max-height: 38vh;
      height: auto;
      object-fit: contain;
    }

    /* 📖 Soru Kökü (1. Görseldeki Gibi Büyük, Siyah, Net ve Yüksek Kontrastlı) */
    .zk-question-stem {
      color: #000000;
      font-weight: 800;
      line-height: 1.55;
      letter-spacing: -0.2px;
      margin-bottom: 24px;
      word-break: break-word;
    }
    .zk-question-stem u {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2.5px;
    }
    .zk-size-large {
      font-size: calc(30px * var(--zk-font-scale, 1.0));
    }
    .zk-size-medium {
      font-size: calc(26px * var(--zk-font-scale, 1.0));
    }
    .zk-size-compact {
      font-size: calc(22px * var(--zk-font-scale, 1.0));
      line-height: 1.5;
    }

    /* 📖 Çoktan Seçmeli Seçenekler (1. Görsel Referansı: A, B, C, D Alt Alta, Geniş ve Ferah) */
    .zk-options-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    .zk-option-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 20px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.15s ease;
      color: #0f172a;
      font-size: calc(22px * var(--zk-font-scale, 1.0));
      line-height: 1.5;
      user-select: none;
    }
    .zk-option-item:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .zk-option-item.is-selected {
      background: #eff6ff !important;
      border-color: #2563eb !important;
      color: #1e3a8a !important;
      box-shadow: 0 0 0 1.5px #2563eb;
    }
    .zk-opt-letter {
      font-weight: 900;
      color: #1e293b;
      min-width: 32px;
      flex-shrink: 0;
    }
    .zk-option-item.is-selected .zk-opt-letter {
      color: #2563eb;
    }
    .zk-opt-text {
      font-weight: 600;
      flex: 1;
    }

    /* Z-Kitap Modunda Kısa Cevap / Açık Uçlu Satır İçi Giriş Alanı */
    .zk-inline-short-box, .zk-inline-open-box {
      margin-top: 20px;
      padding: 18px 20px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
    }
    .zk-inline-label {
      display: block;
      font-size: 15px;
      font-weight: 800;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .zk-inline-input {
      width: 100%;
      font-size: calc(22px * var(--zk-font-scale, 1.0));
      padding: 12px 16px;
      border-radius: 10px;
      border: 1.5px solid #93c5fd;
      background: #ffffff;
      color: #0f172a;
      font-weight: 700;
    }
    .zk-inline-textarea {
      width: 100%;
      font-size: calc(20px * var(--zk-font-scale, 1.0));
      padding: 12px 16px;
      border-radius: 10px;
      border: 1.5px solid #93c5fd;
      background: #ffffff;
      color: #0f172a;
      font-weight: 600;
      line-height: 1.6;
      resize: vertical;
    }

    /* 💡 Çözüm & Doğru Cevap Kutusu (Sınav bittiğinde açılır) */
    .zk-solution-box {
      margin-top: 26px;
      padding: 18px 22px;
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      border-radius: 14px;
    }
    .zk-solution-badge {
      font-size: 13px;
      font-weight: 900;
      color: #15803d;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .zk-solution-text {
      font-size: 16px;
      color: #14532d;
      line-height: 1.55;
    }
    .zk-correct-val {
      font-weight: 900;
      color: #15803d;
      font-size: 17px;
    }
    .zk-expl-text {
      margin-top: 6px;
      color: #166534;
      font-size: 15px;
    }

    /* 📌 3. SAĞ SÜTUN: ETKİLEŞİMLİ ÇÖZÜM PANELİ (Mod 2) */
    .zk-col-right {
      position: sticky;
      top: 90px;
      width: 100%;
    }
    .zk-answer-panel {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 20px;
      padding: 22px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .zk-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .zk-panel-header h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
    }
    .zk-panel-hint {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
    }

    .zk-choice-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .zk-choice-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .zk-choice-btn:hover {
      border-color: #0284c7;
      background: #f0f9ff;
    }
    .zk-choice-btn.is-active {
      background: #0284c7 !important;
      border-color: #0284c7 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }
    .zk-choice-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 14px;
    }
    .zk-choice-btn.is-active .zk-choice-circle {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .zk-choice-label {
      font-weight: 800;
      font-size: 14px;
    }

    .zk-short-input {
      width: 100%;
      font-size: 18px;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-weight: 700;
    }
    .zk-open-textarea, .zk-notes-textarea {
      width: 100%;
      font-size: 15px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      line-height: 1.6;
      resize: vertical;
      font-family: inherit;
    }
    .zk-notes-label {
      display: block;
      font-size: 12.5px;
      font-weight: 800;
      color: #475569;
      margin-bottom: 6px;
    }

    /* 📌 4. SABİT ALT ÇUBUK (BOTTOM TOOLBAR) */
    .zk-bottombar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 95;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-top: 1.5px solid #e2e8f0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
    }
    .zk-bottom-left, .zk-bottom-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .zk-bottom-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .zk-bottom-btn:hover {
      background: #e0f2fe;
      border-color: #38bdf8;
      color: #0284c7;
    }

    .zk-watermark {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .zk-watermark:hover {
      color: #e11d48;
    }

    /* Soru Rotaları Menüsü Çekmecesi */
    .zk-routes-drawer {
      position: fixed;
      left: 24px;
      bottom: 64px;
      width: min(480px, 92vw);
      max-height: 70vh;
      z-index: 110;
      background: #ffffff;
      border: 2px solid #cbd5e1;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .zk-routes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1.5px solid #e2e8f0;
      background: #f8fafc;
    }
    .zk-routes-header h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
    }
    .zk-routes-header button {
      background: transparent;
      border: none;
      font-size: 18px;
      color: #64748b;
      cursor: pointer;
    }
    .zk-routes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 14px;
      overflow-y: auto;
    }
    .zk-route-item {
      padding: 10px 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      font-size: 14px;
      font-weight: 800;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .zk-route-item:hover, .zk-route-item.active {
      background: #0284c7;
      border-color: #0284c7;
      color: #ffffff;
    }

    /* Sonuç Karnesi Modalı */
    .zk-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .zk-modal-card {
      background: #ffffff;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }
    .zk-modal-header {
      background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%);
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .zk-modal-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 900;
      margin-bottom: 4px;
    }
    .zk-modal-header div {
      font-size: 13px;
      opacity: 0.9;
    }
    .zk-modal-body {
      padding: 24px;
    }
    .zk-score-circle {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      margin: 0 auto 18px;
      border: 3px solid #bae6fd;
    }
    .zk-stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      text-align: center;
      margin-bottom: 16px;
    }
    .zk-stat-box {
      padding: 12px 8px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
    }
    .zk-stat-num {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 900;
    }
    .zk-stat-lbl {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      margin-top: 2px;
    }
    .zk-time-info {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 20px;
      background: #f8fafc;
      padding: 10px;
      border-radius: 10px;
      border: 1px dashed #cbd5e1;
    }
    .zk-modal-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .zk-btn-modal {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      border: none;
      text-align: center;
    }

    /* 📌 5. RESPONSIVE & AKILLI TAHTA */
    @media (max-width: 960px) {
      .zk-topbar { padding: 10px 14px; }
      .zk-brand-name, .zk-unit-tag { display: none; }
      .zk-main-viewport { padding: 16px 16px 70px 16px; }
      body.zk-mode-interactive .zk-slide-grid { grid-template-columns: 1fr !important; }
      .zk-col-right { position: static; margin-top: 20px; }
      .zk-timer-badge { font-size: 17px; padding: 5px 10px; }
      .zk-counter-pill { font-size: 15px; padding: 5px 10px; }
      .zk-nav-btn { font-size: 14px; padding: 8px 14px; }
    }

    @media print {
      .zk-topbar, .zk-bottombar, .zk-routes-drawer, .zk-modal-overlay { display: none !important; }
      .zk-slide-section { display: block !important; page-break-after: always; padding: 20px 0; }
      body.zk-mode-zkitap .zk-slide-grid { max-width: 100% !important; }
    }
  </style>
</head>
<body class="zk-mode-zkitap">

  <!-- ÜST KONTROL ÇUBUĞU (Z-KİTAP TOOLBAR) -->
  <header class="zk-topbar">
    <div class="zk-topbar-left">
      <a href="/" class="zk-brand-link" title="Rotalı Fenci Ana Sayfa">
        <img src="${logoSrc}" alt="Logo" class="zk-brand-logo">
        <span class="zk-brand-name">ROTALI FENCİ</span>
      </a>
      <span class="zk-unit-tag">${escapeHtml(grade)}. Sınıf • ${safeUnit}</span>
      
      <!-- ⏱️ Canlı Kronometre & Duraklatma / Devam Etme Butonu -->
      <div class="zk-timer-badge" id="zkTimerBadge" onclick="toggleTimerPause()" title="Kalan Süre (Tıklayarak Duraklat / Devam Et)">
        ⏱️ <span id="zkTimerDigits">${qCount}:00</span>
        <span class="zk-timer-state-icon" id="zkTimerStateIcon" title="Duraklat/Devam Et">⏸️</span>
      </div>

      <!-- Soru Sayacı (1 / 20) -->
      <div class="zk-counter-pill" id="zkSlideCounter">1 / ${qCount}</div>
    </div>

    <div class="zk-topbar-right">
      <!-- A- / A+ Yazı Boyutu Kontrolleri -->
      <div class="zk-font-controls">
        <button type="button" class="zk-btn-font" onclick="changeFontSize(-1)" title="Yazıyı Küçült (A-)">A-</button>
        <button type="button" class="zk-btn-font" onclick="changeFontSize(1)" title="Yazıyı Büyüt (A+)">A+</button>
      </div>

      <!-- Z-Kitap / Çözüm Modu Geçiş Butonu -->
      <button type="button" class="zk-mode-btn" id="btnToggleMode" onclick="toggleZKitapMode()" title="Gösterim Modunu Değiştir">
        <i class="fa-solid fa-chalkboard-user"></i> <span id="modeBtnText">✍️ Çözüm Modu</span>
      </button>

      <!-- Sağ Üst Önceki / Sonraki Butonları -->
      <button type="button" class="zk-nav-btn zk-prev-btn" id="btnPrevSlide" onclick="prevSlide()" title="Önceki Soru (Sol Ok)">‹ Önceki</button>
      <button type="button" class="zk-nav-btn zk-next-btn" id="btnNextSlide" onclick="nextSlide()" title="Sonraki Soru (Sağ Ok)">Sonraki ›</button>

      <!-- Tam Ekran & Bitir Butonları -->
      <button type="button" class="zk-btn-icon" onclick="toggleFullscreen()" title="Akıllı Tahta Tam Ekran (F11)">⛶</button>
      <button type="button" class="zk-finish-btn" onclick="finishAndEvaluateExam()" title="Sınavı Tamamla ve Puanla">
        <i class="fa-solid fa-flag-checkered"></i> <span>Bitir</span>
      </button>
    </div>
  </header>

  <!-- ANA SAHNE (TEK SORU - TEK EKRAN) -->
  <main class="zk-main-viewport" id="zkMainViewport">
    ${slidesHtml}
  </main>

  <!-- SABİT ALT ÇUBUK -->
  <footer class="zk-bottombar">
    <div class="zk-bottom-left">
      <button type="button" class="zk-bottom-btn" onclick="toggleRoutesDrawer()">
        🧭 Soru Rotaları
      </button>
      <button type="button" class="zk-bottom-btn" onclick="toggleSpeechQuestion()" id="btnSpeech">
        🔊 Sesli Oku
      </button>
    </div>

    <div class="zk-bottom-right">
      <a href="https://instagram.com/rotalifenci" target="_blank" rel="noopener" class="zk-watermark">
        <i class="fa-brands fa-instagram"></i> @rotalifenci
      </a>
    </div>
  </footer>

  <!-- Soru Rotaları Menüsü Çekmecesi -->
  <div class="zk-routes-drawer" id="routesDrawer" style="display: none;">
    <div class="zk-routes-header">
      <h4>🧭 Soru Listesi &amp; Rotalar</h4>
      <button type="button" onclick="toggleRoutesDrawer()">✕</button>
    </div>
    <div class="zk-routes-grid" id="routesList">
      ${drawerItemsHtml}
    </div>
  </div>

  <!-- Sonuç Karnesi Modalı -->
  <div class="zk-modal-overlay" id="resultModal" style="display: none;">
    <div class="zk-modal-card">
      <div class="zk-modal-header">
        <h2>🎯 Sınav Değerlendirme Karnesi</h2>
        <div>${safeTitle}</div>
      </div>
      <div class="zk-modal-body">
        <div class="zk-score-circle" id="modalScoreVal">100</div>
        <div class="zk-stats-row">
          <div class="zk-stat-box" style="border-color:#86efac;">
            <div class="zk-stat-num" id="modalCorrectCount" style="color:#16a34a;">0</div>
            <div class="zk-stat-lbl">Doğru</div>
          </div>
          <div class="zk-stat-box" style="border-color:#fca5a5;">
            <div class="zk-stat-num" id="modalWrongCount" style="color:#dc2626;">0</div>
            <div class="zk-stat-lbl">Yanlış</div>
          </div>
          <div class="zk-stat-box" style="border-color:#fde047;">
            <div class="zk-stat-num" id="modalEmptyCount" style="color:#d97706;">0</div>
            <div class="zk-stat-lbl">Boş</div>
          </div>
        </div>
        <div class="zk-time-info">
          ⏱️ Toplam Geçen Süre: <span id="modalTimeSpent" style="color:#0284c7; font-weight:900;">0 dk 0 sn</span>
        </div>
        <div class="zk-modal-actions">
          <button type="button" class="zk-btn-modal" style="background:#0284c7; color:#ffffff;" onclick="revealSolutionsAndReview()">💡 Soru Çözümlerini ve Doğru Cevapları İncele</button>
          <button type="button" class="zk-btn-modal" style="background:#e2e8f0; color:#334155;" onclick="closeResultModal()">Kapat</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const totalQuestions = ${qCount};
    let activeSlideIdx = 0;
    const studentAnswers = {};
    const correctAnswers = ${JSON.stringify(questions.map((q, i) => ({ id: i + 1, type: q.type || (q.options && q.options.A ? 'multiple_choice' : 'short_answer'), correct: String(q.correct_answer || '').trim() })))};

    // ⏱️ KRONOMETRE MOTORU (Kaç soru varsa o kadar dakika)
    let remainingSeconds = totalQuestions * 60;
    let elapsedSeconds = 0;
    let timerInterval = null;
    let isTimerPaused = false;
    let isExamFinished = false;

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function updateTimerDisplay() {
      const str = formatTime(remainingSeconds);
      const timerDigits = document.getElementById('zkTimerDigits');
      if (timerDigits) timerDigits.textContent = str;

      const badge = document.getElementById('zkTimerBadge');
      if (badge) {
        if (remainingSeconds <= 60) {
          badge.className = 'zk-timer-badge timer-urgent';
        } else if (remainingSeconds <= 300) {
          badge.className = 'zk-timer-badge timer-warning';
        }
      }
    }

    function toggleTimerPause() {
      isTimerPaused = !isTimerPaused;
      const icon = document.getElementById('zkTimerStateIcon');
      if (icon) icon.textContent = isTimerPaused ? '▶️' : '⏸️';
      const badge = document.getElementById('zkTimerBadge');
      if (badge) badge.classList.toggle('is-paused', isTimerPaused);
    }

    function startExamTimer() {
      if (timerInterval) clearInterval(timerInterval);
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        if (isExamFinished) {
          clearInterval(timerInterval);
          return;
        }
        if (isTimerPaused) return;

        remainingSeconds--;
        elapsedSeconds++;
        if (remainingSeconds <= 0) {
          remainingSeconds = 0;
          updateTimerDisplay();
          clearInterval(timerInterval);
          alert('⏰ Sınav süreniz tamamlandı! Yanıtlarınız otomatik olarak değerlendiriliyor.');
          finishAndEvaluateExam();
        } else {
          updateTimerDisplay();
        }
      }, 1000);
    }

    startExamTimer();

    // 📖 İKİ GÖSTERİM MODU (Z-KİTAP / ÇÖZÜM)
    let currentMode = 'zkitap'; // 'zkitap' (tam ekran soru) veya 'interactive' (sol soru / sağ cevap)
    function toggleZKitapMode() {
      currentMode = (currentMode === 'zkitap') ? 'interactive' : 'zkitap';
      applyMode(currentMode);
    }
    function applyMode(mode) {
      document.body.classList.toggle('zk-mode-zkitap', mode === 'zkitap');
      document.body.classList.toggle('zk-mode-interactive', mode === 'interactive');
      const modeBtnText = document.getElementById('modeBtnText');
      if (modeBtnText) {
        modeBtnText.textContent = (mode === 'zkitap') ? '✍️ Çözüm Modu' : '📖 Z-Kitap Modu';
      }
    }

    // 🔍 YAZI BOYUTU ZOOM KONTROLLERİ (A- / A+)
    let currentFontScale = 1.0;
    function changeFontSize(delta) {
      currentFontScale = Math.max(0.80, Math.min(1.40, currentFontScale + delta * 0.10));
      document.documentElement.style.setProperty('--zk-font-scale', currentFontScale);
    }

    // 📑 SLAYT GEÇİŞLERİ (TEK SORU - TEK EKRAN)
    function updateCounter(idx) {
      activeSlideIdx = Math.max(0, Math.min(totalQuestions - 1, idx));
      const counterEl = document.getElementById('zkSlideCounter');
      if (counterEl) counterEl.textContent = (activeSlideIdx + 1) + ' / ' + totalQuestions;
      
      const prevBtn = document.getElementById('btnPrevSlide');
      const nextBtn = document.getElementById('btnNextSlide');
      if (prevBtn) prevBtn.disabled = (activeSlideIdx <= 0);
      if (nextBtn) nextBtn.disabled = (activeSlideIdx >= totalQuestions - 1);

      document.querySelectorAll('.zk-route-item').forEach((b, i) => {
        b.classList.toggle('active', i === activeSlideIdx);
      });
    }

    function goToSlide(idx) {
      activeSlideIdx = Math.max(0, Math.min(totalQuestions - 1, idx));
      document.querySelectorAll('.zk-slide-section').forEach((sec, i) => {
        const isCurrent = (i === activeSlideIdx);
        sec.classList.toggle('is-active', isCurrent);
        sec.style.display = isCurrent ? 'block' : 'none';
      });
      updateCounter(activeSlideIdx);
      window.scrollTo({ top: 0, behavior: 'instant' });
      const drawer = document.getElementById('routesDrawer');
      if (drawer) drawer.style.display = 'none';
    }

    function nextSlide() {
      if (activeSlideIdx < totalQuestions - 1) {
        goToSlide(activeSlideIdx + 1);
      }
    }

    function prevSlide() {
      if (activeSlideIdx > 0) {
        goToSlide(activeSlideIdx - 1);
      }
    }

    // Klavye Yön Tuşları Desteği
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    });

    // Dokunmatik Swipe (Kaydırma) Desteği
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
    }, { passive: true });

    // Seçenek Seçimi
    function selectSlideOption(qNum, optLetter) {
      studentAnswers[qNum] = optLetter;
      // Sol soru listesindeki seçimi güncelle
      document.querySelectorAll('.zk-option-item[data-qid="' + qNum + '"]').forEach(el => {
        el.classList.toggle('is-selected', el.dataset.opt === optLetter);
      });
      // Sağ paneldeki seçimi güncelle
      document.querySelectorAll('.zk-choice-btn[data-qid="' + qNum + '"]').forEach(el => {
        el.classList.toggle('is-active', el.dataset.opt === optLetter);
      });
    }

    function recordAnswer(qNum, val) {
      studentAnswers[qNum] = val.trim();
      const inlineInput = document.getElementById('inline-q-' + qNum);
      if (inlineInput && inlineInput.value !== val) {
        inlineInput.value = val;
      }
    }

    function syncInlineAnswer(qNum, val) {
      studentAnswers[qNum] = val.trim();
      const rightInput = document.getElementById('input-q-' + qNum);
      if (rightInput && rightInput.value !== val) {
        rightInput.value = val;
      }
    }

    // 🧭 Soru Rotaları Menüsü
    function toggleRoutesDrawer() {
      const drawer = document.getElementById('routesDrawer');
      if (drawer) {
        drawer.style.display = (drawer.style.display === 'none' || !drawer.style.display) ? 'flex' : 'none';
      }
    }

    // ⛶ Akıllı Tahta Tam Ekran
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    // 🔊 Sesli Okuma
    let speechSynth = window.speechSynthesis;
    let isSpeaking = false;
    function toggleSpeechQuestion() {
      if (!speechSynth) return;
      if (isSpeaking) {
        speechSynth.cancel();
        isSpeaking = false;
        document.getElementById('btnSpeech').textContent = '🔊';
        return;
      }
      const activeSection = document.querySelector('.zk-slide-section.is-active');
      if (!activeSection) return;
      const stemEl = activeSection.querySelector('.zk-question-stem');
      const textToRead = stemEl ? stemEl.innerText : '';
      if (!textToRead) return;

      const utter = new SpeechSynthesisUtterance(textToRead);
      utter.lang = 'tr-TR';
      utter.rate = 0.95;
      utter.onend = () => {
        isSpeaking = false;
        document.getElementById('btnSpeech').textContent = '🔊';
      };
      speechSynth.speak(utter);
      isSpeaking = true;
      document.getElementById('btnSpeech').textContent = '⏹️';
    }

    // 🎯 Sınav Değerlendirme & Testi Bitir
    function normalizeAnswer(ans) {
      return String(ans || '').trim().toLowerCase()
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
        .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '');
    }

    function finishAndEvaluateExam() {
      isExamFinished = true;
      if (timerInterval) clearInterval(timerInterval);

      let correctCount = 0;
      let wrongCount = 0;
      let emptyCount = 0;

      correctAnswers.forEach(item => {
        const studentAns = studentAnswers[item.id];
        if (!studentAns) {
          emptyCount++;
        } else {
          const normStud = normalizeAnswer(studentAns);
          const normCorr = normalizeAnswer(item.correct);
          if (normStud === normCorr || (normCorr.length > 2 && normStud.includes(normCorr))) {
            correctCount++;
          } else {
            wrongCount++;
          }
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);
      const scoreVal = document.getElementById('modalScoreVal');
      if (scoreVal) scoreVal.textContent = score;

      const cEl = document.getElementById('modalCorrectCount');
      const wEl = document.getElementById('modalWrongCount');
      const eEl = document.getElementById('modalEmptyCount');
      if (cEl) cEl.textContent = correctCount;
      if (wEl) wEl.textContent = wrongCount;
      if (eEl) eEl.textContent = emptyCount;

      const m = Math.floor(elapsedSeconds / 60);
      const s = elapsedSeconds % 60;
      const timeSpentEl = document.getElementById('modalTimeSpent');
      if (timeSpentEl) timeSpentEl.textContent = m + ' dk ' + s + ' sn';

      const modal = document.getElementById('resultModal');
      if (modal) modal.style.display = 'flex';
    }

    function closeResultModal() {
      const modal = document.getElementById('resultModal');
      if (modal) modal.style.display = 'none';
    }

    function revealSolutionsAndReview() {
      closeResultModal();
      document.querySelectorAll('.zk-solution-box').forEach(box => {
        box.style.display = 'block';
      });
      goToSlide(0);
    }

    // Başlangıç Ayarları
    updateCounter(0);
  </script>
</body>
</html>`;
}

module.exports = {
  buildZKitapHtml,
  escapeHtml,
  formatQuestionStem
};
