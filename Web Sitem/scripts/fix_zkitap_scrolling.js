const fs = require('fs');

function fixScrollingInEngine(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. html, body overflow: hidden
  code = code.replace(
    /html,\s*body\s*\{[\s\S]*?font-family:[^;]+;\s*user-select:\s*text;\s*\}/,
    `html, body {
      width: 100%;
      height: 100vh;
      overflow: hidden; /* Ekranda kaydırma KESİNLİKLE olmasın (Z-Kitap Akıllı Tahta) */
      background: var(--zk-bg);
      color: var(--zk-text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: text;
    }`
  );

  // 2. body min-height vs height
  code = code.replace(
    /body\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*min-height:\s*100vh;\s*\}/,
    `body {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
    }`
  );

  // 3. zk-main-viewport
  code = code.replace(
    /\.zk-main-viewport\s*\{[\s\S]*?min-height:\s*calc\(100vh\s*-\s*130px\);\s*\}/,
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
      padding: 10px 24px 70px 24px;
      height: calc(100vh - 120px);
      max-height: calc(100vh - 120px);
      overflow: hidden;
      box-sizing: border-box;
    }`
  );

  // 4. zk-visual-container
  code = code.replace(
    /\.zk-visual-container\s*\{[\s\S]*?max-height:\s*40vh;\s*overflow:\s*hidden;\s*\}/,
    `.zk-visual-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 6px 0 10px 0;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 6px 12px;
      max-height: 25vh;
      overflow: hidden;
      flex-shrink: 1;
    }`
  );

  code = code.replace(
    /\.zk-visual-container svg,\s*\.zk-visual-container img\s*\{[\s\S]*?max-height:\s*38vh;[\s\S]*?\}/,
    `.zk-visual-container svg, .zk-visual-container img {
      max-width: 100%;
      max-height: 24vh;
      width: auto;
      height: auto;
      object-fit: contain;
    }`
  );

  // 5. zk-question-stem font sizes
  code = code.replace(
    /\.zk-size-large\s*\{\s*font-size:\s*calc\(30px\s*\*\s*var\(--zk-font-scale,\s*1\.0\)\);\s*\}/,
    `.zk-size-large {
      font-size: clamp(19px, 1.85vw, calc(26px * var(--zk-font-scale, 1.0)));
      line-height: 1.45;
    }`
  );
  code = code.replace(
    /\.zk-size-medium\s*\{\s*font-size:\s*calc\(26px\s*\*\s*var\(--zk-font-scale,\s*1\.0\)\);\s*\}/,
    `.zk-size-medium {
      font-size: clamp(17px, 1.6vw, calc(23px * var(--zk-font-scale, 1.0)));
      line-height: 1.4;
    }`
  );
  code = code.replace(
    /\.zk-size-compact\s*\{\s*font-size:\s*calc\(22px\s*\*\s*var\(--zk-font-scale,\s*1\.0\)\);[\s\S]*?\}/,
    `.zk-size-compact {
      font-size: clamp(15px, 1.4vw, calc(19px * var(--zk-font-scale, 1.0)));
      line-height: 1.35;
    }`
  );

  // 6. zk-inline-short-box & zk-inline-open-box
  code = code.replace(
    /\.zk-inline-short-box,\s*\.zk-inline-open-box\s*\{[\s\S]*?margin-top:\s*20px;[\s\S]*?padding:\s*18px\s*20px;[\s\S]*?border-radius:\s*14px;\s*\}/,
    `.zk-inline-short-box, .zk-inline-open-box {
      margin-top: 10px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      flex-shrink: 0;
    }`
  );

  code = code.replace(
    /\.zk-inline-textarea\s*\{[\s\S]*?rows="3"[\s\S]*?\}/,
    `.zk-inline-textarea {
      width: 100%;
      font-size: clamp(14px, 1.25vw, 17px);
      padding: 8px 12px;
      border-radius: 8px;
      border: 1.5px solid #93c5fd;
      background: #ffffff;
      color: #0f172a;
      font-weight: 600;
      line-height: 1.45;
      max-height: 70px;
      resize: none;
    }`
  );

  // Also replace options padding
  code = code.replace(
    /\.zk-option-item\s*\{[\s\S]*?gap:\s*14px;[\s\S]*?padding:\s*14px\s*20px;[\s\S]*?font-size:\s*calc\(22px\s*\*\s*var\(--zk-font-scale,\s*1\.0\)\);[\s\S]*?\}/,
    `.zk-option-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 10px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.15s ease;
      color: #0f172a;
      font-size: clamp(15px, 1.35vw, calc(20px * var(--zk-font-scale, 1.0)));
      line-height: 1.35;
      user-select: none;
    }`
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed scrolling in:', filePath);
}

fixScrollingInEngine('scripts/zkitap_engine.js');
fixScrollingInEngine('api/zkitap_engine.js');
if (fs.existsSync('../Yaprak Test/zkitap_engine.js')) {
  fixScrollingInEngine('../Yaprak Test/zkitap_engine.js');
}
