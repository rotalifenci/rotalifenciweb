const fs = require('fs');
const path = require('path');

// 1. Update zkitap_engine files
function updateZKitapEngine(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Font sizes: Soru yazısını alana göre daha büyük ve okunaklı yap
  code = code.replace(
    /\.zk-size-large\s*\{[\s\S]*?\}/,
    `.zk-size-large {
      font-size: clamp(24px, 2.3vw, calc(32px * var(--zk-font-scale, 1.0)));
      line-height: 1.5;
    }`
  );
  code = code.replace(
    /\.zk-size-medium\s*\{[\s\S]*?\}/,
    `.zk-size-medium {
      font-size: clamp(21px, 2.0vw, calc(28px * var(--zk-font-scale, 1.0)));
      line-height: 1.45;
    }`
  );
  code = code.replace(
    /\.zk-size-compact\s*\{[\s\S]*?\}/,
    `.zk-size-compact {
      font-size: clamp(18px, 1.7vw, calc(24px * var(--zk-font-scale, 1.0)));
      line-height: 1.4;
    }`
  );
  code = code.replace(
    /\.zk-question-stem\s*\{[\s\S]*?word-break:\s*break-word;\s*\}/,
    `.zk-question-stem {
      color: #000000;
      font-weight: 850;
      line-height: 1.5;
      letter-spacing: -0.2px;
      margin-bottom: 16px;
      word-break: break-word;
    }`
  );

  // B. Bottom bar: Centered navigation cluster
  // CSS:
  const oldBottomBarCss = /\.zk-bottombar\s*\{[\s\S]*?\.zk-bottom-left,\s*\.zk-bottom-right\s*\{[\s\S]*?\}/;
  const newBottomBarCss = `.zk-bottombar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 95;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      border-top: 1.5px solid #e2e8f0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
    }
    .zk-bottom-left {
      min-width: 140px;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .zk-bottom-center {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: nowrap;
      margin: 0 auto;
    }
    .zk-bottom-right {
      min-width: 140px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }`;

  if (oldBottomBarCss.test(code)) {
    code = code.replace(oldBottomBarCss, newBottomBarCss);
  }

  // HTML in footer:
  const oldFooterRegex = /<footer class="zk-bottombar">[\s\S]*?<\/footer>/;
  const newFooter = `<footer class="zk-bottombar">
    <div class="zk-bottom-left">
      <!-- Sol dengeleyici -->
    </div>

    <!-- Ortalanmış Buton Grubu: Önceki / Sayaç / Sonraki / Rotalar / Bitir & Puanla / Sesli Oku -->
    <div class="zk-bottom-center">
      <button type="button" class="zk-bottom-btn zk-prev-btn" onclick="prevSlide()" title="Önceki Soru (Sol Ok)">‹ Önceki</button>
      <span class="zk-bottom-counter" id="zkBottomCounter">1 / \${qCount}</span>
      <button type="button" class="zk-bottom-btn zk-next-btn" onclick="nextSlide()" title="Sonraki Soru (Sağ Ok)">Sonraki ›</button>
      <button type="button" class="zk-bottom-btn" onclick="toggleRoutesDrawer()" title="Tüm Soruları Gör">
        🧭 Soru Rotaları
      </button>
      <button type="button" class="zk-bottom-btn zk-bottom-finish-btn" onclick="finishAndEvaluateExam()" style="background:#059669;color:#fff;font-weight:800;" title="Testi Bitir ve Çözümleri Gör">
        🏁 Testi Bitir &amp; Puanla
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
  </footer>`;

  if (oldFooterRegex.test(code)) {
    code = code.replace(oldFooterRegex, newFooter);
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated zkitap_engine:', filePath);
}

updateZKitapEngine('scripts/zkitap_engine.js');
updateZKitapEngine('api/zkitap_engine.js');
if (fs.existsSync('../Yaprak Test/zkitap_engine.js')) {
  updateZKitapEngine('../Yaprak Test/zkitap_engine.js');
}

// 2. Update js/app.js and ../js/app.js to purge stale cached tests from localStorage
function updateAppJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Stale localStorage purge in openInteractiveTestModal
  const oldCacheCheck = `    // 1. Tarayıcıda anında önbelleklenmiş tam HTML var mı kontrol et (0ms Gecikme & Kesin 404 Koruması)
    let cachedHtml = "";
    try {
        if (materialId) cachedHtml = localStorage.getItem("rotali_test_html_" + materialId);
        if (!cachedHtml && cleanFileName) cachedHtml = localStorage.getItem("rotali_test_html_" + cleanFileName);
    } catch(e) {}`;

  const newCacheCheck = `    // 1. Eski şablon kalıntısı olmaması için eski önbelleği temizle ve daima güncel Z-Kitap motorunu yükle
    let cachedHtml = "";
    try {
        if (materialId) {
            const raw = localStorage.getItem("rotali_test_html_" + materialId);
            if (raw && raw.includes("zk-main-viewport")) cachedHtml = raw;
            else localStorage.removeItem("rotali_test_html_" + materialId);
        }
        if (!cachedHtml && cleanFileName) {
            const raw = localStorage.getItem("rotali_test_html_" + cleanFileName);
            if (raw && raw.includes("zk-main-viewport")) cachedHtml = raw;
            else localStorage.removeItem("rotali_test_html_" + cleanFileName);
        }
    } catch(e) {}

    // Statik dosya önbelleğini kırmak için versiyon parametresi ekle
    const directTestUrl = cleanFileName ? \`/testler/\${cleanFileName}?v=\${Date.now()}\` : targetUrl;`;

  if (code.includes(oldCacheCheck)) {
    code = code.replace(oldCacheCheck, newCacheCheck);
    code = code.replace(
      'iframe.src = cachedHtml ? "about:blank" : viewerUrl;',
      'iframe.src = cachedHtml ? "about:blank" : directTestUrl;'
    );
    code = code.replace(
      'src="${cachedHtml ? \'about:blank\' : viewerUrl}"',
      'src="${cachedHtml ? \'about:blank\' : directTestUrl}"'
    );
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Updated openInteractiveTestModal in', filePath);
  }
}

updateAppJs('js/app.js');
if (fs.existsSync('../js/app.js')) {
  updateAppJs('../js/app.js');
}
