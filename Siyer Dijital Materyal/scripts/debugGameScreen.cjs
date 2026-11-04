const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9224/json', res => {
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
    return;
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' '));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description);
    }
  };

  await new Promise(r => ws.onopen = r);

  await send('Runtime.enable');
  await send('Console.enable');
  await send('Page.enable');

  await new Promise(r => setTimeout(r, 1000));

  // Click the "Başla" button!
  console.log('Clicking "Başla" button...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  // Inspect debug object
  const debugInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const dbg = window.__debugGame;
        if (!dbg) return { error: '__debugGame not found on window!' };
        const { scene, camera, char, playerPos } = dbg;
        return {
          cameraPos: camera.position,
          cameraTarget: char.group.position,
          playerPos: playerPos,
          charGroupChildrenCount: char.group.children.length,
          charGroupChildren: char.group.children.map(c => ({
            name: c.name,
            type: c.type,
            visible: c.visible,
            childrenCount: c.children.length
          })),
          charLoaded: char.isLoaded,
          currentAction: char.currentActionName,
          sceneChildrenCount: scene.children.length
        };
      })()
    `,
    returnByValue: true
  });
  console.log('DEBUG INFO:', JSON.stringify(debugInfo, null, 2));

  // Capture screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('gameplay_debug.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot: gameplay_debug.png');
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
