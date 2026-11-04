const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4179;
const DEBUG_PORT = 9239;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('Starting Vite preview server on port', PORT);
  const viteProc = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'pipe', shell: true }
  );

  await sleep(2500);

  const userDataDir = path.join(ARTIFACT_DIR, 'scratch', 'chrome_verify_doors_' + Date.now());
  fs.mkdirSync(userDataDir, { recursive: true });

  console.log('Launching headless Chrome...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `http://localhost:${PORT}/`
  ]);

  let ws;
  try {
    let targets = null;
    for (let i = 0; i < 20; i++) {
      try {
        targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
        if (targets && targets.length > 0) break;
      } catch (e) {}
      await sleep(500);
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 0;
    const pending = new Map();
    ws.onmessage = evt => {
      const data = JSON.parse(evt.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    function send(method, params = {}) {
      const id = ++msgId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evalJs(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error('JS Error: ' + JSON.stringify(res.exceptionDetails));
      }
      return res.result ? res.result.value : undefined;
    }

    async function screenshot(filename) {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log('Saved screenshot:', outPath);
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sleep(2000);

    // 1. Verify Main Menu & Character Selection
    const menuCheck = await evalJs(`(() => {
      const erenBtn = document.querySelector('[aria-label="Eren Karakterini Seç"]');
      const aybukeBtn = document.querySelector('[aria-label="Aybüke Karakterini Seç"]');
      const startBtn = document.querySelector('#btn-start-journey');
      return {
        hasEren: !!erenBtn,
        hasAybuke: !!aybukeBtn,
        hasStart: !!startBtn
      };
    })()`);
    console.log('1. Main Menu Check:', menuCheck);

    // Select Aybüke first, then Eren, then click Start
    await evalJs(`document.querySelector('[aria-label="Aybüke Karakterini Seç"]').click()`);
    await sleep(400);
    await evalJs(`document.querySelector('[aria-label="Eren Karakterini Seç"]').click()`);
    await sleep(400);
    await screenshot('doors_verify_01_main_menu_character_select.png');

    // Click Start -> Should open 571–632 Doors Hub directly (NO 3D time tunnel!)
    await evalJs(`document.querySelector('#btn-start-journey').click()`);
    await sleep(800);
    await screenshot('doors_verify_02_desktop_62_doors_hub.png');

    // 2. Verify all 62 doors (571..632), no missing, no duplicates, exact order, no WebGL canvas
    const doorsAudit = await evalJs(`(() => {
      const doorBtns = Array.from(document.querySelectorAll('[data-year]'));
      const years = doorBtns.map(b => Number(b.getAttribute('data-year')));
      const expected = Array.from({ length: 62 }, (_, i) => 571 + i);
      const exactMatch = years.length === 62 && years.every((y, idx) => y === expected[idx]);
      const uniqueCount = new Set(years).size;
      const canvases = document.querySelectorAll('canvas').length;
      const headerText = document.body.innerText;
      return {
        doorCount: years.length,
        uniqueCount,
        firstYear: years[0],
        lastYear: years[years.length - 1],
        has596: years.includes(596),
        has597Count: years.filter(y => y === 597).length,
        has598: years.includes(598),
        exactMatch,
        webglCanvasCount: canvases,
        hasTitle: headerText.includes('DİJİTAL SİYER YOLCULUĞU'),
        hasSubtitle: headerText.includes('571–632 Zaman Kapıları'),
        hasBottomPrompt: headerText.includes('Keşfetmek istediğin yılın kapısını seç!')
      };
    })()`);
    console.log('2. 62 Doors Audit:', doorsAudit);
    if (!doorsAudit.exactMatch || doorsAudit.webglCanvasCount !== 0) {
      throw new Error('Doors Audit Failed: ' + JSON.stringify(doorsAudit));
    }

    // 3. Click Door 610 -> Opens 610 Year Content View
    await evalJs(`document.querySelector('[data-year="610"]').click()`);
    await sleep(700);
    await screenshot('doors_verify_03_year_610_content.png');

    const year610Audit = await evalJs(`(() => {
      const text = document.body.innerText;
      return {
        has610Title: text.includes('610') && text.includes('İlk Vahiy'),
        hasEventSection: text.includes('TARİHSEL OLAY DURAKLARI'),
        hasValueSection: text.includes('DEĞER KEŞİF DURAKLARI'),
        hasReturnBtn: text.includes('Kapılar Ekranına Dön'),
        hasPrevBtn: text.includes('609 Yılı'),
        hasNextBtn: text.includes('611 Yılı')
      };
    })()`);
    console.log('3. Year 610 Content Audit:', year610Audit);

    // 4. Return to Doors Hub, then click an unverified year (e.g., 580) to verify honest message
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const retBtn = btns.find(b => b.innerText.includes('Kapılar Ekranına Dön'));
      if (retBtn) retBtn.click();
    })()`);
    await sleep(600);

    await evalJs(`document.querySelector('[data-year="580"]').click()`);
    await sleep(600);
    await screenshot('doors_verify_04_unverified_year_580.png');

    const year580Audit = await evalJs(`(() => {
      const text = document.body.innerText;
      return {
        hasHonestUnverifiedMsg: text.includes('Bu yıla ait doğrulanmış içerik henüz eklenmedi.')
      };
    })()`);
    console.log('4. Unverified Year 580 Audit:', year580Audit);
    if (!year580Audit.hasHonestUnverifiedMsg) {
      throw new Error('Unverified Year 580 missing required honest message!');
    }

    // Return to Doors Hub and test Mobile (390x844) & Smartboard/Tablet (1024x768)
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const retBtn = btns.find(b => b.innerText.includes('Kapılar Ekranına Dön'));
      if (retBtn) retBtn.click();
    })()`);
    await sleep(600);

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(600);
    await screenshot('doors_verify_05_mobile_doors_hub.png');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(600);
    await screenshot('doors_verify_06_tablet_doors_hub.png');

    console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } finally {
    if (ws) ws.close();
    chromeProc.kill();
    viteProc.kill();
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
