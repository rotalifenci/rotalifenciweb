const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9228/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  if (!target) {
    console.error('Target page not found!');
    chrome.kill();
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Input.enable');
  await send('Page.enable');

  await new Promise(r => setTimeout(r, 1200));

  async function evaluate(code) {
    const res = await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true
    });
    return res && res.result ? res.result.value : null;
  }

  console.log('=== TEST 1: Select Aybüke and Enter Mecca ===');
  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('div, button'));
      const aybukeCard = btns.find(b => b.textContent && b.textContent.includes('Aybüke'));
      if (aybukeCard) aybukeCard.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 600));

  // Click "Başla"
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`);

  await new Promise(r => setTimeout(r, 2600));

  // Screenshot initial spawn in Mecca
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_spawn.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_spawn.png');
  }

  // Verify Aybüke mesh hierarchy
  const meshCheck = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      if (!dbg || !dbg.char) return { error: 'No debug char' };
      
      let hasBook = false;
      let hasBackpack = false;
      let leftHandChildren = 0;
      let rightHandChildren = 0;

      dbg.char.group.traverse(obj => {
        if (obj.name === 'LeftHand') leftHandChildren = obj.children.length;
        if (obj.name === 'RightHand') rightHandChildren = obj.children.length;
        // Check for book
        if (obj.isMesh && obj.geometry && obj.geometry.parameters && obj.geometry.parameters.width === 0.15) {
          hasBook = true;
        }
        // Check for backpack on chest
        if (obj.isMesh && obj.geometry && obj.geometry.parameters && obj.geometry.parameters.width === 0.23) {
          hasBackpack = true;
        }
      });

      return {
        charType: dbg.char.type,
        hasBook,
        hasBackpack,
        leftHandChildren,
        rightHandChildren,
        currentAction: dbg.char.currentActionName
      };
    })()
  `);
  console.log('AYBÜKE MESH & RIG VERIFICATION:', JSON.stringify(meshCheck, null, 2));

  console.log('\n=== TEST 2: On-screen "Koş" Button Toggle ===');
  const sprintClickResult = await evaluate(`
    (() => {
      const sprintBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('KOŞ') || b.textContent.includes('KOŞUYOR')));
      if (!sprintBtn) return { error: 'Sprint button not found' };
      const textBefore = sprintBtn.textContent.trim();
      sprintBtn.click();
      return { textBefore };
    })()
  `);
  console.log('Sprint button clicked, before text:', sprintClickResult);

  await new Promise(r => setTimeout(r, 400));

  const sprintStateAfter = await evaluate(`
    (() => {
      const sprintBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('KOŞ') || b.textContent.includes('KOŞUYOR')));
      return {
        textAfter: sprintBtn ? sprintBtn.textContent.trim() : null,
        isSprintingActive: sprintBtn ? sprintBtn.textContent.includes('KOŞUYOR') : false
      };
    })()
  `);
  console.log('Sprint button state after click:', sprintStateAfter);

  console.log('\n=== TEST 3: Running with Sprint Active ===');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 800));

  const runCheck = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        currentAction: dbg.char.currentActionName,
        posZ: dbg.playerPos.z,
        posY: dbg.playerPos.y
      };
    })()
  `);
  console.log('RUNNING CHECK:', JSON.stringify(runCheck, null, 2));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_running.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_running.png');
  }

  // Release KeyW
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 600));

  const idleCheck = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        currentAction: dbg.char.currentActionName
      };
    })()
  `);
  console.log('AFTER STOPPING (Should be idle):', idleCheck);

  console.log('\n=== TEST 4: Automatic Camera Follow upon Turning ===');
  const initialTransform = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        camX: dbg.camera.position.x,
        camZ: dbg.camera.position.z,
        charRotY: dbg.char.group.rotation.y
      };
    })()
  `);
  console.log('Initial transform before turning:', initialTransform);

  // Turn Left with KeyA for 1200ms
  console.log('Turning Left (KeyA) without touching mouse...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyA', key: 'a' });

  await new Promise(r => setTimeout(r, 600));

  const leftTurnTransform = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        camX: dbg.camera.position.x,
        camZ: dbg.camera.position.z,
        charRotY: dbg.char.group.rotation.y,
        autoCameraFollowed: Math.abs(dbg.camera.position.x - ${initialTransform.camX}) > 0.5
      };
    })()
  `);
  console.log('Transform after turning Left:', leftTurnTransform);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_turned.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_turned.png');
  }

  // Turn Right with KeyD for 1200ms
  console.log('Turning Right (KeyD) without touching mouse...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyD', key: 'd' });

  await new Promise(r => setTimeout(r, 600));

  console.log('\n=== TEST 5: Verify Ground Elevation (Zero Sinking) ===');
  const groundCheck = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        playerPosY: dbg.playerPos.y,
        isAboveOrAtGround: dbg.playerPos.y >= 0.0,
        charPosY: dbg.char.group.position.y
      };
    })()
  `);
  console.log('GROUND ELEVATION CHECK:', groundCheck);

  console.log('\n=== TEST 6: Single-line HUD Layout Verification ===');
  const hudCheck = await evaluate(`
    (() => {
      const hudPill = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('İlerleme:') && d.textContent.includes('Hak:'));
      if (!hudPill) return { error: 'HUD pill not found' };
      const rect = hudPill.getBoundingClientRect();
      return {
        text: hudPill.innerText.replace(/\\n/g, ' '),
        width: rect.width,
        height: rect.height,
        isSingleLine: rect.height < 50
      };
    })()
  `);
  console.log('HUD CHECK:', hudCheck);

  ws.close();
  chrome.kill();
  console.log('\nAll tests completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
