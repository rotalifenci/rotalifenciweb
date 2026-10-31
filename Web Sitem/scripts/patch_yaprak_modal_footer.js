const fs = require('fs');

function patchModalFooter(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  const oldFooterRegex = /<!-- 📌 4\. ALT ÇUBUK -->[\s\S]*?<footer class="zk-bottombar">[\s\S]*?<\/footer>/;
  const newFooter = `<!-- 📌 4. ALT ÇUBUK (ORTALANMIŞ BUTON GRUBU) -->
      <footer class="zk-bottombar">
        <div class="zk-bottom-left"></div>
        <div class="zk-bottom-center">
          <button type="button" class="zk-bar-btn zk-prev-btn" id="ypSpaceBottomPrevBtn" onclick="document.getElementById('ypSpacePrevBtn').click()" title="Önceki Soru">‹ Önceki</button>
          <span class="zk-bottom-counter" id="ypSpaceBottomCounterPill">1 / 10</span>
          <button type="button" class="zk-bar-btn zk-next-btn" id="ypSpaceBottomNextBtn" onclick="document.getElementById('ypSpaceNextBtn').click()" title="Sonraki Soru">Sonraki ›</button>
          <button type="button" class="zk-bar-btn" id="ypSpaceRoutesBtn" title="Tüm soruları gör ve hızlı geçiş yap">
            🧭 Soru Rotaları
          </button>
          <button type="button" class="zk-finish-btn" id="zkModalFinishBtn" title="Önizlemede testi tamamla ve öğrenci puan raporunu göster" style="background:#059669;color:#fff;font-weight:800;">
            🏁 Testi Bitir &amp; Puanla
          </button>
        </div>
        <div class="zk-bottom-right">
          <a href="https://instagram.com/rotalifenci" target="_blank" rel="noopener" class="zk-watermark" title="@rotalifenci Instagram">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>@rotalifenci</span>
          </a>
        </div>
      </footer>`;

  if (oldFooterRegex.test(html)) {
    html = html.replace(oldFooterRegex, newFooter);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated modal footer in:', filePath);
  }
}

patchModalFooter('yaprak-test.html');
patchModalFooter('../yaprak-test.html');
patchModalFooter('../Yaprak Test/public/index.html');
