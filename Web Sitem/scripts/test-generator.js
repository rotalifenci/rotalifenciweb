/**
 * Rotalı Fenci - Yaprak Test & İnteraktif Sınav Oluşturucu Motoru
 * Hem Çoktan Seçmeli hem de Açık Uçlu (Klasik) ve Kısa Cevaplı sınavları tam ekran MEB formatında destekler.
 * 3D Sinematik 2 Sütunlu Aydınlık (Açık Renk) Slayt / Player Formatı.
 * 
 * Özellikler:
 * - 2 Sütunlu Sayfa Düzeni (%56 Sol İçerik / %42 Sağ Görsel)
 * - Aydınlık (Light Theme) yüksek kontrastlı, okunaklı tipografi (#0f172a)
 * - Sınav esnasında ipucu ve cevaplar KESİNLİKLE GİZLİDİR (display: none)
 * - Kaç soru varsa o kadar süre veren CANLI KRONOMETRE (Örn: 30 soru = 30 dakika)
 * - Sınav bitiminde Sonuç Karnesi ve Çözümleri İnceleme desteği
 * - Sabit (Sticky) alt kontrol menüsü: Önceki, Sayfa No, Kronometre, Sonraki, Soru Rotaları, Ses, Tam Ekran, Yazdır
 * - Sol alt köşede Instagram "@rotalifenci" filigranı
 * - MEB Maarif Modeli A4 yazdırma uyumluluğu
 */

const __fsLogo = require('fs');
const __pathLogo = require('path');

// Logo her ortamda (Vercel / yerel / dosya) görünsün diye veri URI olarak gömülür
let LOGO_SRC = '/assets/rotali-fenci-logo.jpg';
(function loadLogoSrc() {
  const tries = [
    () => require('./_logo-data.js'),
    () => require('../api/_logo-data.js'),
    () => 'data:image/jpeg;base64,' + __fsLogo.readFileSync(__pathLogo.join(process.cwd(), 'assets', 'rotali-fenci-logo.jpg')).toString('base64'),
    () => 'data:image/jpeg;base64,' + __fsLogo.readFileSync(__pathLogo.join(__dirname, '..', 'assets', 'rotali-fenci-logo.jpg')).toString('base64')
  ];
  for (const t of tries) {
    try { const v = t(); if (v) { LOGO_SRC = v; return; } } catch (e) {}
  }
})();

