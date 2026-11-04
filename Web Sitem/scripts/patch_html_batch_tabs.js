const fs = require('fs');

function patchHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. CSS ekle (head içine)
  if (!html.includes('.batch-tab-btn')) {
    const cssSnippet = `
    /* Çoklu Soru Türü ve Batch Sekmeleri */
    .batch-file-tabs-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      flex-wrap: wrap;
    }
    .batch-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .batch-tab-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .batch-tab-btn.is-active {
      background: #2563eb;
      border-color: #1d4ed8;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    }
    </style>`;
    html = html.replace('</style>', cssSnippet);
  }

  // 2. HTML elemanlarını ekle (viewControlsBar sonrasına)
  if (!html.includes('id="batchFileTabsBar"')) {
    const target = '</div>\n\n        <!-- Yükleniyor Ekranı -->';
    const batchHtml = `</div>

        <!-- 📁 ÇOKLU SORU TÜRÜ VE DOSYA SEKME ÇUBUĞU (4 Kategori) -->
        <div class="batch-file-tabs-bar no-print" id="batchFileTabsBar" style="display: none;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 13px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 6px;">
              <span>📁</span> <span>İçerik Kategorileri:</span>
            </span>
            <div class="batch-tabs-list" id="batchTabsList" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <!-- JS ile doldurulacak sekmeler: Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Etkinlik -->
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" id="batchPublishAllBtn" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); font-weight: 700; box-shadow: 0 2px 6px rgba(37,99,235,0.3);" title="Üretilen bütün soru gruplarını web sitenize otomatik ekleyin">
              <span>🚀</span> <span>Tüm Dosyaları Web Siteme Aktar</span>
            </button>
          </div>
        </div>

        <!-- Yükleniyor Ekranı -->`;
    html = html.replace(target, batchHtml);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully patched batch tabs into:', filePath);
}

patchHtml('yaprak-test.html');
patchHtml('../yaprak-test.html');
