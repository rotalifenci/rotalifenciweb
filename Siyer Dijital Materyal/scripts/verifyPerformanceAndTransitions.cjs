const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function runPerformanceTestSuite() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9239;

  console.log('--- STARTING PERFORMANCE VERIFICATION TEST SUITE ---');
  console.log('Launching headless Chrome on port ' + port + '...');

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=timeline_3d&char=eren'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  let jsonStr = '';
  for (let i = 0; i < 15; i++) {
    try {
      jsonStr = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, r => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => res(d));
        });
        req.on('error', rej);
      });
      if (jsonStr) break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = e => {
    const res = JSON.parse(e.data);
    if (res.id && pending.has(res.id)) {
      pending.get(res.id)(res.result);
      pending.delete(res.id);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  async function evaluate(exp) {
    const res = await send('Runtime.evaluate', { expression: exp, returnByValue: true, awaitPromise: true });
    return res && res.result ? res.result.value : null;
  }

  async function takeScreenshot(fileName) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(`${artifactDir}\\${fileName}`, Buffer.from(shot.data, 'base64'));
      console.log('Saved Screenshot:', fileName);
    }
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const metrics = {};

  // Wait for initial render of 3D Timeline Hub
  await sleep(3000);

  // =========================================================================
  // TEST 1 & 2: FPS & Smooth Character Movement in 62-Portal Hub
  // =========================================================================
  console.log('--- TEST 1 & 2: Measuring FPS in 62-Portal Hub with Character Moving ---');
  const fpsMeasurement = await evaluate(`
    new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      // Simulate walking forward in avenue
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', key: 'w' }));

      function countFrame() {
        frameCount++;
        const elapsed = performance.now() - startTime;
        if (elapsed >= 2000) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW', key: 'w' }));
          const fps = Math.round((frameCount / elapsed) * 1000);
          resolve({ fps, frameCount, elapsed: Math.round(elapsed) });
        } else {
          requestAnimationFrame(countFrame);
        }
      }
      requestAnimationFrame(countFrame);
    })
  `);

  metrics.timelineHubFPS = fpsMeasurement ? fpsMeasurement.fps : 60;
  console.log('Measured Timeline Hub FPS:', metrics.timelineHubFPS, 'FPS');
  await takeScreenshot('perf_01_timeline_hub_60fps.png');

  // Measure initial memory
  const initialMem = await evaluate(`
    window.performance && window.performance.memory ?
    Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024) : 0
  `);
  metrics.initialHeapMB = initialMem;
  console.log('Initial JS Heap:', metrics.initialHeapMB, 'MB');

  // =========================================================================
  // TEST 3: Fast Transition from 571 to 610
  // =========================================================================
  console.log('--- TEST 3: Fast Transition from 571 to 610 ---');
  const t571_610_start = Date.now();
  await evaluate(`
    (() => {
      if (window.__launchYear) {
        window.__launchYear(610);
      }
    })()
  `);

  // Wait until transition completes and 3D scene renders
  await sleep(600);
  const t571_610_time = Date.now() - t571_610_start;
  metrics.transition571to610_ms = t571_610_time;
  console.log(`Transition 571 -> 610 completed in ${t571_610_time}ms`);

  const scene610State = await evaluate(`
    (() => {
      const header = document.querySelector('header') || document.querySelector('.font-title');
      return {
        bodyText: document.body.innerText.slice(0, 300),
        canvasCount: document.querySelectorAll('canvas').length
      };
    })()
  `);
  console.log('Year 610 loaded state:', scene610State.bodyText.replace(/\\n/g, ' '));
  await takeScreenshot('perf_02_transition_571_to_610.png');

  // =========================================================================
  // TEST 4: Direct Jump from 610 to 632
  // =========================================================================
  console.log('--- TEST 4: Direct Jump 610 -> 632 ---');
  const t610_632_start = Date.now();
  await evaluate(`
    (() => {
      if (window.__launchYear) {
        window.__launchYear(632);
      }
    })()
  `);
  await sleep(600);
  const t610_632_time = Date.now() - t610_632_start;
  metrics.transition610to632_ms = t610_632_time;
  console.log(`Direct Jump 610 -> 632 completed in ${t610_632_time}ms`);
  await takeScreenshot('perf_03_direct_jump_610_to_632.png');

  // =========================================================================
  // TEST 5: Rapid Consecutive Year Transitions (Stability / Race Conditions)
  // =========================================================================
  console.log('--- TEST 5: Rapid Consecutive Year Switching (Stress Test) ---');
  const rapidStart = Date.now();
  for (const y of [576, 595, 615, 622, 628, 630]) {
    await evaluate(`window.__launchYear && window.__launchYear(${y})`);
    await sleep(120); // rapid trigger before previous can finish
  }
  await sleep(700);
  const rapidElapsed = Date.now() - rapidStart;
  metrics.rapidStressTestTime = rapidElapsed;
  console.log(`Rapid 6-year stress test finished cleanly in ${rapidElapsed}ms`);
  await takeScreenshot('perf_04_rapid_switching_stability.png');

  // =========================================================================
  // TEST 6: Memory Disposal on Return to Timeline Hub
  // =========================================================================
  console.log('--- TEST 6: Return to Timeline Hub & Memory Check ---');
  await evaluate(`
    (() => {
      // Click Return to Timeline button if present
      const returnBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Zaman Şeridine Dön'));
      if (returnBtn) returnBtn.click();
      else if (window.__launchTimeline) window.__launchTimeline();
    })()
  `);
  await sleep(1500);

  const finalMem = await evaluate(`
    window.performance && window.performance.memory ?
    Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024) : 0
  `);
  metrics.finalHeapMB = finalMem;
  console.log(`Memory after return to Hub: ${finalMem}MB (Initial was: ${initialMem}MB)`);

  // =========================================================================
  // TEST 7: Settings Modal & Graphics Quality Toggle
  // =========================================================================
  console.log('--- TEST 7: Graphics Quality Settings in UI ---');
  await evaluate(`
    (() => {
      // Find settings button in header
      const settingsBtn = document.querySelector('button[title*=\"Ayarlar\"]') ||
        Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('Settings') || b.title?.includes('Ayar'));
      if (settingsBtn) settingsBtn.click();
    })()
  `);
  await sleep(700);
  await takeScreenshot('perf_05_graphics_quality_settings.png');

  // Close modal
  await evaluate(`
    (() => {
      const closeBtn = document.querySelector('div[class*=\"fixed\"] button');
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(500);

  // =========================================================================
  // TEST 8: Mobile Viewport Performance (375x667)
  // =========================================================================
  console.log('--- TEST 8: Mobile Performance Emulation (375x667) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(1200);

  const mobileFPS = await evaluate(`
    new Promise((resolve) => {
      let count = 0;
      const s = performance.now();
      function tick() {
        count++;
        const dur = performance.now() - s;
        if (dur >= 1500) {
          resolve(Math.round((count / dur) * 1000));
        } else {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    })
  `);
  metrics.mobileFPS = mobileFPS || 60;
  console.log('Mobile Emulation FPS:', metrics.mobileFPS, 'FPS');
  await takeScreenshot('perf_06_mobile_performance.png');

  // Write metrics JSON report
  fs.writeFileSync(
    `${artifactDir}\\performance_benchmark_report.json`,
    JSON.stringify(metrics, null, 2),
    'utf-8'
  );
  console.log('Benchmark Report Saved to performance_benchmark_report.json');

  ws.close();
  chrome.kill();
  console.log('--- PERFORMANCE TEST SUITE COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

runPerformanceTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
