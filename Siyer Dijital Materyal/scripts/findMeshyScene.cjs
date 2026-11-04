const { spawn } = require('child_process');
const http = require('http');

async function findScene() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9897;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'https://www.meshy.ai/s/5LR698'
  ]);

  await new Promise(r => setTimeout(r, 4000));
  const res = await new Promise((resolve) => {
    http.get('http://127.0.0.1:' + port + '/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(d));
    });
  });

  const pages = JSON.parse(res);
  const target = pages.find(p => p.url.includes('meshy.ai')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = (e) => {
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
  await new Promise(r => setTimeout(r, 7000));

  const probe = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'No canvas' };

        // 1. Check React fiber on canvas
        const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        let fiber = canvas[fiberKey];
        
        let foundScene = null;
        let foundMeshes = [];

        // Traverse fiber upwards
        let curr = fiber;
        let depth = 0;
        while (curr && depth < 30) {
          if (curr.memoizedProps) {
            for (const [k, v] of Object.entries(curr.memoizedProps)) {
              if (v && typeof v === 'object') {
                if (v.isScene || (v.type === 'Scene')) foundScene = 'in_memoizedProps_' + k;
                if (v.scene && v.scene.isScene) foundScene = 'in_scene_prop_' + k;
              }
            }
          }
          if (curr.memoizedState) {
            let s = curr.memoizedState;
            while (s) {
              if (s.memoizedState && s.memoizedState.scene && s.memoizedState.scene.isScene) {
                foundScene = 'in_memoizedState_scene';
              }
              s = s.next;
            }
          }
          curr = curr.return;
          depth++;
        }

        return {
          fiberFound: !!fiber,
          foundScene
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Probe result:', probe.result.value);
  chrome.kill();
}

findScene().catch(console.error);