function foldTr(s) {
  return String(s || '')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Şekil/görsel içindeki yazılardan CEVAP sızıntılarını temizler (yerine "?" konur)
const SVG_BANNED_PHRASES = [
  'kure', 'kuresel', 'yildiz', 'isik kaynagi', 'isi kaynagi', 'isi ve isik', 'dogal uydu',
  'geometrik sekil', 'krater', 'atmosfer', 'regolit', 'toz tabakasi', 'gaz kuresi',
  'katman', 'cap', 'perspektif', 'ay tozu', 'gunes lekesi', 'dogru cevap', 'cevap', 'ipucu'
];
function sanitizeVisualSvg(svg, answer) {
  if (!svg || typeof svg !== 'string') return svg;
  const a = foldTr(answer);
  const aWords = a.split(' ').filter(w => w.length >= 3);
  let out = svg.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '').replace(/<desc[^>]*>[\s\S]*?<\/desc>/gi, '');
  out = out.replace(/<text([^>]*)>([\s\S]*?)<\/text>/gi, (m, attrs, inner) => {
    const raw = inner.replace(/<[^>]+>/g, '').trim();
    const t = foldTr(raw);
    if (!t || raw === '?') return m;
    const words = t.split(' ');
    let leak = SVG_BANNED_PHRASES.some(k => (k.length <= 3 ? words.includes(k) : t.includes(k)));
    if (!leak && a.length >= 2) {
      leak = a.length <= 3 ? words.includes(a) : (t.includes(a) || (t.length >= 4 && a.includes(t)));
    }
    if (!leak && aWords.length) {
      leak = aWords.some(w => words.includes(w) || t.includes(w));
    }
    return leak ? '<text' + attrs + '>?</text>' : m;
  });
  return out;
}

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
  unit = "1. Ünite: Gökyüzündeki Komşularımız ve Biz",
  subject = "Fen Bilimleri",
  questions = []
}) {
  const safeTitle = escapeHtml(title || `${grade}. Sınıf ${subject} Yazılıya Hazırlık Sınavı`);
  const safeUnit = escapeHtml(unit);
  const qCount = questions.length;

  const slidesHtml = questions.map((q, idx) => {
    const qNum = idx + 1;
    const isMultipleChoice = q.options && Object.keys(q.options).length > 0 && q.options.A;
    const isShortAnswer = q.type === 'short_answer';
    const isOpenEnded = q.type === 'open_ended' || (!isMultipleChoice && !isShortAnswer);

    let answerAreaHtml = '';
    let correctAns = String(q.correct_answer || '').trim();

    if (isMultipleChoice) {
      const opts = q.options;
      const letters = ['A', 'B', 'C', 'D'];
      const optColors = ['neon-blue', 'neon-purple', 'neon-orange', 'neon-emerald'];
      answerAreaHtml = `
        <div class="slide-options-grid">
          ${letters.map((let, oIdx) => `
            <div class="slide-opt-card ${optColors[oIdx % optColors.length]}" data-qid="${qNum}" data-opt="${let}" onclick="selectSlideOption(${qNum}, '${let}')">
              <span class="slide-opt-letter">${let}</span>
              <span class="slide-opt-text">${escapeHtml(opts[let] || '')}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (isShortAnswer) {
      answerAreaHtml = `
        <div class="slide-short-answer-box">
          <span class="slide-input-label">✍️ Cevabınız:</span>
          <input type="text" class="slide-short-input" id="input-q-${qNum}" name="f${qNum}-${Math.random().toString(36).slice(2, 8)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" readonly onfocus="this.removeAttribute('readonly')" placeholder="Kısa cevabınızı buraya yazınız..." oninput="recordAnswer(${qNum}, this.value)">
        </div>
      `;
    } else {
      answerAreaHtml = `
        <div class="slide-open-ended-box">
          <span class="slide-input-label">✍️ Bilimsel Cevabınız ve Gerekçeniz:</span>
          <textarea class="slide-open-textarea" id="input-q-${qNum}" name="f${qNum}-${Math.random().toString(36).slice(2, 8)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" readonly onfocus="this.removeAttribute('readonly')" rows="3" placeholder="Açık uçlu cevabınızı buraya yazınız..." oninput="recordAnswer(${qNum}, this.value)"></textarea>
        </div>
      `;
    }

    const visualHtml = (q.visual_svg && q.visual_svg.trim()) ? sanitizeVisualSvg(q.visual_svg, correctAns) : `
      <svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="260" y="115" text-anchor="middle" font-family="'Times New Roman', serif" font-size="20" fill="#64748b">Soru ${qNum}</text>
      </svg>
    `;

    const __svgForShow = (q.visual_svg && q.visual_svg.trim()) ? visualHtml : '';
    const __isPlaceholder = !__svgForShow || (/>\s*Soru\s*\d+\s*<\/text>/.test(__svgForShow) && __svgForShow.length < 700);
    const isShortOrFill = isShortAnswer || (safeTitle && /kısa cevap|bosluk doldurma|boşluk doldurma/i.test(safeTitle));
    const hasVisual = !isShortOrFill && (q.visual_svg && q.visual_svg.trim()) && !__isPlaceholder;
    const visualBlock = hasVisual ? '<div class="yp-space-visual-frame">' + visualHtml + '</div>' : '';
    
    return `
      <section class="yp-space-slide-section ${idx === 0 ? 'is-active' : ''}" id="yp-space-slide-${idx}" data-slide-index="${idx}" style="${idx === 0 ? 'display: flex;' : 'display: none;'}">
        <div class="yp-space-slide-grid">
          <!-- Sol Sütun (%56 Genişlik): Metin, Soru Kartı, Şıklar/Cevap, Gizli Altın Kural -->
          <div class="yp-space-col-left">
            <div class="yp-slide-category">
              <span>✦</span>
              <span>🚀 ${escapeHtml(grade)}. SINIF • ${safeUnit}</span>
            </div>
            <h2 class="yp-slide-main-title">${qNum}. Soru</h2>
            <p class="yp-slide-subtitle">${escapeHtml(q.learning_outcome || 'MEB Maarif Modeli Yeni Nesil Yazılıya Hazırlık Sorusu')}</p>
            
            
            ${visualBlock}
            <div class="yp-neon-card neon-blue yp-question-card">
              <strong>Soru ${qNum}:</strong> ${escapeHtml(q.question || '')}
            </div>

            <!-- Cevaplar ve İpuçları Test Sırasında Kesinlikle Gizlidir (display: none) -->
            <div class="yp-golden-rule-box" id="golden-box-${qNum}" style="display: none;">
              <div class="yp-golden-rule-icon">💡</div>
              <div class="yp-golden-rule-content">
                <strong>ÇÖZÜM &amp; DOĞRU CEVAP</strong>
                <span>Doğru Cevap: ${escapeHtml(correctAns)} — ${escapeHtml(q.explanation || 'Kavramları analiz ederek bilimsel çıkarım yapınız.')}</span>
              </div>
            </div>
          </div>

          <!-- Sağ Sütun (%42 Genişlik): Yüksek Çözünürlüklü Yuvarlatılmış Görsel Kutusu -->
          <div class="yp-space-col-right">
            <div class="yp-answer-panel">
              <h3 class="yp-answer-title">✍️ CEVABINIZ</h3>
              ${answerAreaHtml}
            </div>
          </div>
        </div>
      </section>
    `;
  }).join('\n');

  const drawerItemsHtml = questions.map((q, idx) => {
    return `<button type="button" class="yp-route-item ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})">${idx + 1}. Soru</button>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Rotalı Fenci</title>
  <link rel="icon" type="image/jpeg" href="/assets/rotali-fenci-logo.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* ========================================================
       ☀️ AÇIK RENK (LIGHT THEME) 3D SİNEMATİK GÖRÜNTÜLEYİCİ
       ======================================================== */
    :root {
      --bg-gradient: linear-gradient(135deg, #f0f4f9 0%, #e2e8f0 45%, #f8fafc 100%);
      --card-bg: rgba(255, 255, 255, 0.95);
      --card-border: #38bdf8;
      --text-main: #0f172a;
      --text-muted: #475569;
      --primary-blue: #0284c7;
      --golden-bg: #eff6ff;
      --golden-border: #2563eb;
      --golden-text: #1e3a8a;
      --visual-bg: #ffffff;
      --visual-border: #cbd5e1;
      --topbar-bg: rgba(255, 255, 255, 0.95);
      --bottombar-bg: rgba(255, 255, 255, 0.95);
    }

    body.theme-dark {
      --bg-gradient: radial-gradient(ellipse at 50% 15%, #0b1536 0%, #050a18 55%, #02040a 100%);
      --card-bg: rgba(6, 12, 30, 0.78);
      --card-border: rgba(56, 189, 248, 0.35);
      --text-main: #ffffff;
      --text-muted: #cbd5e1;
      --primary-blue: #38bdf8;
      --golden-bg: linear-gradient(135deg, #0c2461 0%, #1e3799 100%);
      --golden-border: #facc15;
      --golden-text: #ffffff;
      --visual-bg: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(5, 10, 24, 0.98) 100%);
      --visual-border: rgba(56, 189, 248, 0.45);
      --topbar-bg: rgba(5, 10, 24, 0.88);
      --bottombar-bg: rgba(7, 13, 30, 0.94);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background 0.3s ease, color 0.3s ease;
    }

    /* Yıldız ve Işıltı Katmanı */
    .space-stars-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(1.8px 1.8px at 30px 40px, rgba(2, 132, 199, 0.45), transparent),
        radial-gradient(1.2px 1.2px at 90px 130px, rgba(99, 102, 241, 0.45), transparent),
        radial-gradient(2.2px 2.2px at 200px 70px, rgba(245, 158, 11, 0.4), transparent),
        radial-gradient(1.4px 1.4px at 320px 220px, rgba(2, 132, 199, 0.35), transparent),
        radial-gradient(1.8px 1.8px at 430px 105px, rgba(168, 85, 247, 0.4), transparent),
        radial-gradient(1.2px 1.2px at 550px 170px, rgba(2, 132, 199, 0.4), transparent);
      background-size: 580px 280px;
      opacity: 0.65;
      z-index: 0;
    }

    .space-nebula-glow {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 15% 25%, rgba(56, 189, 248, 0.18) 0%, transparent 55%),
        radial-gradient(circle at 85% 65%, rgba(99, 102, 241, 0.15) 0%, transparent 55%),
        radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
      z-index: 0;
    }

    /* Üst Kontrol Çubuğu */
    .space-topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 28px;
      background: var(--topbar-bg);
      backdrop-filter: blur(16px);
      border-bottom: 1.5px solid #cbd5e1;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
      flex-shrink: 0;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
    }

    .brand-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #e11d48;
      overflow: hidden;
      flex-shrink: 0;
    }
    .brand-avatar img { width: 100%; height: 100%; object-fit: cover; }

    .brand-text {
      font-weight: 900;
      font-size: 14px;
      letter-spacing: -0.2px;
      color: #1e1b4b;
    }
    body.theme-dark .brand-text { color: #ffffff; }

    .space-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    body.theme-dark .space-badge {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.35);
    }

    .doc-main-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* ⏱️ Canlı Kronometre Rozeti */
    .exam-countdown-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
      background: #eff6ff;
      color: #1e40af;
      border: 1.5px solid #bfdbfe;
      font-family: 'Outfit', monospace;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
      transition: all 0.25s ease;
    }
    body.theme-dark .exam-countdown-badge {
      background: rgba(30, 58, 138, 0.4);
      color: #93c5fd;
      border-color: rgba(96, 165, 250, 0.4);
    }

    .exam-countdown-badge.timer-warning,
    .yp-bar-timer.timer-warning {
      background: #fef3c7 !important;
      color: #92400e !important;
      border-color: #fcd34d !important;
    }

    .exam-countdown-badge.timer-urgent,
    .yp-bar-timer.timer-urgent {
      background: #fee2e2 !important;
      color: #991b1b !important;
      border-color: #f87171 !important;
      animation: pulseUrgent 1s infinite;
    }

    @keyframes pulseUrgent {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.85; }
    }

    .topbar-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      transition: all 0.2s ease;
    }
    body.theme-dark .topbar-btn {
      background: rgba(15, 23, 42, 0.8);
      border-color: rgba(148, 163, 184, 0.3);
      color: #f1f5f9;
    }
    .topbar-btn:hover {
      border-color: #0284c7;
      color: #0284c7;
      transform: translateY(-1px);
    }

    .topbar-btn.btn-finish-test {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .topbar-btn.btn-finish-test:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      transform: translateY(-1px);
    }

    /* Dikey Kaydırma Akış Alanı */
    .yp-space-scroll-stream {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 48px;
      padding: 32px 28px 140px 28px;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
    }

    /* Slayt Bölümü */
    .yp-space-slide-section {
      min-height: calc(100vh - 160px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      scroll-margin-top: 80px;
      padding: 24px;
      background: var(--card-bg);
      border-radius: 28px;
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    body.theme-dark .yp-space-slide-section {
      border-color: rgba(56, 189, 248, 0.25);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
    }

    /* İki Sütunlu Grid */
    .yp-space-slide-grid {
      display: grid;
      grid-template-columns: 56% 42%;
      gap: 32px;
      align-items: center;
    }

    /* Sol Sütun */
    .yp-space-col-left {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .yp-slide-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--primary-blue);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .yp-slide-main-title {
      font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 26px;
      font-weight: 900;
      line-height: 1.25;
      color: var(--text-main);
      letter-spacing: -0.5px;
    }

    .yp-slide-subtitle {
      font-size: 14.5px;
      font-weight: 600;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Soru Kartı & Seçenekler */
    .yp-neon-cards-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 6px;
    }

    .yp-neon-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      padding: 18px 22px;
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-main);
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease;
    }
    body.theme-dark .yp-neon-card {
      background: rgba(10, 18, 42, 0.85);
      color: #f8fafc;
      border-color: rgba(56, 189, 248, 0.4);
    }

    .yp-neon-card.neon-blue {
      border-left: 6px solid #0284c7;
      box-shadow: 0 4px 20px rgba(2, 132, 199, 0.08);
    }
    body.theme-dark .yp-neon-card.neon-blue {
      border-left-color: #38bdf8;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
    }

    .slide-options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .slide-opt-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-main);
    }
    body.theme-dark .slide-opt-card {
      background: rgba(15, 23, 42, 0.75);
      border-color: rgba(148, 163, 184, 0.3);
      color: #f8fafc;
    }

    .slide-opt-card:hover {
      border-color: var(--primary-blue);
      transform: translateX(4px);
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.15);
    }

    .slide-opt-card.is-selected {
      border-color: #2563eb !important;
      background: #eff6ff !important;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25) !important;
    }
    body.theme-dark .slide-opt-card.is-selected {
      background: rgba(37, 99, 235, 0.3) !important;
      border-color: #60a5fa !important;
    }

    .slide-opt-letter {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 900;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1.5px solid #cbd5e1;
      transition: all 0.2s ease;
    }
    body.theme-dark .slide-opt-letter {
      background: rgba(30, 41, 59, 0.8);
      color: #ffffff;
      border-color: rgba(148, 163, 184, 0.4);
    }

    .slide-opt-card.is-selected .slide-opt-letter {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }

    .slide-opt-text { flex: 1; }

    /* Kısa Cevap / Açık Uçlu Giriş Alanları */
    .slide-short-answer-box, .slide-open-ended-box {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    body.theme-dark .slide-short-answer-box,
    body.theme-dark .slide-open-ended-box {
      background: rgba(15, 23, 42, 0.75);
      border-color: rgba(148, 163, 184, 0.3);
    }

    .slide-input-label {
      font-size: 13.5px;
      font-weight: 800;
      color: #0369a1;
    }
    body.theme-dark .slide-input-label { color: #38bdf8; }

    .slide-short-input, .slide-open-textarea {
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1.5px solid #cbd5e1;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      transition: all 0.2s ease;
    }
    body.theme-dark .slide-short-input,
    body.theme-dark .slide-open-textarea {
      background: rgba(30, 41, 59, 0.7);
      border-color: rgba(148, 163, 184, 0.4);
      color: #ffffff;
    }

    .slide-short-input:focus, .slide-open-textarea:focus {
      border-color: #0284c7;
      background: #ffffff;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.2);
    }

    /* Altın Kural / İpucu Kutusu */
    .yp-golden-rule-box {
      margin-top: 8px;
      background: var(--golden-bg);
      border: 1.5px solid #bfdbfe;
      border-left: 6px solid var(--golden-border);
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.08);
    }

    .yp-golden-rule-icon {
      font-size: 24px;
      line-height: 1;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.3));
    }

    .yp-golden-rule-content {
      font-size: 15px;
      line-height: 1.6;
      color: var(--golden-text);
      font-weight: 600;
    }

    .yp-golden-rule-content strong {
      color: #1d4ed8;
      font-weight: 900;
      display: block;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
      font-size: 13.5px;
    }
    body.theme-dark .yp-golden-rule-content strong { color: #fde047; }

    /* Sağ Sütun Görsel Çerçevesi */
    .yp-space-col-right {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .yp-space-visual-frame {
      width: 100%;
      min-height: 320px;
      max-height: 500px;
      border-radius: 22px;
      overflow: hidden;
      background: var(--visual-bg);
      border: 2px solid var(--visual-border);
      box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }

    .yp-space-visual-frame img,
    .yp-space-visual-frame svg {
      max-width: 100%;
      max-height: 440px;
      width: auto;
      height: auto;
      border-radius: 14px;
      object-fit: contain;
    }

    /* Sol Alt Köşe Filigran (@rotalifenci) */
    .yp-space-watermark {
      position: fixed;
      left: 22px;
      bottom: 20px;
      z-index: 30;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 16px;
      border-radius: 999px;
      background: #ffffff;
      border: 1.5px solid #e11d48;
      color: #0f172a;
      font-size: 13px;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(225, 29, 72, 0.15);
      transition: all 0.2s ease;
    }
    body.theme-dark .yp-space-watermark {
      background: rgba(5, 10, 24, 0.9);
      color: #ffffff;
    }

    .yp-space-watermark svg { color: #e11d48; }

    /* Sabit Alt Kontrol Çubuğu */
    .yp-space-bottom-bar {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 18px;
      border-radius: 999px;
      background: var(--bottombar-bg);
      backdrop-filter: blur(20px);
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 14px 40px rgba(15, 23, 42, 0.12), 0 0 24px rgba(56, 189, 248, 0.18);
    }
    body.theme-dark .yp-space-bottom-bar {
      border-color: rgba(56, 189, 248, 0.35);
    }

    .yp-bar-btn {
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      white-space: nowrap;
    }

    .yp-bar-prev {
      background: #0f172a;
      color: #ffffff;
    }
    .yp-bar-prev:hover { background: #334155; transform: translateY(-1px); }

    .yp-bar-next {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #ffffff;
      box-shadow: 0 0 18px rgba(249, 115, 22, 0.35);
    }
    .yp-bar-next:hover {
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      box-shadow: 0 0 24px rgba(249, 115, 22, 0.55);
      transform: translateY(-1px);
    }

    .yp-bar-counter {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 900;
      color: #854d0e;
      background: #fef08a;
      border: 1px solid #fde047;
      padding: 6px 14px;
      border-radius: 999px;
      min-width: 64px;
      text-align: center;
    }
    body.theme-dark .yp-bar-counter {
      background: rgba(250, 204, 21, 0.2);
      color: #facc15;
    }

    .yp-bar-timer {
      font-family: 'Outfit', monospace;
      font-size: 13.5px;
      font-weight: 800;
      color: #1e40af;
      background: #eff6ff;
      border: 1.5px solid #bfdbfe;
      padding: 6px 14px;
      border-radius: 999px;
      min-width: 80px;
      text-align: center;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    body.theme-dark .yp-bar-timer {
      background: rgba(30, 58, 138, 0.4);
      color: #93c5fd;
      border-color: rgba(96, 165, 250, 0.4);
    }

    .yp-bar-divider {
      width: 1px;
      height: 24px;
      background: #cbd5e1;
      margin: 0 2px;
    }

    .yp-bar-routes {
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #cbd5e1;
      font-weight: 800;
    }
    body.theme-dark .yp-bar-routes {
      background: rgba(14, 165, 233, 0.2);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.4);
    }

    .yp-bar-icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    body.theme-dark .yp-bar-icon-btn {
      background: rgba(30, 41, 59, 0.85);
      border-color: rgba(148, 163, 184, 0.3);
      color: #f8fafc;
    }

    .yp-bar-icon-btn:hover {
      background: #e0f2fe;
      border-color: #38bdf8;
      color: #0284c7;
      transform: translateY(-1px);
    }

    /* Ünite Rotaları / Soru Listesi Çekmecesi */
    .yp-space-routes-drawer {
      position: fixed;
      right: 24px;
      bottom: 76px;
      width: 320px;
      max-height: 65vh;
      z-index: 35;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1.5px solid #cbd5e1;
      border-radius: 18px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    body.theme-dark .yp-space-routes-drawer {
      background: rgba(7, 13, 30, 0.96);
      border-color: rgba(56, 189, 248, 0.45);
    }

    .yp-space-routes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .yp-space-routes-header h4 {
      margin: 0;
      font-size: 14px;
      color: #0284c7;
      font-weight: 800;
    }

    .yp-space-routes-header button {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 16px;
      cursor: pointer;
    }

    .yp-space-routes-list {
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .yp-route-item {
      padding: 9px 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    body.theme-dark .yp-route-item {
      background: rgba(15, 23, 42, 0.75);
      border-color: rgba(148, 163, 184, 0.2);
      color: #e2e8f0;
    }

    .yp-route-item:hover, .yp-route-item.active {
      border-color: #0284c7;
      background: #e0f2fe;
      color: #0369a1;
    }

    /* Sonuç Karnesi Modalı */
    .result-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .result-modal-card {
      background: #ffffff;
      border-radius: 24px;
      max-width: 500px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    }
    .result-modal-header {
      background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%);
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .result-modal-body {
      padding: 24px;
    }
    .result-score-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      margin: 0 auto 16px;
    }
    .result-stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      text-align: center;
      margin-bottom: 14px;
    }
    .result-stat-box {
      padding: 12px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .result-stat-num { font-size: 20px; font-weight: 900; }
    .result-stat-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; }
    .result-time-row {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 20px;
      background: #f8fafc;
      padding: 8px;
      border-radius: 10px;
      border: 1px dashed #cbd5e1;
    }
    .result-modal-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .btn-modal {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      border: none;
      text-align: center;
    }

    @media (max-width: 960px) {
      .yp-space-slide-grid { grid-template-columns: 1fr; gap: 20px; }
      .yp-space-scroll-stream { padding: 18px 14px 120px 14px; }
      .yp-space-bottom-bar { max-width: 95vw; overflow-x: auto; padding: 7px 12px; }
      .doc-main-title { display: none; }
    }

    /* MEB Resmi A4 Yazdırma */
    @media print {
      body { background: #ffffff !important; color: #000000 !important; }
      .space-topbar, .yp-space-bottom-bar, .yp-space-watermark, .yp-space-routes-drawer, .space-stars-layer, .space-nebula-glow, .result-modal-overlay { display: none !important; }
      .yp-space-scroll-stream { padding: 0 !important; gap: 24px !important; }
      .yp-space-slide-section {
        min-height: auto !important;
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
        page-break-inside: avoid !important;
        margin-bottom: 20px !important;
        padding: 20px !important;
      }
    }
    /* === Büyütülmüş alt çubuk, logo ve Soru Rotaları çekmecesi === */
    .brand-avatar { width: 46px !important; height: 46px !important; background: #ffffff; }
    .brand-text { font-size: 16px !important; }
    .yp-space-bottom-bar { padding: 14px 26px !important; gap: 16px !important; }
    .yp-bar-btn { font-size: 17px !important; padding: 14px 26px !important; min-height: 52px; }
    .yp-bar-counter, .yp-bar-timer { font-size: 18px !important; padding: 12px 20px !important; }
    .yp-bar-icon-btn { width: 52px !important; height: 52px !important; font-size: 22px !important; }
    .yp-space-routes-drawer { width: min(560px, 94vw) !important; max-height: 80vh !important; bottom: 104px !important; border-radius: 22px !important; }
    .yp-space-routes-header { padding: 18px 22px !important; }
    .yp-space-routes-header h4 { font-size: 20px !important; }
    .yp-space-routes-header button { font-size: 24px !important; }
    .yp-space-routes-list { display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 12px !important; padding: 18px !important; }
    .yp-route-item { font-size: 17px !important; padding: 16px 18px !important; font-weight: 800 !important; text-align: left; }
    @media (max-width: 700px) {
      .yp-bar-btn { font-size: 14px !important; padding: 10px 14px !important; min-height: 44px; }
      .yp-bar-counter, .yp-bar-timer { font-size: 14px !important; padding: 8px 12px !important; }
      .yp-bar-icon-btn { width: 42px !important; height: 42px !important; font-size: 18px !important; }
      .yp-space-routes-list { grid-template-columns: 1fr; }
    }
    /* === YENİ SORU ÇÖZME DÜZENİ: Sol %60 soru + görsel / Sağ %40 cevap alanı === */
    .exam-countdown-badge { display: none !important; }
    .yp-control-row { position: sticky; top: 68px; z-index: 90; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; width: 100%; padding: 12px max(28px, calc((100vw - 1440px) / 2 + 28px)) 10px; background: rgba(240, 244, 249, 0.93); backdrop-filter: blur(10px); }
    body.theme-dark .yp-control-row { background: rgba(5, 10, 24, 0.9); }
    .yp-control-left, .yp-control-right { display: flex; align-items: center; gap: 14px; }
    .yp-control-row .yp-bar-timer { flex-direction: row; gap: 12px; padding: 10px 22px !important; border-radius: 20px !important; background: #ffffff; border: 2px solid #bfdbfe; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12); min-width: 0 !important; }
    .yp-timer-label { font-size: 13px; font-weight: 800; letter-spacing: 0.6px; color: #475569; }
    .yp-timer-digits { font-family: 'Outfit', monospace; font-size: 38px; font-weight: 900; line-height: 1; color: #1e3a8a; letter-spacing: 1px; }
    .yp-bar-timer.timer-warning .yp-timer-digits { color: #92400e; }
    .yp-bar-timer.timer-urgent .yp-timer-digits { color: #991b1b; }
    .yp-control-row .yp-bar-counter { font-size: 22px !important; padding: 14px 22px !important; border-radius: 18px !important; min-width: 96px; }
    .yp-control-row .yp-bar-btn { font-size: 19px !important; padding: 15px 32px !important; border-radius: 18px !important; min-height: 56px; }
    .yp-bar-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
    .yp-space-scroll-stream { padding: 18px 28px 130px 28px !important; }
    .yp-space-slide-section { min-height: calc(100vh - 290px); justify-content: flex-start; padding: 22px 26px; }
    .yp-slide-kind { display: inline-block; align-self: flex-start; font-size: 13px; font-weight: 800; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 999px; padding: 5px 12px; }
    .yp-slide-main-title { font-size: 20px !important; }
    .yp-space-col-left .yp-space-visual-frame { min-height: 0 !important; max-height: 380px !important; width: 100%; padding: 14px !important; }
    .yp-space-col-left .yp-space-visual-frame svg, .yp-space-col-left .yp-space-visual-frame img { width: 100%; height: auto; max-width: 100%; max-height: 350px; }
    .yp-question-card { font-size: clamp(24px, 2.1vw, 28px) !important; line-height: 1.55 !important; font-weight: 700 !important; padding: 24px 28px !important; }
    .yp-answer-panel { width: 100%; background: #ffffff; border: 2px solid #bfdbfe; border-radius: 26px; padding: 28px; box-shadow: 0 14px 40px rgba(37, 99, 235, 0.10); }
    body.theme-dark .yp-answer-panel { background: rgba(10, 18, 42, 0.85); border-color: rgba(56, 189, 248, 0.4); }
    .yp-answer-title { font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; margin-bottom: 16px; }
    body.theme-dark .yp-answer-title { color: #fde047; }
    .yp-answer-panel .slide-input-label { display: none; }
    .yp-answer-panel .slide-short-answer-box, .yp-answer-panel .slide-open-ended-box { background: transparent; border: none; padding: 0; }
    .yp-answer-panel .slide-short-input { font-size: 24px; padding: 20px 22px; border-radius: 16px; border: 2px solid #93c5fd; }
    .yp-answer-panel .slide-open-textarea { font-size: 20px; padding: 18px 20px; min-height: 340px; border-radius: 16px; border: 2px solid #93c5fd; resize: vertical; line-height: 1.6; }
    .yp-answer-panel .slide-opt-card { font-size: 19px; padding: 16px 20px; }
    .yp-answer-panel .slide-opt-letter { width: 40px; height: 40px; font-size: 17px; }
    @media (min-width: 961px) {
      .yp-space-slide-grid { grid-template-columns: minmax(0, 60fr) minmax(0, 40fr); gap: 28px; align-items: start; }
      .yp-space-col-left { max-height: calc(100vh - 320px); overflow-y: auto; padding-right: 10px; }
      .yp-space-col-right { position: sticky; top: 170px; align-items: flex-start; }
    }
    @media (max-width: 960px) {
      .yp-control-row { position: static; padding: 12px 14px 0; }
      .yp-control-left, .yp-control-right { width: 100%; }
      .yp-control-right .yp-bar-btn { flex: 1; }
      .yp-control-left .yp-bar-timer { flex: 1; justify-content: center; }
      .yp-timer-digits { font-size: 30px; }
      .yp-space-slide-section { min-height: 0; padding: 16px; }
      .yp-space-col-left { max-height: none; overflow: visible; }
      .yp-space-col-right { position: static; }
      .yp-space-scroll-stream { padding: 14px 12px 120px 12px !important; }
    }
    @media print { .yp-control-row { display: none !important; } }
    /* === MOBİL / GÖRSEL DÜZELTMELERİ === */
    .yp-space-col-left .yp-space-visual-frame { display: block !important; height: auto !important; }
    .yp-space-col-left .yp-space-visual-frame svg { display: block; margin: 0 auto; width: 100%; height: auto; }
    .yp-space-slide-grid > * { min-width: 0; }
    .yp-slide-main-title, .yp-question-card, .yp-slide-subtitle { overflow-wrap: anywhere; }
    @media (max-width: 960px) {
      .yp-space-slide-grid { grid-template-columns: minmax(0, 1fr) !important; }
      .space-topbar { flex-wrap: wrap; padding: 10px 12px; gap: 8px; }
      .doc-main-title, .space-badge { display: none; }
      .topbar-btn { padding: 8px 10px; font-size: 12px; }
      .yp-question-card { font-size: clamp(22px, 5.4vw, 26px) !important; padding: 18px 18px !important; }
      .yp-answer-panel { padding: 18px; }
      .yp-answer-panel .slide-open-textarea { min-height: 220px; }
      .yp-control-left { flex-wrap: nowrap; }
      .yp-control-row .yp-bar-timer { padding: 8px 14px !important; }
      .yp-control-row .yp-bar-counter { font-size: 18px !important; padding: 10px 14px !important; min-width: 70px; }
      .yp-control-row .yp-bar-btn { font-size: 17px !important; padding: 12px 16px !important; min-height: 50px; }
      .yp-space-watermark { display: none; }
    }
    @media (max-width: 600px) {
      .yp-control-row { padding: 8px 10px 0 !important; gap: 8px !important; }
      .yp-control-left { display: flex !important; gap: 6px !important; width: 100% !important; align-items: center !important; }
      .yp-control-row .yp-bar-timer { flex: 1 !important; padding: 6px 10px !important; min-width: 0 !important; gap: 6px !important; border-radius: 14px !important; }
      .yp-timer-label { font-size: 10px !important; letter-spacing: 0 !important; }
      .yp-timer-digits { font-size: 22px !important; }
      .yp-control-row .yp-bar-counter { font-size: 14px !important; padding: 6px 10px !important; min-width: 52px !important; border-radius: 14px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }
      .yp-control-right { width: 100% !important; gap: 8px !important; display: flex !important; }
      .yp-control-right .yp-bar-btn { flex: 1 !important; font-size: 15px !important; padding: 10px 12px !important; min-height: 44px !important; border-radius: 14px !important; }
    }
    /* end mobile */

    /* === TEK SORU SLAYT MODU & TESTİ BİTİR BUTONU === */
    .yp-space-scroll-stream { padding: 10px 28px 120px 28px !important; gap: 0 !important; }
    .yp-space-slide-section { display: none; min-height: calc(100vh - 210px); justify-content: flex-start; padding: 20px 24px; }
    .yp-space-slide-section.is-active { display: flex !important; }
    .yp-bar-finish {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4) !important;
      font-weight: 900 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .yp-bar-finish:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%) !important;
      transform: translateY(-1px);
    }
    @media print {
      .yp-space-slide-section { display: flex !important; page-break-after: always; }
    }


    /* === KAPSAYICI VE TAŞMA ENGELLEYİCİ GÜVENLİK KURALLARI === */
    html, body { overflow-x: hidden !important; max-width: 100vw !important; width: 100% !important; }
    .space-topbar { max-width: 100vw !important; box-sizing: border-box !important; }
    .yp-control-row { max-width: 100vw !important; box-sizing: border-box !important; }
    .yp-control-left, .yp-control-right { min-width: 0 !important; }
    .yp-space-scroll-stream { max-width: 100vw !important; box-sizing: border-box !important; overflow-x: hidden !important; }
    .yp-space-slide-section { max-width: 100% !important; box-sizing: border-box !important; overflow: hidden !important; }
    .yp-space-slide-grid { min-width: 0 !important; width: 100% !important; box-sizing: border-box !important; }
    .yp-space-col-left, .yp-space-col-right { min-width: 0 !important; width: 100% !important; box-sizing: border-box !important; }
    .yp-space-visual-frame { max-width: 100% !important; box-sizing: border-box !important; overflow: hidden !important; }
    .yp-space-visual-frame svg { max-width: 100% !important; height: auto !important; }
    .yp-neon-card, .yp-question-card, .yp-answer-panel { max-width: 100% !important; box-sizing: border-box !important; }

  </style>
</head>
<body>
  <div class="space-stars-layer"></div>
  <div class="space-nebula-glow"></div>

  <!-- Üst Kontrol Çubuğu -->
  <header class="space-topbar">
    <div class="topbar-left">
      <a href="/" class="brand-link" title="Rotalı Fenci Ana Sayfa">
        <div class="brand-avatar">
          <img src="${LOGO_SRC}" alt="Rotalı Fenci Logo">
        </div>
        <span class="brand-text">ROTALI FENCİ</span>
      </a>
      <span class="space-badge">☀️ YAZILIYA HAZIRLIK</span>
      <span class="doc-main-title">${safeTitle}</span>
    </div>

    <div class="topbar-right">
      <!-- ⏱️ Canlı Sınav Kronometresi (Her soruya 1 dakika) -->
      <div class="exam-countdown-badge" id="examTimerBadge" title="Kalan Sınav Süresi (Her soru için 1 dakika süre)">
        ⏱️ <span id="examTimerText">${qCount}:00</span>
      </div>
      <button type="button" class="topbar-btn" onclick="toggleSpaceViewerTheme()" title="Açık / Koyu Tema">
        <span id="themeIcon">🌙</span> <span id="themeLabel">Koyu Mod</span>
      </button>
      <button type="button" class="topbar-btn btn-finish-test" onclick="finishAndEvaluateExam()" title="Sınavı Tamamla ve Sonuç Karnesini Gör">
        <i class="fa-solid fa-flag-checkered"></i> <span>Testi Bitir</span>
      </button>
    </div>
  </header>

  <!-- Kontrol Satırı: Sol büyük kronometre + soru no / Sağ Önceki-Sonraki -->
  <div class="yp-control-row" id="ypControlRow">
    <div class="yp-control-left">
      <div class="yp-bar-timer" id="ypBottomTimer" title="Kalan Sınav Süresi">
        <span class="yp-timer-label">⏱️ KALAN SÜRE</span>
        <span class="yp-timer-digits" id="ypBottomTimerText">${qCount}:00</span>
      </div>
      <div class="yp-bar-counter" id="slideCounter" title="Aktif Soru / Toplam Soru">1 / ${qCount}</div>
    </div>
    <div class="yp-control-right">
    <button type="button" class="yp-bar-btn yp-bar-prev" id="btnPrevSlide" onclick="prevSlide()" title="Önceki Soru (Yukarı Ok)">
      ‹ Önceki
    </button>
    <button type="button" class="yp-bar-btn yp-bar-next" id="btnNextSlide" onclick="nextSlide()" title="Sonraki Soru (Aşağı Ok)">
      Sonraki &gt;
    </button>
    </div>
  </div>

  <!-- Dikey Kaydırma & Dokunmatik Slayt Akış Alanı -->
  <main class="yp-space-scroll-stream" id="spaceScrollStream">
    ${slidesHtml}
  </main>

  <!-- Sol Alt Filigran -->
  <a href="https://instagram.com/rotalifenci" target="_blank" rel="noopener" class="yp-space-watermark" title="@rotalifenci Instagram">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
    <span>@rotalifenci</span>
  </a>

  <!-- Sabit Alt Kontrol Çubuğu -->
  <nav class="yp-space-bottom-bar" aria-label="Soru Kontrolleri">


    <!-- ⏱️ Canlı Alt Kronometre -->



    <button type="button" class="yp-bar-btn yp-bar-finish" onclick="finishAndEvaluateExam()" title="Testi Bitir ve Otomatik Puanla">
      🏁 Testi Bitir &amp; Puanla
    </button>
    <button type="button" class="yp-bar-btn yp-bar-routes" onclick="toggleRoutesDrawer()" title="Soru Rotaları Menüsü">
      🧭 Soru Rotaları
    </button>

    <button type="button" class="yp-bar-icon-btn" onclick="toggleSpeechQuestion()" id="btnSpeech" title="Sesli Soru Okuma">
      🔊
    </button>

    <button type="button" class="yp-bar-icon-btn" onclick="toggleFullscreen()" title="Tam Ekran (F11)">
      ⛶
    </button>

  </nav>

  <!-- Soru Rotaları Menüsü Çekmecesi -->
  <div class="yp-space-routes-drawer" id="routesDrawer" style="display: none;">
    <div class="yp-space-routes-header">
      <h4>🧭 Soru Listesi &amp; Rotalar</h4>
      <button type="button" onclick="toggleRoutesDrawer()">✕</button>
    </div>
    <div class="yp-space-routes-list" id="routesList">
      ${drawerItemsHtml}
    </div>
  </div>

  <!-- Sonuç Karnesi Modalı -->
  <div class="result-modal-overlay" id="resultModal" style="display: none;">
    <div class="result-modal-card">
      <div class="result-modal-header">
        <h2 style="font-size:22px; font-weight:900; margin-bottom:4px;">🎯 Sınav Değerlendirme Karnesi</h2>
        <div style="font-size:13px; opacity:0.9;">${safeTitle}</div>
      </div>
      <div class="result-modal-body">
        <div class="result-score-circle" id="modalScoreVal">100</div>
        <div class="result-stats-row">
          <div class="result-stat-box" style="border-color:#a7f3d0;">
            <div class="result-stat-num" id="modalCorrectCount" style="color:#10b981;">0</div>
            <div class="result-stat-lbl">Doğru</div>
          </div>
          <div class="result-stat-box" style="border-color:#fecaca;">
            <div class="result-stat-num" id="modalWrongCount" style="color:#ef4444;">0</div>
            <div class="result-stat-lbl">Yanlış</div>
          </div>
          <div class="result-stat-box" style="border-color:#fde68a;">
            <div class="result-stat-num" id="modalEmptyCount" style="color:#f59e0b;">0</div>
            <div class="result-stat-lbl">Boş</div>
          </div>
        </div>
        <div class="result-time-row">
          ⏱️ Toplam Geçen Süre: <span id="modalTimeSpent" style="color:#0284c7; font-weight:900;">0 dk 0 sn</span>
        </div>
        <div class="result-modal-actions">
          <button type="button" class="btn-modal" style="background:#0284c7; color:#ffffff;" onclick="revealSolutionsAndReview()">💡 Soru Çözümlerini ve Doğru Cevapları İncele</button>
          <button type="button" class="btn-modal" style="background:#e2e8f0; color:#475569;" onclick="closeResultModal()">Kapat</button>
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
    let timerInterval = null;
    let isExamFinished = false;

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function updateTimerDisplay() {
      const str = formatTime(remainingSeconds);
      const topEl = document.getElementById('examTimerText');
      const bottomEl = document.getElementById('ypBottomTimerText');
      if (topEl) topEl.textContent = str;
      if (bottomEl) bottomEl.textContent = str;

      const topBadge = document.getElementById('examTimerBadge');
      const bottomBadge = document.getElementById('ypBottomTimer');
      if (remainingSeconds <= 60) {
        if (topBadge) topBadge.className = 'exam-countdown-badge timer-urgent';
        if (bottomBadge) bottomBadge.className = 'yp-bar-timer timer-urgent';
      } else if (remainingSeconds <= 300) {
        if (topBadge) topBadge.className = 'exam-countdown-badge timer-warning';
        if (bottomBadge) bottomBadge.className = 'yp-bar-timer timer-warning';
      }
    }

    function startExamTimer() {
      if (timerInterval) clearInterval(timerInterval);
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        if (isExamFinished) {
          clearInterval(timerInterval);
          return;
        }
        remainingSeconds--;
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

    // Slayt Navigasyonu
    function updateCounter(idx) {
      activeSlideIdx = Math.max(0, Math.min(totalQuestions - 1, idx));
      const counterEl = document.getElementById('slideCounter');
      if (counterEl) counterEl.textContent = (activeSlideIdx + 1) + ' / ' + totalQuestions;
      const __pb = document.getElementById('btnPrevSlide');
      const __nb = document.getElementById('btnNextSlide');
      if (__pb) __pb.disabled = activeSlideIdx <= 0;
      if (__nb) __nb.disabled = activeSlideIdx >= totalQuestions - 1;
      document.querySelectorAll('.yp-route-item').forEach((b, i) => {
        b.classList.toggle('active', i === activeSlideIdx);
      });
    }

    function goToSlide(idx) {
      activeSlideIdx = Math.max(0, Math.min(totalQuestions - 1, idx));
      document.querySelectorAll('.yp-space-slide-section').forEach((sec, i) => {
        const isCurrent = (i === activeSlideIdx);
        sec.classList.toggle('is-active', isCurrent);
        sec.style.display = isCurrent ? 'flex' : 'none';
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

    // Scroll Observer ile Otomatik Sayaç Takibi
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.slideIndex, 10);
          if (!isNaN(idx)) updateCounter(idx);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.yp-space-slide-section').forEach(sec => observer.observe(sec));
    updateCounter(0);

    // Klavye Yön Tuşları Desteği
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    });

    // Çoktan Seçmeli Seçenek Seçimi
    function selectSlideOption(qNum, optLetter) {
      studentAnswers[qNum] = optLetter;
      const cards = document.querySelectorAll('.slide-opt-card[data-qid="' + qNum + '"]');
      cards.forEach(c => {
        c.classList.toggle('is-selected', c.getAttribute('data-opt') === optLetter);
      });
    }

    function recordAnswer(qNum, val) {
      studentAnswers[qNum] = String(val).trim();
    }

    // Daha önce yazılan cevaplar hatırlanmasın / tarayıcı otomatik doldurmasın
    function clearAllTypedAnswers() {
      document.querySelectorAll('.slide-short-input, .slide-open-textarea').forEach(function (el) { el.value = ''; });
    }
    clearAllTypedAnswers();
    window.addEventListener('pageshow', clearAllTypedAnswers);

    // Sınav Bittiğinde Çözümleri Aç ve İncele
    function revealSolutionsAndReview() {
      document.querySelectorAll('.yp-golden-rule-box').forEach(box => {
        box.style.display = 'flex';
      });
      closeResultModal();
      goToSlide(0);
    }

    // Tema Değiştirme (Açık / Koyu)
    function toggleSpaceViewerTheme() {
      const isDark = document.body.classList.toggle('theme-dark');
      const icon = document.getElementById('themeIcon');
      const label = document.getElementById('themeLabel');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
      if (label) label.textContent = isDark ? 'Açık Mod' : 'Koyu Mod';
      try { localStorage.setItem('rotali_viewer_theme', isDark ? 'dark' : 'light'); } catch(e) {}
    }

    try {
      if (localStorage.getItem('rotali_viewer_theme') === 'dark') {
        document.body.classList.add('theme-dark');
        const icon = document.getElementById('themeIcon');
        const label = document.getElementById('themeLabel');
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Açık Mod';
      }
    } catch(e) {}

    // Çekmeceyi Aç / Kapat
    function toggleRoutesDrawer() {
      const drawer = document.getElementById('routesDrawer');
      if (!drawer) return;
      drawer.style.display = (drawer.style.display === 'none' || !drawer.style.display) ? 'flex' : 'none';
    }

    // Tam Ekran
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Sesli Okuma (Web Speech API)
    function toggleSpeechQuestion() {
      if (!('speechSynthesis' in window)) {
        alert('Tarayıcınız sesli okumayı desteklemiyor.');
        return;
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
      }
      const activeSlide = document.getElementById('yp-space-slide-' + activeSlideIdx);
      if (!activeSlide) return;
      const textToRead = activeSlide.querySelector('.yp-neon-card')?.innerText || '';
      const utter = new SpeechSynthesisUtterance(textToRead);
      utter.lang = 'tr-TR';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }

    // Sınavı Tamamla ve Değerlendir
    function finishAndEvaluateExam() {
      isExamFinished = true;
      if (timerInterval) clearInterval(timerInterval);

      const timeSpentSec = (totalQuestions * 60) - remainingSeconds;
      const spentMin = Math.floor(timeSpentSec / 60);
      const spentSec = timeSpentSec % 60;
      const timeSpentStr = spentMin + ' dk ' + spentSec + ' sn';
      const timeSpentEl = document.getElementById('modalTimeSpent');
      if (timeSpentEl) timeSpentEl.textContent = timeSpentStr;

      let correct = 0;
      let wrong = 0;
      let empty = 0;

      correctAnswers.forEach(ca => {
        const studentAns = studentAnswers[ca.id];
        if (!studentAns || studentAns === '') {
          empty++;
        } else if (ca.type === 'multiple_choice') {
          if (studentAns.toUpperCase() === ca.correct.toUpperCase()) correct++;
          else wrong++;
        } else {
          const cleanStudent = studentAns.toLowerCase().replace(/[^a-z0-9çğıöşü]/gi, '');
          const cleanCorrect = ca.correct.toLowerCase().replace(/[^a-z0-9çğıöşü]/gi, '');
          if (cleanStudent === cleanCorrect || cleanStudent.includes(cleanCorrect) || cleanCorrect.includes(cleanStudent)) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      const score = Math.round((correct / totalQuestions) * 100);
      document.getElementById('modalScoreVal').textContent = score + ' Puan';
      document.getElementById('modalCorrectCount').textContent = correct;
      document.getElementById('modalWrongCount').textContent = wrong;
      document.getElementById('modalEmptyCount').textContent = empty;
      // Otomatik olarak tüm soru çözümlerini aç ve göster
      document.querySelectorAll('.yp-golden-rule-box').forEach(box => {
        box.style.display = 'flex';
      });
      document.getElementById('resultModal').style.display = 'flex';
    }

    function closeResultModal() {
      document.getElementById('resultModal').style.display = 'none';
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
