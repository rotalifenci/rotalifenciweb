const fs = require('fs');

const newStyles = `
/* ========================================================
   🎯 ÇOKLU SORU TÜRÜ VE SAYILARI SEÇİM PANELİ (MAARİF MODELİ)
   ======================================================== */
.qt-multiselect-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qt-total-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #bfdbfe;
  box-shadow: 0 1px 2px rgba(29, 78, 216, 0.08);
}

.qt-hint-text {
  font-size: 12px;
  color: #64748b;
  margin-top: -4px;
  line-height: 1.4;
}

.qt-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qt-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.qt-item-row:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.qt-item-row.is-active {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.12);
}

.qt-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
  user-select: none;
}

.qt-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  accent-color: #2563eb;
  cursor: pointer;
}

.qt-icon {
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.qt-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qt-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.qt-sub {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.qt-count-box {
  display: flex;
  align-items: center;
  gap: 6px;
  shrink: 0;
}

.qt-count-input {
  width: 58px;
  height: 34px;
  text-align: center;
  font-weight: 800;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 4px;
  transition: all 0.15s ease;
}

.qt-count-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.qt-count-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.qt-unit {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

/* Çıktı Dosyası Format Seçimi */
.qt-output-format-card {
  margin-top: 6px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qt-output-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 6px;
}

.qt-output-radios {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.qt-radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #1e293b;
  cursor: pointer;
  user-select: none;
}

.qt-radio-item input[type="radio"] {
  accent-color: #2563eb;
  cursor: pointer;
}

/* Önizleme Üstü Dosya Sekmeleri (Batch File Tabs) */
.batch-file-tabs-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.batch-tabs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.batch-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.batch-tab-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.batch-tab-btn.is-active {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.btn-batch-publish {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 800;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #ffffff;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  transition: all 0.2s ease;
  shrink: 0;
}

.btn-batch-publish:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

/* Ünite Hapları (Asla boş ve basık görünmesin) */
.unit-pills-container {
  min-height: 48px;
}
`;

function patchCss(filePath) {
  if (!fs.existsSync(filePath)) return;
  let css = fs.readFileSync(filePath, 'utf8');
  if (!css.includes('qt-multiselect-panel')) {
    css += '\n' + newStyles;
  }
  fs.writeFileSync(filePath, css, 'utf8');
  console.log('Successfully patched CSS:', filePath);
}

patchCss('css/yaprak-test.css');
patchCss('../css/yaprak-test.css');
patchCss('../Yaprak Test/public/css/yaprak-test.css');
