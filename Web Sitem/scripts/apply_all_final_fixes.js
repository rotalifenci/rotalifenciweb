const fs = require('fs');
const path = require('path');

console.log('=== 1. UPDATING Z-KITAP ENGINE (CENTER BUTTONS & ZERO SCROLL) ===');
const enginePaths = [
  path.join(__dirname, 'zkitap_engine.js'),
  path.join(__dirname, '..', 'api', 'zkitap_engine.js'),
  path.join(__dirname, '..', '..', 'Yaprak Test', 'zkitap_engine.js')
];

enginePaths.forEach(p => {
  if (!fs.existsSync(p)) {
    console.log('Skipping (not found):', p);
    return;
  }
  let code = fs.readFileSync(p, 'utf8');

  // Replace bottombar CSS: absolute left & right, centered center
  const oldBottomBarRegex = /\.zk-bottombar\s*\{[\s\S]*?\.zk-bottom-btn/m;
  const newBottomBarCss = `.zk-bottombar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      max-height: 60px;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 24px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      border-top: 1.5px solid #e2e8f0;
      box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.04);
    }
    .zk-bottom-left {
      position: absolute;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
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
      position: absolute;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .zk-bottom-btn`;

  code = code.replace(oldBottomBarRegex, newBottomBarCss);

  // Strict zero scroll & overflow hidden on html, body
  code = code.replace(/html,\s*body\s*\{[\s\S]*?body\s*\{[\s\S]*?overflow:\s*hidden;/m,
`html, body {
      width: 100%;
      height: 100vh !important;
      max-height: 100vh !important;
      overflow: hidden !important; /* Ekranda kaydırma KESİNLİKLE olmasın (Z-Kitap Akıllı Tahta) */
      background: var(--zk-bg);
      color: var(--zk-text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: text;
    }

    body {
      display: flex;
      flex-direction: column;
      height: 100vh !important;
      max-height: 100vh !important;
      overflow: hidden !important;`);

  // Main viewport sizing
  code = code.replace(/\.zk-main-viewport\s*\{[\s\S]*?height:\s*calc\(100vh\s*-\s*120px\);[\s\S]*?overflow:\s*hidden;[\s\S]*?box-sizing:\s*border-box;\s*\}/m,
`.zk-main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      background: #ffffff;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 10px 24px 68px 24px !important;
      height: calc(100vh - 116px) !important;
      max-height: calc(100vh - 116px) !important;
      overflow: hidden !important;
      box-sizing: border-box;
    }`);

  // Visual container max-height to leave room for text
  code = code.replace(/max-height:\s*25vh;/g, 'max-height: 22vh;');
  code = code.replace(/max-height:\s*24vh;/g, 'max-height: 21vh;');

  // Textarea max-height to prevent pushing
  code = code.replace(/\.zk-inline-textarea\s*\{[\s\S]*?resize:\s*vertical;\s*\}/m,
`.zk-inline-textarea {
      width: 100%;
      font-size: calc(18px * var(--zk-font-scale, 1.0));
      padding: 10px 14px;
      border-radius: 10px;
      border: 1.5px solid #93c5fd;
      background: #ffffff;
      color: #0f172a;
      font-weight: 600;
      line-height: 1.5;
      max-height: 70px;
      resize: none;
    }`);

  fs.writeFileSync(p, code, 'utf8');
  console.log('Updated engine file:', p);
});

console.log('\n=== 2. UPDATING JS/APP.JS (SUBTOPIC QTYPES, ZERO TEST-DENEME COUNT, PURGE CACHE) ===');
const appJsPaths = [
  path.join(__dirname, '..', 'js', 'app.js'),
  path.join(__dirname, '..', '..', 'js', 'app.js')
];

appJsPaths.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  // Fix 1: Close subtopic-pill-container BEFORE qtype-pill-container
  const targetSubtopicBlock = `                                            <!-- Numaralı Alt Başlıklar (Örn: 1. Güneş'in Yapısı ve Özellikleri) -->
                                            \${subtopics.map((sub) => {
                                                const matchCount = totalItems.filter(item => isMaterialMatchingSubtopic(item, sub)).length;
                                                return \`
                                                <button type="button"
                                                        onclick="filterMaterialsBySubtopic('\${unitNum}', '\${sub.num}', '\${grade.number}', '\${normSubTab}')"
                                                        data-subtopic="\${sub.num}"
                                                        class="subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer hover:border-slate-300">
                                                    <span class="min-w-[26px] px-1.5 h-5 rounded-lg bg-blue-100 text-blue-800 font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs">\${sub.code || sub.num}</span>
                                                    <span class="truncate max-w-[280px] sm:max-w-none">\${sub.shortTitle || sub.title}</span>
                                                    \${matchCount > 0 ? \`<span class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-black shadow-2xs">\${matchCount}</span>\` : ''}
                                                </button>
                                                \`;
                                            }).join('')}
                                        
                                        <!-- 📌 4 Soru Türü Filtreleme Butonları (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası) -->
                                        <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin qtype-pill-container" data-unit="\${unitNum}">`;

  const replacementSubtopicBlock = `                                            <!-- Numaralı Alt Başlıklar (Örn: 1. Güneş'in Yapısı ve Özellikleri) -->
                                            \${subtopics.map((sub) => {
                                                const matchCount = totalItems.filter(item => isMaterialMatchingSubtopic(item, sub)).length;
                                                return \`
                                                <button type="button"
                                                        onclick="filterMaterialsBySubtopic('\${unitNum}', '\${sub.num}', '\${grade.number}', '\${normSubTab}')"
                                                        data-subtopic="\${sub.num}"
                                                        class="subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer hover:border-slate-300">
                                                    <span class="min-w-[26px] px-1.5 h-5 rounded-lg bg-blue-100 text-blue-800 font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs">\${sub.code || sub.num}</span>
                                                    <span class="truncate max-w-[280px] sm:max-w-none">\${sub.shortTitle || sub.title}</span>
                                                    \${matchCount > 0 ? \`<span class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-black shadow-2xs">\${matchCount}</span>\` : ''}
                                                </button>
                                                \`;
                                            }).join('')}
                                        </div>

                                        <!-- 📌 4 Soru Türü Filtreleme Butonları (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası) -->
                                        <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin qtype-pill-container" data-unit="\${unitNum}">`;

  if (code.includes(targetSubtopicBlock)) {
    code = code.replace(targetSubtopicBlock, replacementSubtopicBlock);
    console.log('Fixed subtopic-pill-container closure in:', p);
  } else {
    console.log('Target subtopic block pattern not found directly, checking regex replacement...');
    code = code.replace(/(\$\{subtopics\.map[\s\S]*?\}\.join\(''\)\})\s*<!-- 📌 4 Soru Türü Filtreleme Butonları/m,
      `$1\n                                        </div>\n\n                                        <!-- 📌 4 Soru Türü Filtreleme Butonları`);
  }

  // Fix 2: Ensure getTabCustomCount('soru-bankasi') strictly returns 0
  code = code.replace(/const getTabCustomCount = \(tabKey\) => \{[\s\S]*?const deletedIds/m,
`const getTabCustomCount = (tabKey) => {
        if (tabKey === "soru-bankasi") return 0; // Test ve sınavlar sadece Yazılıya Hazırlık bölümünde gösterilir
        const deletedIds`);

  // Fix 3: In openInteractiveTestModal, clear stale localStorage and force fresh load with cache buster
  const oldModalCacheLogic = `    // 1. Tarayıcıda anında önbelleklenmiş tam HTML var mı kontrol et (0ms Gecikme & Kesin 404 Koruması)
    let cachedHtml = "";
    try {
        if (materialId) cachedHtml = localStorage.getItem("rotali_test_html_" + materialId);
        if (!cachedHtml && cleanFileName) cachedHtml = localStorage.getItem("rotali_test_html_" + cleanFileName);
    } catch(e) {}`;

  const newModalCacheLogic = `    // 1. Eski format önbelleği temizle ve daima taze Z-Kitap dosyasını yükle
    try {
        if (typeof localStorage !== "undefined") {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith("rotali_test_html_")) {
                    const item = localStorage.getItem(k);
                    if (!item || !item.includes("zk-main-viewport") || !item.includes("zk-bottom-center")) {
                        localStorage.removeItem(k);
                    }
                }
            });
        }
    } catch(e) {}
    let cachedHtml = "";`;

  if (code.includes(oldModalCacheLogic)) {
    code = code.replace(oldModalCacheLogic, newModalCacheLogic);
  }

  // Ensure iframe loads fresh URL with ?v=timestamp
  code = code.replace(/const viewerUrl = cleanFileName \? `\/api\/test-viewer\?file=\${encodeURIComponent\(cleanFileName\)}` : targetUrl;/g,
    `const viewerUrl = (cleanFileName ? \`/testler/\${cleanFileName}\` : targetUrl) + '?v=' + Date.now();`);

  fs.writeFileSync(p, code, 'utf8');
  console.log('Updated app.js in:', p);
});

console.log('\n=== 3. UPDATING INDEX.HTML CACHE BUSTER ===');
const indexHtmlPaths = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', '..', 'index.html')
];

const newVersion = '20261031_' + Date.now();
indexHtmlPaths.forEach(p => {
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/js\/app\.js\?v=[^"']+/g, `js/app.js?v=${newVersion}`);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated index.html cache-buster to:', newVersion, 'in', p);
});

console.log('\n=== ALL UPDATES APPLIED SUCCESSFULLY ===');
