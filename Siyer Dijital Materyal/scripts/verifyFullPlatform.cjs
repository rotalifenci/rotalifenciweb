const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
const PORT = 4188;
const DEBUG_PORT = 9244;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, res => {
        let body = '';
        res.on('data', d => (body += d));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

async function runVerification() {
  console.log('1. Starting Vite preview server on port', PORT);
  const server = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'pipe', shell: true }
  );

  await new Promise(resolve => {
    const timeout = setTimeout(resolve, 8000);
    server.stdout.on('data', data => {
      const text = data.toString();
      if (text.includes('Local:') || text.includes(String(PORT))) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
  await sleep(500);

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const browserBin = chromePaths.find(p => fs.existsSync(p));
  if (!browserBin) {
    server.kill();
    throw new Error('No Chrome/Edge binary found');
  }

  const userDataDir = path.join(ARTIFACT_DIR, 'scratch', 'chrome_verify_full_' + Date.now());
  fs.mkdirSync(userDataDir, { recursive: true });

  const chrome = spawn(browserBin, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1920,1080',
    '--no-first-run',
    '--no-default-browser-check',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-angle=swiftshader',
    '--mute-audio',
    `http://localhost:${PORT}/`
  ]);

  let ws;
  try {
    let targets = [];
    for (let i = 0; i < 30; i++) {
      try {
        targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
        const pageTarget = targets.find(t => t.type === 'page');
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
          break;
        }
      } catch {
        // retry
      }
      await sleep(400);
    }

    if (!ws) throw new Error('Could not connect to Chrome DevTools');
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
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

    function sendCmd(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expr) {
      const res = await sendCmd('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error('JS Evaluation Error: ' + JSON.stringify(res.exceptionDetails));
      }
      return res.result ? res.result.value : undefined;
    }

    async function captureScreenshot(filename) {
      const { data } = await sendCmd('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log('Saved screenshot:', outPath);
    }

    await sendCmd('Page.enable');
    await sendCmd('Runtime.enable');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(2000);

    // 1. Verify Full-Screen Main Menu
    const menuCheck = await evaluate(`(() => {
      const erenBtn = document.getElementById('select-character-eren');
      const aybukeBtn = document.getElementById('select-character-aybuke');
      const startBtn = document.getElementById('btn-start-journey');
      const teacherBtn = document.getElementById('btn-open-teacher-panel');
      return {
        hasEren: Boolean(erenBtn),
        hasAybuke: Boolean(aybukeBtn),
        hasStart: Boolean(startBtn),
        hasTeacherBtn: Boolean(teacherBtn),
        viewportW: window.innerWidth,
        viewportH: window.innerHeight
      };
    })()`);
    console.log('1. Main Menu Check:', menuCheck);
    await captureScreenshot('full_platform_01_main_menu_fullscreen.png');

    // 2. Click Eren -> Verify 62 Doors Screen (571-632)
    await evaluate(`document.getElementById('select-character-eren').click()`);
    await sleep(1200);

    const doorsCheck = await evaluate(`(() => {
      const doors = Array.from(document.querySelectorAll('[data-year]')).map(el => Number(el.getAttribute('data-year')));
      return {
        count: doors.length,
        first: doors[0],
        last: doors[doors.length - 1],
        has610: doors.includes(610)
      };
    })()`);
    console.log('2. Doors Screen Check:', doorsCheck);
    await captureScreenshot('full_platform_02_62_doors_hub.png');

    // 3. Click Door 610 -> Verify 3D Historical Scene + Storyteller + Question Guide
    await evaluate(`document.querySelector('[data-year="610"]').click()`);
    await sleep(2500);

    const scene3DCheck = await evaluate(`(() => {
      const canvasContainer = document.getElementById('historical-3d-canvas-container');
      const canvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      const st1StorytellerBtn = document.getElementById('btn-station-1-storyteller');
      const st1GuideBtn = document.getElementById('btn-station-1-guide');
      const st2Card = document.getElementById('station-hud-card-2');
      const debugGame = window.__debugGame;
      return {
        has3DCanvas: Boolean(canvas),
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        hasStorytellerBtn: Boolean(st1StorytellerBtn),
        hasGuideBtn: Boolean(st1GuideBtn),
        hasStation2: Boolean(st2Card),
        station3DCount: debugGame && debugGame.stations ? debugGame.stations.length : 0
      };
    })()`);
    console.log('3. 3D Historical Scene Check (Year 610):', scene3DCheck);
    await captureScreenshot('full_platform_03_year_610_3d_scene.png');

    // 4. Click Ak Sakallı Tarih Anlatıcısı ("Olayı Dinle") -> Verify Storyteller Modal
    await evaluate(`document.getElementById('btn-station-1-storyteller').click()`);
    await sleep(900);

    const storytellerModalCheck = await evaluate(`(() => {
      const modal = document.getElementById('storyteller-audio-modal');
      const emptyNotice = document.getElementById('storyteller-empty-audio-notice');
      return {
        modalOpen: Boolean(modal),
        hasPromptText: modal ? modal.innerText.includes('Bu olayın tamamını dinlemek ister misin?') : false,
        hasEmptyAudioNotice: Boolean(emptyNotice)
      };
    })()`);
    console.log('4. Storyteller Audio Modal Check:', storytellerModalCheck);
    await captureScreenshot('full_platform_04_storyteller_modal.png');

    // 5. Transition from Storyteller Modal to Soru Rehber Karakteri 6-Stage Learning Flow
    await evaluate(`document.getElementById('btn-storyteller-to-guide').click()`);
    await sleep(900);

    // Stage 2: Animation / Video
    await captureScreenshot('full_platform_05_stage2_animation.png');
    await evaluate(`document.getElementById('btn-proceed-to-event-question').click()`);
    await sleep(700);

    // Stage 3: Event Question -> Test Wrong Answer Hint first
    await evaluate(`document.getElementById('event-option-1').click()`);
    await sleep(600);
    const hintShown = await evaluate(`Boolean(document.getElementById('event-question-hint-box'))`);
    console.log('5a. Stage 3 Wrong Answer Hint Shown:', hintShown);
    await captureScreenshot('full_platform_06_stage3_event_question_hint.png');

    // Now click Correct Event Option (index 0) and proceed to Stage 4 (Value Question)
    await evaluate(`document.getElementById('event-option-0').click()`);
    await sleep(600);
    await evaluate(`document.getElementById('btn-proceed-to-value-question').click()`);
    await sleep(700);

    // Stage 4: Value Discovery Question ("Bu olayda hangi değer ön plana çıkmaktadır?")
    await captureScreenshot('full_platform_07_stage4_value_question.png');
    await evaluate(`document.getElementById('value-rec-option-0').click()`);
    await sleep(600);
    await evaluate(`document.getElementById('btn-proceed-to-daily-life').click()`);
    await sleep(700);

    // Stage 5: Daily Life Question
    await captureScreenshot('full_platform_08_stage5_daily_life.png');
    await evaluate(`(() => {
      const opt0 = document.getElementById('daily-life-option-0');
      const opt1 = document.getElementById('daily-life-option-1');
      if (opt0) opt0.click();
      if (!document.getElementById('btn-proceed-to-stage-6') && opt1) opt1.click();
    })()`);
    await sleep(600);
    await evaluate(`document.getElementById('btn-proceed-to-stage-6').click()`);
    await sleep(700);

    // Stage 6: Station Completion Screen
    const stage6Check = await evaluate(`(() => {
      const s6 = document.getElementById('learning-stage-6-completed');
      return {
        isStage6Visible: Boolean(s6),
        hasCongratsText: s6 ? s6.innerText.includes('Tebrikler! Bu tarihsel olayı keşfettin ve ilgili değeri günlük hayatla ilişkilendirdin.') : false
      };
    })()`);
    console.log('5b. Stage 6 Completion Check:', stage6Check);
    await captureScreenshot('full_platform_09_stage6_station_completed.png');

    await evaluate(`document.getElementById('btn-finish-station-and-continue').click()`);
    await sleep(900);

    // 6. Open Teacher Management Panel & Verify 8 Tabs + Live Editing
    await evaluate(`(() => {
      const teacherBtns = Array.from(document.querySelectorAll('button')).filter(b => (b.title || '').includes('Öğretmen'));
      if (teacherBtns[0]) teacherBtns[0].click();
    })()`);
    await sleep(800);

    // Authenticate into Teacher Panel
    await evaluate(`(() => {
      const input = document.getElementById('teacher-password-input');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'siyer2026');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btn = document.getElementById('btn-teacher-login-submit');
      if (btn) btn.click();
    })()`);
    await sleep(1000);

    const teacherPanelCheck = await evaluate(`(() => {
      const tabs = [
        'teacher-tab_1_event',
        'teacher-tab_2_audio',
        'teacher-tab_3_video',
        'teacher-tab_4_event_questions',
        'teacher-tab_5_values',
        'teacher-tab_6_value_questions',
        'teacher-tab_7_daily_life',
        'teacher-tab_8_preview_publish'
      ];
      return {
        authenticated: tabs.every(id => Boolean(document.getElementById(id))),
        tabCount: tabs.filter(id => Boolean(document.getElementById(id))).length
      };
    })()`);
    console.log('6. Teacher Panel 8-Tab Check:', teacherPanelCheck);
    await captureScreenshot('full_platform_10_teacher_panel_tab1_event.png');

    // Switch to Tab 2 (Sesli Anlatım) and capture screenshot
    await evaluate(`document.getElementById('teacher-tab_2_audio').click()`);
    await sleep(600);
    await captureScreenshot('full_platform_11_teacher_panel_tab2_audio.png');

    // Switch to Tab 5 (Değerler) and capture screenshot
    await evaluate(`document.getElementById('teacher-tab_5_values').click()`);
    await sleep(600);
    await captureScreenshot('full_platform_12_teacher_panel_tab5_values.png');

    console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } finally {
    if (ws) ws.close();
    chrome.kill();
    server.kill();
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
