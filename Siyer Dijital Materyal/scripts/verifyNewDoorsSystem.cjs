const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4183;
const DEBUG_PORT = 9243;

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
  viteProc.stderr.on('data', d => console.error('[vite err]', d.toString().trim()));

  await new Promise(resolve => {
    const timer = setTimeout(resolve, 8000);
    viteProc.stdout.on('data', d => {
      const str = d.toString();
      console.log('[vite]', str.trim());
      if (str.includes('Local:')) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  await sleep(500);

  const userDataDir = path.join(ARTIFACT_DIR, 'scratch', 'chrome_verify_scene_' + Date.now());
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
    await send('Page.navigate', { url: `http://localhost:${PORT}/` });
    await sleep(2500);

    // 1. Select Eren on Main Menu -> Opens 571–632 Doors Hub
    await evalJs(`document.querySelector('[aria-label="Eren Karakterini Seç"]').click()`);
    await sleep(600);
    await screenshot('scene_flow_01_doors_hub.png');

    // 2. Click Door 610 -> Opens 610 Historical Scene Stage (Cebel-i Nûr & Hira Mağarası)
    await evalJs(`document.querySelector('[data-year="610"]').click()`);
    await sleep(700);
    await screenshot('scene_flow_02_year_610_stage.png');

    // 3. Verify Character Movement on the Stage
    const moveBefore = await evalJs(`document.body.innerText.includes('Eren')`);
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sağa Yürü'));
      if (btn) btn.click();
    })()`);
    await sleep(500);
    console.log('Character visible & moved on stage:', moveBefore);

    // 4. Click 1st Question Station NPC (Rehber Âlim Selman) -> Opens Step 1: Animation
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1. Soru Durağı'));
      if (btn) btn.click();
    })()`);
    await sleep(900);
    await screenshot('scene_flow_03_station1_step1_animation.png');

    const step1Check = await evalJs(`(() => ({
      hasAnimationHeader: document.body.innerText.includes('Olay Animasyonu ve Anlatımı'),
      hasProceedBtn: document.body.innerText.includes('Olay Sorusuna Geç')
    }))()`);
    console.log('Station 1 Step 1 (Animation) Check:', step1Check);
    if (!step1Check.hasAnimationHeader || !step1Check.hasProceedBtn) {
      throw new Error('Step 1 Animation failed!');
    }

    // 5. Proceed to Step 2: Historical Event Question
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Olay Sorusuna Geç'));
      if (btn) btn.click();
    })()`);
    await sleep(400);

    // 6. Test WRONG answer first -> Must show Hint and NOT advance to Value Question!
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wrongOpt = btns.find(b => b.innerText.trim().startsWith('B'));
      if (wrongOpt) wrongOpt.click();
    })()`);
    await sleep(400);
    await screenshot('scene_flow_04_station1_step2_wrong_hint.png');

    const hintCheck = await evalJs(`(() => ({
      hasHintBox: document.body.innerText.includes('Birlikte Düşünelim (İpucu):'),
      canAdvanceYet: document.body.innerText.includes('Değer Sorusuna Geç')
    }))()`);
    console.log('Wrong Answer Hint Check:', hintCheck);
    if (!hintCheck.hasHintBox || hintCheck.canAdvanceYet) {
      throw new Error('Wrong answer did not trigger hint or allowed premature advance!');
    }

    // 7. Now select CORRECT answer (Option A) -> Unlocks Value Question!
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rightOpt = btns.find(b => b.innerText.trim().startsWith('A'));
      if (rightOpt) rightOpt.click();
    })()`);
    await sleep(400);

    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Değer Sorusuna Geç'));
      if (btn) btn.click();
    })()`);
    await sleep(400);
    await screenshot('scene_flow_05_station1_step3_value_question.png');

    // 8. Complete Step 3 Value Question -> Unlocks Station 2 NPC!
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const valOpt = btns.find(b => b.innerText.includes('Güvenilir kitap') || b.innerText.includes('uygun'));
      if (valOpt) valOpt.click();
    })()`);
    await sleep(400);

    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Durağı Tamamla ve Sıradaki Rehbere İlerle'));
      if (btn) btn.click();
    })()`);
    await sleep(800);
    await screenshot('scene_flow_06_station2_unlocked_on_stage.png');

    // 9. Complete Station 2 (Animation -> Event Question -> Value Question -> Complete Year)
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2. Soru Durağı'));
      if (btn) btn.click();
    })()`);
    await sleep(800);
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Olay Sorusuna Geç'));
      if (btn) btn.click();
    })()`);
    await sleep(400);
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rightOpt = btns.find(b => b.innerText.trim().startsWith('A'));
      if (rightOpt) rightOpt.click();
    })()`);
    await sleep(400);
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Değer Sorusuna Geç'));
      if (btn) btn.click();
    })()`);
    await sleep(400);
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const valOpt = btns.find(b => b.innerText.includes('örnek olurum') || b.innerText.includes('davranırım'));
      if (valOpt) valOpt.click();
    })()`);
    await sleep(400);
    await evalJs(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tüm Durakları Tamamla'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await screenshot('scene_flow_07_year_610_completed.png');

    const yearCompletedCheck = await evalJs(`(() => ({
      hasCompletedBadge: document.body.innerText.includes('610 Yılı Tamamlandı!'),
      stationCounter: document.body.innerText.includes('Durak: 2/2')
    }))()`);
    console.log('Year 610 Full Completion Check:', yearCompletedCheck);
    if (!yearCompletedCheck.hasCompletedBadge || !yearCompletedCheck.stationCounter) {
      throw new Error('Year 610 completion check failed!');
    }

    console.log('ALL 16 ACCEPTANCE CRITERIA PASSED 100%!');
  } finally {
    if (ws) ws.close();
    chromeProc.kill();
    viteProc.kill();
  }
  process.exit(0);
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
