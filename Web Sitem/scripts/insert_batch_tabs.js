const fs = require('fs');

function insertBatchTabs(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const isCrlf = raw.includes('\r\n');
  let html = raw.replace(/\r\n/g, '\n');

  const target = `<div class="toolbar no-print" id="actionToolbar" style="display: none;">`;
  const batchHtml = `<!-- Çoklu Dosya Sekmeleri ve Hızlı Dosya Geçiş Barı -->
        <div id="batchFileTabsBar" class="batch-file-tabs-bar no-print" style="display: none;">
          <div class="batch-tabs-title" style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 800; color: #1e293b;">
            <span style="font-size: 16px;">📁</span>
            <span>Hazırlanan Soru Türleri / Dosyalar:</span>
          </div>
          <div class="batch-tabs-list" id="batchTabsList">
            <!-- Dinamik Olarak Sekmeler Buraya Basılır -->
          </div>
          <button type="button" id="batchPublishAllBtn" class="btn btn-sm btn-batch-publish" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; font-weight: 800; border: none; border-radius: 10px; padding: 8px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);" title="Tüm soru türlerini ayrı ayrı web sitesine aktar">
            <span>🚀</span> Tüm Dosyaları Ayrı Ayrı Web Siteme Aktar
          </button>
        </div>

        ${target}`;

  if (!html.includes('id="batchFileTabsBar"')) {
    html = html.replace(target, batchHtml);
    if (isCrlf) html = html.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Successfully inserted batchFileTabsBar into ${filePath}`);
  } else {
    console.log(`batchFileTabsBar already present in ${filePath}`);
  }
}

insertBatchTabs('yaprak-test.html');
insertBatchTabs('../yaprak-test.html');
