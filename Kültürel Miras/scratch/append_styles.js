const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const newStyles = `

/* ==========================================================================
   TÜBİTAK 2204-B: SİVAS DİJİTAL TARİH ATLASI - MASTER ARAYÜZ YENİLİKLERİ
   ========================================================================== */

/* 1. MAP HERO BANNER (ANA SAYFA ÜST MERKEZİ BAŞLIK VE REHBER SEÇİMİ) */
.map-hero-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.1rem 1.75rem;
  margin-bottom: 0.85rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.94) 50%, rgba(45, 30, 20, 0.9) 100%);
  border: 1px solid rgba(217, 119, 6, 0.35);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 20;
}

.hero-text-block {
  flex: 1 1 320px;
}

.hero-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(217, 119, 6, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  border-radius: 99px;
  margin-bottom: 0.4rem;
}

.hero-main-title {
  font-family: 'Cinzel', 'Playfair Display', 'Merriweather', serif;
  font-size: 1.65rem;
  font-weight: 800;
  color: #fef08a;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.hero-sub-title {
  color: #cbd5e1;
  font-size: 0.9rem;
  font-style: italic;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* 2. REHBER SEÇİM BİLEŞENİ (EREN & AYBÜKE) */
.hero-guide-picker {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 12px;
  padding: 0.5rem 0.85rem;
  backdrop-filter: blur(8px);
}

.guide-picker-label {
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.guide-picker-buttons {
  display: flex;
  gap: 0.5rem;
}

.guide-btn-pick {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(30, 41, 59, 0.7);
  border: 1.5px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  padding: 0.4rem 0.8rem;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.guide-btn-pick:hover {
  background: rgba(51, 65, 85, 0.9);
  border-color: rgba(245, 158, 11, 0.5);
  transform: translateY(-1px);
}

.guide-btn-pick.active {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(15, 23, 42, 0.9));
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
}

.guide-avatar-emoji {
  font-size: 1.35rem;
  line-height: 1;
}

.guide-pick-meta {
  display: flex;
  flex-direction: column;
}

.guide-pick-meta strong {
  font-size: 0.82rem;
  line-height: 1.1;
  color: #f8fafc;
}

.guide-pick-meta small {
  font-size: 0.68rem;
  color: #94a3b8;
}

.guide-btn-pick.active .guide-pick-meta small {
  color: #fbbf24;
}

.guide-audio-btn {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.guide-audio-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
  color: #f59e0b;
}

.guide-audio-btn.active {
  background: #f59e0b;
  color: #1e1b4b;
  border-color: #f59e0b;
}

/* 3. HARİTA FİLTRE ŞERİDİ (MAP FILTER RIBBON) */
.map-filter-ribbon {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 0.85rem;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 15;
}

.ribbon-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.ribbon-group label {
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.period-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.period-pill {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-pill:hover {
  background: rgba(51, 65, 85, 0.9);
  color: #fff;
  border-color: rgba(245, 158, 11, 0.5);
}

.period-pill.active {
  background: #d97706;
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
}

.ribbon-select {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #f8fafc;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

.ribbon-select:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.ribbon-actions {
  margin-left: auto;
}

.btn-ribbon-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(51, 65, 85, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ribbon-reset:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #fca5a5;
}

/* 4. DİJİTAL REHBER FLOATING WIDGET */
.guide-floating-widget {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  max-width: 360px;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.guide-floating-widget.minimized .guide-speech-content {
  display: none;
}

.guide-widget-card {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  border: 1.5px solid rgba(245, 158, 11, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  border-radius: 16px;
  padding: 0.85rem 1.1rem;
  backdrop-filter: blur(12px);
  position: relative;
}

.guide-avatar-badge {
  font-size: 2.2rem;
  line-height: 1;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 12px;
  padding: 0.25rem;
  flex-shrink: 0;
}

.guide-speech-content {
  flex: 1;
}

.guide-speech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.guide-name-tag {
  font-weight: 800;
  font-size: 0.85rem;
  color: #fbbf24;
  letter-spacing: 0.3px;
}

.guide-widget-controls {
  display: flex;
  gap: 0.3rem;
}

.guide-ctrl-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  font-size: 0.85rem;
  transition: color 0.15s;
}

.guide-ctrl-btn:hover {
  color: #f8fafc;
}

.guide-speech-text {
  font-size: 0.82rem;
  line-height: 1.45;
  color: #e2e8f0;
  margin: 0;
}

/* 5. GERÇEK KİTABE İNCELEME VE EPİGRAFİK FİLTRELER */
.ins-filter-bar {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.ins-filter-btn {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.ins-filter-btn:hover {
  background: rgba(51, 65, 85, 0.9);
  color: #fff;
  border-color: #f59e0b;
}

.ins-filter-btn.active {
  background: #f59e0b;
  color: #1e1b4b;
  border-color: #f59e0b;
  font-weight: 700;
}

/* CSS Epigrafi Filtre Sınıfları */
.ins-filter-normal {
  filter: none !important;
}

.ins-filter-contrast {
  filter: contrast(185%) brightness(95%) saturate(110%) !important;
}

.ins-filter-emboss {
  filter: contrast(240%) grayscale(100%) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.9)) !important;
}

.ins-filter-invert {
  filter: invert(100%) contrast(160%) !important;
}

.arabic-inscription-box {
  direction: rtl;
  text-align: right;
  font-family: 'Amiri', 'Traditional Arabic', 'Scheherazade New', serif;
  font-size: 1.55rem;
  line-height: 2.2;
  color: #fef08a;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 0.85rem 0;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
}

/* 6. BİLİMSEL KANIT ROZETLERİ (EVIDENCE BADGES) */
.badge-evidence {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 0.25rem 0.65rem;
  border-radius: 99px;
  white-space: nowrap;
}

.badge-evidence.verified {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #34d399;
}

.badge-evidence.academic {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #60a5fa;
}

.badge-evidence.reconstruction {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

/* 7. 4 AŞAMALI YAPILANDIRILMIŞ ÇIKARIM ŞABLONU (STRUCTURED INQUIRY) */
.structured-inquiry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin: 1.25rem 0;
}

@media (max-width: 860px) {
  .structured-inquiry-grid {
    grid-template-columns: 1fr;
  }
}

.inquiry-cell {
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid rgba(148, 163, 184, 0.25);
  border-radius: 12px;
  padding: 1rem 1.15rem;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease;
}

.inquiry-cell:focus-within {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.inquiry-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #f8fafc;
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.inquiry-cell small {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.6rem;
  display: block;
}

.inquiry-textarea {
  width: 100%;
  min-height: 95px;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  font-family: inherit;
  font-size: 0.84rem;
  line-height: 1.5;
  padding: 0.65rem 0.8rem;
  resize: vertical;
}

.inquiry-textarea:focus {
  outline: none;
  border-color: #f59e0b;
}

/* 8. YÖNETİCİ GİRİŞİ KİLİT KATMANI (ADMIN AUTH OVERLAY) */
.admin-auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(14px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 1.5rem;
}

.auth-card {
  max-width: 440px;
  width: 100%;
  text-align: center;
  background: rgba(30, 41, 59, 0.9);
  border: 1.5px solid rgba(245, 158, 11, 0.5);
  border-radius: 16px;
  padding: 2.25rem 2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

.auth-icon {
  font-size: 2.8rem;
  color: #f59e0b;
  margin-bottom: 1rem;
}

.auth-card h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.35rem;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
}

.auth-card p {
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.auth-input-group {
  display: flex;
  gap: 0.5rem;
}

.auth-input-group input {
  flex: 1;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  color: #f8fafc;
  padding: 0.6rem 0.85rem;
  font-size: 0.9rem;
  outline: none;
}

.auth-input-group input:focus {
  border-color: #f59e0b;
}

.auth-error-msg {
  color: #ef4444;
  font-size: 0.82rem;
  margin-top: 0.6rem;
}

/* 9. YAZDIRMA VE RAPOR DIŞA AKTARIMI (PRINT / PDF STYLES) */
@media print {
  body {
    background: #ffffff !important;
    color: #1e293b !important;
    font-size: 12pt;
  }

  .atlas-header,
  .map-hero-banner,
  .hero-guide-picker,
  .map-filter-ribbon,
  .guide-floating-widget,
  .comparison-controls,
  .preset-buttons,
  .inquiry-actions-bar,
  .atlas-footer,
  .btn,
  .btn-action-primary,
  .btn-action-secondary {
    display: none !important;
  }

  .content-tab {
    display: block !important;
  }

  .comparison-table-wrapper {
    box-shadow: none !important;
    border: 1px solid #cbd5e1 !important;
  }

  .comparison-table th,
  .comparison-table td {
    color: #0f172a !important;
    border: 1px solid #cbd5e1 !important;
  }

  .structured-inquiry-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 1rem !important;
  }

  .inquiry-cell {
    background: #f8fafc !important;
    border: 1px solid #94a3b8 !important;
    color: #0f172a !important;
  }

  .inquiry-textarea {
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #cbd5e1 !important;
  }
}
`;

css += newStyles;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Styles appended successfully.');
