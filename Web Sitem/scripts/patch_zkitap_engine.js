const fs = require('fs');
const path = require('path');

let logoBase64 = '';
try {
  let p = path.join(__dirname, '..', 'assets', 'rotali-fenci-logo.jpg');
  if (fs.existsSync(p)) {
    logoBase64 = 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }
} catch(e) {}

function patchEngine(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Logo fallback to base64
  if (logoBase64 && !code.includes('const EMBEDDED_LOGO_B64 =')) {
    code = `const EMBEDDED_LOGO_B64 = "${logoBase64}";\n` + code;
    code = code.replace(
      "logoSrc = '/assets/rotali-fenci-logo.jpg'",
      "logoSrc = (typeof EMBEDDED_LOGO_B64 !== 'undefined' && EMBEDDED_LOGO_B64) ? EMBEDDED_LOGO_B64 : '/assets/rotali-fenci-logo.jpg'"
    );
  }

  // 2. Kısa cevaplı sorularda sarı daire / şekil temizliği
  const oldVisualSnippet = "let visualHtml = '';\n    if (q.visual_svg && q.visual_svg.trim()) {";
  const newVisualSnippet = `let visualHtml = '';
    // Kısa Cevaplı / Boşluk Doldurma sorularında şekiller olmasın (kullanıcı talimatı)
    if (q.visual_svg && q.visual_svg.trim() && !isShortAnswer) {
      const vSvg = q.visual_svg.trim();
      const isPlaceholder = />\\s*Soru\\s*\\d+\\s*<\\/text>/.test(vSvg) && vSvg.length < 700;
      const isYellowQuestionCircle = /<circle[^>]*cx=["']260["'][^>]*cy=["']180["'][^>]*r=["']135["']/.test(vSvg) ||
                                     /<text[^>]*>\\?<\\/text>/.test(vSvg) && vSvg.length < 1500;
      if (!isPlaceholder && !isYellowQuestionCircle) {
        visualHtml = \`<div class="zk-visual-container">\${vSvg}</div>\`;
      }
    } else if (false) {`;

  if (code.includes(oldVisualSnippet) && !code.includes('!isShortAnswer')) {
    code = code.replace(oldVisualSnippet, newVisualSnippet);
  }

  // 3. Alt çubuğa Önceki/Sonraki ve Testi Bitir ekleme
  if (!code.includes('zk-bottom-finish-btn')) {
    const bottomMarker = '<div class="zk-bottom-left">\n      <button type="button" class="zk-bottom-btn" onclick="toggleRoutesDrawer()">\n        🧭 Soru Rotaları\n      </button>';
    const newBottom = `<div class="zk-bottom-left">
      <!-- Önceki / Sayaç / Sonraki (Her soruda sabit ve erişilebilir) -->
      <button type="button" class="zk-bottom-btn zk-prev-btn" onclick="prevSlide()" title="Önceki Soru (Sol Ok)">‹ Önceki</button>
      <span class="zk-bottom-counter" id="zkBottomCounter">1 / \${qCount}</span>
      <button type="button" class="zk-bottom-btn zk-next-btn" onclick="nextSlide()" title="Sonraki Soru (Sağ Ok)">Sonraki ›</button>
      <button type="button" class="zk-bottom-btn" onclick="toggleRoutesDrawer()" title="Tüm Soruları Gör">
        🧭 Soru Rotaları
      </button>
      <button type="button" class="zk-bottom-btn zk-bottom-finish-btn" onclick="finishAndEvaluateExam()" style="background:#059669;color:#fff;font-weight:800;" title="Testi Bitir ve Çözümleri Gör">
        🏁 Testi Bitir &amp; Puanla
      </button>`;
    code = code.replace(bottomMarker, newBottom);
  }

  // 4. Soru Rotaları Çekmecesine Testi Bitir Butonu
  if (!code.includes('zk-routes-footer-finish')) {
    const drawerCloseMarker = '</div>\n  </div>\n\n  <!-- Ses Sentezi Scripti';
    const drawerFinishBtn = `    </div>
    <div style="padding:12px;border-top:1.5px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:center;">
      <button type="button" class="zk-routes-footer-finish" onclick="toggleRoutesDrawer(); finishAndEvaluateExam();" style="width:100%;padding:10px 16px;background:#059669;color:#fff;font-size:13px;font-weight:800;border-radius:10px;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(5,150,105,0.3);">
        🏁 Testi Bitir ve Çözümleri Gör
      </button>
    </div>
  </div>

  <!-- Ses Sentezi Scripti`;
    code = code.replace('</div>\n  </div>\n\n  <!-- Ses Sentezi Scripti', drawerFinishBtn);
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully patched zkitap_engine:', filePath);
}

patchEngine('scripts/zkitap_engine.js');
patchEngine('api/zkitap_engine.js');
if (fs.existsSync('../Yaprak Test/zkitap_engine.js')) {
  patchEngine('../Yaprak Test/zkitap_engine.js');
}
