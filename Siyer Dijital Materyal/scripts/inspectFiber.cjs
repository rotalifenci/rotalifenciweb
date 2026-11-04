const { spawn } = require('child_process');
const http = require('http');

async function inspectFiber() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9881;

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'https://www.meshy.ai/s/5LR698'
  ]);

  await new Promise(r => setTimeout(r, 4500));

  let jsonStr = '';
  for (let i = 0; i < 8; i++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:' + port + '/json', res => {
          let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
        });
        req.on('error', reject);
        req.setTimeout(1500, () => { req.destroy(); reject(new Error('timeout')); });
      });
      if (jsonStr && jsonStr.trim().startsWith('[')) break;
    } catch {
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('meshy.ai')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = e => {
        const d = JSON.parse(e.data);
        if (d.id === id) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 9000));

  const probe = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber$'));
        const propsKey = Object.keys(canvas).find(k => k.startsWith('__reactProps$'));

        const props = canvas[propsKey];
        const fiber = canvas[fiberKey];

        // Search for scene in fiber ancestors and siblings
        let found = [];
        let cur = fiber;
        let depth = 0;
        while (cur && depth < 40) {
          if (cur.stateNode) {
            const snKeys = Object.keys(cur.stateNode);
            for (const k of snKeys) {
              try {
                const val = cur.stateNode[k];
                if (val && typeof val === 'object') {
                  if (val.isScene || val.isObject3D || val.isMesh) {
                    found.push('stateNode.' + k + ' (' + val.type + ')');
                  }
                  if (val.scene && val.scene.isScene) {
                    found.push('stateNode.' + k + '.scene');
                  }
                }
              } catch(e) {}
            }
          }
          if (cur.memoizedState) {
            let s = cur.memoizedState;
            let sIdx = 0;
            while (s) {
              if (s.memoizedState) {
                const ms = s.memoizedState;
                if (ms && typeof ms === 'object') {
                  if (ms.isScene || ms.isObject3D) found.push('memoizedState[' + sIdx + '] (' + ms.type + ')');
                  if (ms.scene && ms.scene.isScene) found.push('memoizedState[' + sIdx + '].scene');
                  if (ms.current && ms.current.isScene) found.push('memoizedState[' + sIdx + '].current (Scene)');
                  if (ms.current && ms.current.scene && ms.current.scene.isScene) found.push('memoizedState[' + sIdx + '].current.scene');
                }
              }
              s = s.next;
              sIdx++;
            }
          }
          cur = cur.return;
          depth++;
        }

        return {
          found
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Fiber search result:', probe.result.value);
  chrome.kill();
}

inspectFiber().catch(console.error);
